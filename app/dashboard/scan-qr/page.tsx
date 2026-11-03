'use client'

import React, { useState } from 'react'
import { QrCode, Search, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function ScanQRPage() {
  const router = useRouter()
  const [manualToken, setManualToken] = useState('')
  const [error, setError] = useState('')

  const handleManualVerify = () => {
    if (!manualToken.trim()) {
      setError('Please enter a receipt number or verification code')
      return
    }

    // Redirect to verification page
    router.push(`/verify/${manualToken.trim()}`)
  }

  const handleScanQR = () => {
    alert('QR Scanner requires HTTPS to access camera. Please use the manual verification for now, or access via your deployed Vercel URL.')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Scan QR Code</h1>
        <p className="text-gray-400">Verify membership using QR codes or receipt numbers.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* QR Scanner Card */}
        <div className="glass p-8 rounded-lg text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <QrCode className="text-primary" size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2">QR Code Scanner</h2>
          <p className="text-gray-400 mb-6">
            Scan a member's QR code receipt to verify their membership status
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleScanQR}
            className="mx-auto"
          >
            <QrCode size={20} className="mr-2" />
            Open Camera Scanner
          </Button>
          <p className="text-xs text-gray-500 mt-4">
            Camera access required for QR scanning
          </p>
        </div>

        {/* Manual Verification */}
        <div className="glass p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Search className="text-primary" size={24} />
            <h3 className="text-xl font-bold">Manual Verification</h3>
          </div>
          <p className="text-gray-400 mb-4 text-sm">
            Enter a receipt number or verification code to verify payment
          </p>

          {error && (
            <div className="mb-4 p-4 bg-error/20 border border-error/50 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="text"
              value={manualToken}
              onChange={(e) => {
                setManualToken(e.target.value)
                setError('')
              }}
              placeholder="Enter receipt or verification code..."
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleManualVerify()
              }}
            />
            <Button
              variant="primary"
              onClick={handleManualVerify}
              disabled={!manualToken.trim()}
            >
              Verify
            </Button>
          </div>

          <div className="mt-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg text-xs text-gray-400">
            <p className="font-medium text-secondary mb-1">Example codes:</p>
            <p className="font-mono text-gray-300">RCP20261101000001</p>
            <p className="font-mono text-gray-300">ABC123DEF456...</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="glass p-6 rounded-lg">
          <h3 className="font-semibold mb-3">How to Verify Membership</h3>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">1.</span>
              <p>Ask the member to show their payment receipt QR code</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">2.</span>
              <p>Click "Open Camera Scanner" and scan the QR code</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">3.</span>
              <p>View membership status and expiry date</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">Or</span>
              <p>Manually enter the receipt number for verification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
