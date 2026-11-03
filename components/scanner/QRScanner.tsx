'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { X, Camera } from 'lucide-react'
import Button from '@/components/ui/Button'
import jsQR from 'jsqr'

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | undefined>(undefined)

  const stopScanner = useCallback(() => {
    setIsScanning(false)
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) {
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      })

      if (code) {
        stopScanner()
        onScan(code.data)
        return
      }
    }

    animationRef.current = requestAnimationFrame(tick)
  }, [isScanning, onScan, stopScanner])

  const startScanner = useCallback(async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsScanning(true)
        requestAnimationFrame(tick)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please ensure camera permissions are granted.')
    }
  }, [tick])

  useEffect(() => {
    startScanner()
    return () => {
      stopScanner()
    }
  }, [startScanner, stopScanner])

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        {/* Close Button */}
        <button
          onClick={() => {
            stopScanner()
            onClose()
          }}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X size={32} />
        </button>

        {/* Scanner Container */}
        <div className="glass p-6 rounded-lg">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-2">Scan QR Code</h2>
            <p className="text-gray-400">Position the QR code within the frame</p>
          </div>

          {error ? (
            <div className="bg-error/20 border border-error/50 rounded-lg p-6 text-center">
              <Camera size={48} className="text-error mx-auto mb-4" />
              <p className="text-error mb-4">{error}</p>
              <Button variant="primary" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <div className="relative">
              {/* Video Stream */}
              <video
                ref={videoRef}
                className="w-full rounded-lg"
                playsInline
                muted
              />
              
              {/* Hidden Canvas for Processing */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-4 border-primary rounded-lg animate-pulse" />
              </div>

              {/* Scanning Indicator */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="inline-block bg-black/70 px-4 py-2 rounded-full">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-white text-sm">Scanning...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          <p>Hold your device steady and ensure good lighting</p>
        </div>
      </div>
    </div>
  )
}
