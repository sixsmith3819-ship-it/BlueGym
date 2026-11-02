'use client'

import React from 'react'
import { CheckCircle, XCircle, AlertCircle, Calendar, User, CreditCard } from 'lucide-react'

interface VerificationDisplayProps {
  payment: {
    receipt_number: string
    amount_paid: number
    payment_method: string
    payment_date: string
    subscription_start_date: string
    subscription_end_date: string
    payment_status: string
  }
  member: {
    member_id: string
    full_name: string
    phone_number: string
    is_active: boolean
  }
  isActive: boolean
}

export default function VerificationDisplay({ payment, member, isActive }: VerificationDisplayProps) {
  const getStatusColor = () => {
    if (!member.is_active) return 'error'
    if (!isActive) return 'warning'
    return 'success'
  }

  const getStatusMessage = () => {
    if (!member.is_active) return 'MEMBER INACTIVE'
    if (!isActive) return 'MEMBERSHIP EXPIRED'
    return 'MEMBERSHIP ACTIVE'
  }

  const getStatusIcon = () => {
    if (!member.is_active) return <XCircle size={48} />
    if (!isActive) return <AlertCircle size={48} />
    return <CheckCircle size={48} />
  }

  const statusColor = getStatusColor()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-darker">
      {/* Background Elements */}
      <div className="fixed inset-0 aurora-glow"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>

      {/* Verification Card */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="glass p-8 rounded-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-aurora flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💪</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">BLUE GYM</h1>
            <p className="text-sm text-gray-400">Payment Receipt Verification</p>
          </div>

          {/* Verification Status */}
          <div className={`text-center p-6 rounded-lg mb-8 bg-${statusColor}/20 border border-${statusColor}/50`}>
            <div className={`w-16 h-16 rounded-full bg-${statusColor}/20 flex items-center justify-center mx-auto mb-4 text-${statusColor}`}>
              {getStatusIcon()}
            </div>
            <h2 className={`text-2xl font-bold mb-2 text-${statusColor}`}>
              PAYMENT VERIFIED
            </h2>
            <p className="text-gray-300 mb-4">
              This is a genuine Blue Gym payment receipt
            </p>
            <div className={`inline-block px-6 py-2 rounded-full bg-${statusColor}/30 border border-${statusColor}/50`}>
              <p className={`font-bold text-${statusColor}`}>{getStatusMessage()}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-6">
            {/* Member Information */}
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <User size={20} className="text-primary" />
                <h3 className="font-semibold">Member Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Full Name</p>
                  <p className="font-semibold">{member.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Member ID</p>
                  <p className="font-mono font-semibold text-primary">{member.member_id}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={20} className="text-primary" />
                <h3 className="font-semibold">Payment Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Receipt Number</p>
                  <p className="font-mono text-sm">{payment.receipt_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Amount Paid</p>
                  <p className="text-xl font-bold text-success">${payment.amount_paid.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Payment Method</p>
                  <p className="capitalize">{payment.payment_method.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Payment Date</p>
                  <p>{new Date(payment.payment_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Subscription Information */}
            <div className={`p-4 rounded-lg ${
              isActive ? 'bg-success/10 border border-success/30' : 'bg-warning/10 border border-warning/30'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar size={20} className={isActive ? 'text-success' : 'text-warning'} />
                <h3 className="font-semibold">Subscription Period</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Start Date</p>
                  <p className="font-semibold">{new Date(payment.subscription_start_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Expiry Date</p>
                  <p className={`font-semibold ${isActive ? 'text-success' : 'text-warning'}`}>
                    {new Date(payment.subscription_end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {!isActive && (
                <p className="text-sm text-warning mt-3">
                  ⚠️ This membership has expired. Please renew to continue access.
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-400">
            <p>This receipt was verified on {new Date().toLocaleDateString()}</p>
            <p className="mt-2">Blue Gym • Stronger Together</p>
            <p className="mt-1 text-xs">© 2026 Blue Gym. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
