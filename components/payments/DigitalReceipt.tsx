'use client'

import React, { useEffect, useState } from 'react'
import { generateReceiptQRCode } from '@/lib/qrcode-utils'
import { Download, Printer, Share2, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

interface DigitalReceiptProps {
  payment: {
    receipt_number: string
    verification_token: string
    amount_paid: number
    payment_method: string
    payment_date: string
    subscription_start_date: string
    subscription_end_date: string
  }
  member: {
    full_name: string
    member_id: string
    phone_number: string
  }
}

export default function DigitalReceipt({ payment, member }: DigitalReceiptProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await generateReceiptQRCode(payment.verification_token)
        setQrCodeUrl(url)
      } catch (error) {
        console.error('Error generating QR code:', error)
      } finally {
        setIsGenerating(false)
      }
    }
    generateQR()
  }, [payment.verification_token])

  const handleDownload = () => {
    // This will be implemented with PDF generation
    window.print()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Blue Gym Payment Receipt',
          text: `Payment Receipt ${payment.receipt_number}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Banner */}
      <div className="glass p-6 rounded-lg bg-success/10 border-success/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle className="text-success" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-success">Payment Successful!</h2>
            <p className="text-gray-300 text-sm">Your payment has been recorded and receipt generated.</p>
          </div>
        </div>
      </div>

      {/* Receipt Card */}
      <div id="receipt-content" className="glass p-8 rounded-lg max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-aurora flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💪</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">BLUE GYM</h1>
          <p className="text-sm text-gray-400">Stronger Together</p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-lg font-semibold">GYM MEMBERSHIP PAYMENT RECEIPT</p>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="space-y-6 mb-8">
          {/* Member Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Member Name</p>
              <p className="font-semibold">{member.full_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Member ID</p>
              <p className="font-mono font-semibold text-primary">{member.member_id}</p>
            </div>
          </div>

          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Receipt Number</p>
              <p className="font-mono text-sm">{payment.receipt_number}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Payment Date</p>
              <p className="text-sm">{new Date(payment.payment_date).toLocaleString()}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-4 bg-gradient-aurora rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/70 mb-1">Amount Paid</p>
                <p className="text-3xl font-bold text-white">${payment.amount_paid.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-white/70 mb-1">Payment Method</p>
                <p className="text-lg font-semibold text-white capitalize">
                  {payment.payment_method.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Period */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
            <div>
              <p className="text-xs text-gray-400 mb-1">Subscription Start</p>
              <p className="font-semibold">{new Date(payment.subscription_start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Subscription Expires</p>
              <p className="font-semibold text-warning">{new Date(payment.subscription_end_date).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Payment Status */}
          <div className="text-center p-3 bg-success/20 border border-success/50 rounded-lg">
            <p className="text-success font-bold text-lg">✓ PAYMENT VERIFIED</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="border-t border-white/10 pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-4">Scan to verify receipt</p>
            {isGenerating ? (
              <div className="w-48 h-48 mx-auto bg-white/5 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : qrCodeUrl ? (
              <div className="inline-block p-4 bg-white rounded-lg">
                <img src={qrCodeUrl} alt="Receipt QR Code" className="w-48 h-48" />
              </div>
            ) : (
              <p className="text-error">Failed to generate QR code</p>
            )}
            <p className="text-xs text-gray-500 mt-4">
              Receipt #{payment.receipt_number}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-gray-400">
          <p>Thank you for your payment!</p>
          <p className="mt-2">Blue Gym • Stronger Together</p>
          <p className="mt-1">© 2026 Blue Gym. All rights reserved.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
        <Button
          variant="primary"
          size="lg"
          onClick={handleDownload}
          className="flex-1"
        >
          <Download size={20} className="mr-2" />
          Download PDF
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrint}
          className="flex-1"
        >
          <Printer size={20} className="mr-2" />
          Print
        </Button>
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button
            variant="secondary"
            size="lg"
            onClick={handleShare}
            className="flex-1"
          >
            <Share2 size={20} className="mr-2" />
            Share
          </Button>
        )}
      </div>
    </div>
  )
}
