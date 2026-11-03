'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { DollarSign, CreditCard, AlertCircle, CheckCircle } from 'lucide-react'
import { Member } from '@/lib/types'
import { useToast } from '@/components/ui/ToastContainer'

interface PaymentRecordFormProps {
  onSuccess?: (payment: any) => void
  preSelectedMemberId?: string
}

export default function PaymentRecordForm({ onSuccess, preSelectedMemberId }: PaymentRecordFormProps) {
  const { showToast } = useToast()
  const [members, setMembers] = useState<Member[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(true)
  const [formData, setFormData] = useState({
    member_id: preSelectedMemberId || '',
    amount_paid: '20',
    payment_method: 'cash' as 'cash' | 'ecocash' | 'bank_transfer' | 'other',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [calculatedDates, setCalculatedDates] = useState<{
    start_date: string
    end_date: string
  } | null>(null)

  // Fetch all members (both active and inactive)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Fetch all members, add cache-busting parameter
        const response = await fetch(`/api/members?_=${Date.now()}`, {
          cache: 'no-store'
        })
        const result = await response.json()
        if (response.ok) {
          setMembers(result.data || [])
        } else {
          showToast('Failed to load members. Please refresh the page.', 'error')
        }
      } catch (err) {
        console.error('Error fetching members:', err)
        showToast('Network error while loading members. Please check your connection.', 'error')
      } finally {
        setIsLoadingMembers(false)
      }
    }
    fetchMembers()
  }, [showToast])

  const selectedMember = members.find(m => m.id === formData.member_id)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleShowConfirmation = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.member_id || !formData.amount_paid || !formData.payment_method) {
      const errorMsg = 'Please fill in all required fields'
      setError(errorMsg)
      showToast(errorMsg, 'error')
      return
    }

    if (parseFloat(formData.amount_paid) <= 0) {
      const errorMsg = 'Amount must be greater than $0'
      setError(errorMsg)
      showToast(errorMsg, 'error')
      return
    }

    // Calculate subscription dates preview
    const today = new Date()
    const startDate = today.toISOString().split('T')[0]
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]
    
    setCalculatedDates({ start_date: startDate, end_date: endDate })
    setShowConfirmation(true)
  }

  const handleConfirmPayment = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: formData.member_id,
          amount_paid: parseFloat(formData.amount_paid),
          payment_method: formData.payment_method,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMsg = result.error || 'Failed to record payment. Please try again.'
        setError(errorMsg)
        showToast(errorMsg, 'error')
        setShowConfirmation(false)
        return
      }

      // Success
      showToast(`Payment of $${formData.amount_paid} recorded successfully!`, 'success')
      
      if (onSuccess) {
        onSuccess(result.data)
      }

      // Reset form
      setFormData({
        member_id: '',
        amount_paid: '20',
        payment_method: 'cash',
      })
      setShowConfirmation(false)
    } catch (err) {
      const errorMsg = 'Network error. Please check your connection and try again.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
      console.error('Payment error:', err)
      setShowConfirmation(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (showConfirmation && selectedMember && calculatedDates) {
    return (
      <div className="glass p-6 rounded-lg max-w-2xl animate-fade-in">
        <h2 className="text-2xl font-bold mb-2">Confirm Payment</h2>
        <p className="text-gray-400 mb-6">Review the details before confirming</p>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Member</p>
              <p className="font-semibold">{selectedMember.full_name}</p>
              <p className="text-xs text-primary font-mono">{selectedMember.member_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone Number</p>
              <p className="font-semibold">{selectedMember.phone_number}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Amount Paid</p>
              <p className="text-2xl font-bold text-success">${formData.amount_paid}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Payment Method</p>
              <p className="font-semibold capitalize">{formData.payment_method.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Subscription Start</p>
              <p className="font-semibold">{new Date(calculatedDates.start_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Subscription End</p>
              <p className="font-semibold">{new Date(calculatedDates.end_date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-error/20 border border-error/50 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowConfirmation(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleConfirmPayment}
            isLoading={isLoading}
            className="flex-1"
          >
            Confirm Payment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="glass p-6 rounded-lg max-w-2xl">
      <h2 className="text-2xl font-bold mb-2">Record Payment</h2>
      <p className="text-gray-400 mb-6">Record a monthly subscription payment</p>

      {error && (
        <div className="mb-4 p-4 bg-error/20 border border-error/50 rounded-lg flex items-start gap-3">
          <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleShowConfirmation} className="space-y-4">
        {/* Select Member */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Member *
          </label>
          <select
            name="member_id"
            value={formData.member_id}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
            required
            disabled={isLoadingMembers}
          >
            <option value="">Choose a member...</option>
            {members.map((member) => (
              <option key={member.id} value={member.id} className="bg-surface text-white">
                {member.full_name} - {member.member_id} {member.is_active ? '' : '(First Payment)'}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Paid */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount Paid *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="number"
              name="amount_paid"
              value={formData.amount_paid}
              onChange={handleChange}
              placeholder="20.00"
              step="0.01"
              min="0"
              className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
              required
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Payment Method *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'cash', label: 'Cash' },
              { value: 'ecocash', label: 'EcoCash' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'other', label: 'Other' },
            ].map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, payment_method: method.value as any }))}
                className={`p-3 rounded-lg border transition-all ${
                  formData.payment_method === method.value
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:border-white/40'
                }`}
              >
                <CreditCard size={18} className="inline mr-2" />
                {method.label}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoadingMembers}
        >
          Continue to Confirmation
        </Button>
      </form>

      <div className="mt-6 p-4 bg-secondary/10 border border-secondary/30 rounded-lg text-xs text-gray-400">
        <p className="font-medium text-secondary mb-2">💡 Payment Recording</p>
        <p>Payments are recorded immediately and generate a receipt with QR code.</p>
        <p className="mt-1">Subscription starts today and expires at month end.</p>
      </div>
    </div>
  )
}
