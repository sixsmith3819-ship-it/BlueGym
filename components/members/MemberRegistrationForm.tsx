'use client'

import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import { User, Phone, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/ToastContainer'

interface MemberRegistrationFormProps {
  onSuccess?: (member: any) => void
}

export default function MemberRegistrationForm({ onSuccess }: MemberRegistrationFormProps) {
  const { success, error: showError } = useToast()
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [newMemberId, setNewMemberId] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setShowSuccess(false)
    setIsLoading(true)

    try {
      // Validate input
      if (!formData.full_name.trim() || !formData.phone_number.trim()) {
        setError('Please fill in all fields')
        showError('Please fill in all required fields')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to register member')
        showError(result.error || 'Failed to register member')
        return
      }

      // Success
      setNewMemberId(result.data.member_id)
      setShowSuccess(true)
      setFormData({ full_name: '', phone_number: '' })

      success(`Member ${result.data.full_name} registered successfully!`)

      if (onSuccess) {
        onSuccess(result.data)
      }

      // Clear success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    } catch (err) {
      const errorMsg = 'An error occurred. Please try again.'
      setError(errorMsg)
      showError(errorMsg)
      console.error('Registration error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass p-6 rounded-lg max-w-md animate-slide-in-up">
      <h2 className="text-2xl font-bold mb-2">Register New Member</h2>
      <p className="text-gray-400 mb-6">Add a new member to Blue Gym</p>

      {/* Success Alert */}
      {showSuccess && (
        <div className="mb-4 p-4 bg-success/20 border border-success/50 rounded-lg flex items-start gap-3 animate-scale-in">
          <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-success text-sm font-medium">Member registered successfully!</p>
            <p className="text-success/80 text-xs mt-1">Member ID: <span className="font-mono font-bold">{newMemberId}</span></p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+263 71 234 5678"
              className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Register Member
        </Button>
      </form>

      {/* Registration Info */}
      <div className="mt-6 p-4 bg-secondary/10 border border-secondary/30 rounded-lg text-xs text-gray-400">
        <p className="font-medium text-secondary mb-2">Member ID Format</p>
        <p>Members are assigned a unique ID automatically.</p>
        <p className="text-secondary/80 font-mono text-xs mt-2">Example: BGM202411001</p>
      </div>
    </div>
  )
}
