'use client'

import React, { useState } from 'react'
import PaymentRecordForm from '@/components/payments/PaymentRecordForm'
import DigitalReceipt from '@/components/payments/DigitalReceipt'
import { ArrowLeft } from 'lucide-react'

export default function PaymentsPage() {
  const [paymentData, setPaymentData] = useState<any>(null)
  const [memberData, setMemberData] = useState<any>(null)

  const handlePaymentSuccess = async (data: any) => {
    // Fetch member details
    const response = await fetch(`/api/members/${data.payment.member_id}`)
    const result = await response.json()
    
    setPaymentData(data.payment)
    setMemberData(result.data.member)
  }

  const handleBackToForm = () => {
    setPaymentData(null)
    setMemberData(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Payments</h1>
          <p className="text-gray-400">Record and manage subscription payments.</p>
        </div>
        {paymentData && (
          <button
            onClick={handleBackToForm}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>New Payment</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {paymentData && memberData ? (
          <DigitalReceipt payment={paymentData} member={memberData} />
        ) : (
          <PaymentRecordForm onSuccess={handlePaymentSuccess} />
        )}
      </div>
    </div>
  )
}
