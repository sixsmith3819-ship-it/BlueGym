'use client'

import React from 'react'
import { CreditCard } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { PaymentCardSkeleton } from '@/components/ui/Skeleton'

interface Payment {
  id: string
  receipt_number: string
  amount_paid: number
  payment_method: string
  payment_date: string
  members: {
    full_name: string
    member_id: string
  }
}

interface RecentPaymentsProps {
  payments: Payment[]
  isLoading?: boolean
}

export default function RecentPayments({ payments, isLoading }: RecentPaymentsProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <PaymentCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No Recent Payments"
        description="Payment records will appear here once you start recording transactions."
      />
    )
  }

  return (
    <div className="space-y-3">
      {payments.map((payment, index) => (
        <div
          key={payment.id}
          className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all cursor-pointer group animate-slide-in-up"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                {payment.members.full_name}
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-400 font-mono">
                  {payment.members.member_id}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400 capitalize">
                  {payment.payment_method.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="text-right ml-4">
              <p className="font-bold text-success text-lg">
                ${payment.amount_paid.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(payment.payment_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
