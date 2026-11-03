'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Member, Payment } from '@/lib/types'
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard,
  Activity,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'

interface MemberDetailPageProps {
  params: Promise<{ id: string }>
}

export default function MemberDetailPage({ params }: MemberDetailPageProps) {
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPayments, setIsLoadingPayments] = useState(true)
  const [error, setError] = useState('')
  const [memberId, setMemberId] = useState<string>('')

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params
      setMemberId(resolvedParams.id)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (memberId) {
      fetchMemberDetails()
      fetchMemberPayments()
    }
  }, [memberId])

  const fetchMemberDetails = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(`/api/members/${memberId}`)
      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to load member details')
        return
      }

      setMember(result.data)
    } catch (err) {
      setError('An error occurred while loading member details')
      console.error('Fetch member error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMemberPayments = async () => {
    try {
      setIsLoadingPayments(true)

      const response = await fetch(`/api/payments?memberId=${memberId}`)
      const result = await response.json()

      if (response.ok) {
        setPayments(result.data || [])
      }
    } catch (err) {
      console.error('Fetch payments error:', err)
    } finally {
      setIsLoadingPayments(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || 'Failed to delete member')
        return
      }

      alert('Member deleted successfully')
      router.push('/dashboard/members')
    } catch (err) {
      alert('An error occurred while deleting member')
      console.error('Delete member error:', err)
    }
  }

  const handleToggleStatus = async () => {
    if (!member) return

    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !member.is_active }),
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || 'Failed to update member status')
        return
      }

      setMember(result.data)
    } catch (err) {
      alert('An error occurred while updating member status')
      console.error('Update member error:', err)
    }
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState
          icon={User}
          title="Member not found"
          description={error}
          actionLabel="Back to Members"
          onAction={() => router.push('/dashboard/members')}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      </div>
    )
  }

  if (!member) {
    return null
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount_paid, 0)
  const lastPayment = payments[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 animate-slide-in-up">
        <button
          onClick={() => router.push('/dashboard/members')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Members</span>
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{member.full_name}</h1>
            <p className="text-gray-400">Member ID: <span className="font-mono text-primary">{member.member_id}</span></p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium px-3 py-1.5 rounded-lg ${
              member.is_active
                ? 'bg-success/20 text-success'
                : 'bg-error/20 text-error'
            }`}>
              {member.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Member Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="glass p-6 rounded-lg animate-slide-in-up">
            <h2 className="text-xl font-bold mb-4">Member Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="font-semibold">{member.full_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone Number</p>
                  <p className="font-semibold">{member.phone_number}</p>
                </div>
              </div>

              {member.email && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold">{member.email}</p>
                  </div>
                </div>
              )}

              {member.address && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="font-semibold">{member.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Registration Date</p>
                  <p className="font-semibold">
                    {new Date(member.registration_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="font-semibold">{member.is_active ? 'Active Member' : 'Inactive Member'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="glass p-6 rounded-lg animate-slide-in-up">
            <h2 className="text-xl font-bold mb-4">Payment History</h2>
            
            {isLoadingPayments ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </div>
            ) : payments.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No payments yet"
                description="This member hasn't made any payments yet."
              />
            ) : (
              <div className="space-y-2">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="text-success" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold">K{payment.amount_paid.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(payment.payment_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 capitalize">{payment.payment_method}</p>
                      {payment.subscription_id && (
                        <p className="text-xs text-primary">Subscription Payment</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="glass p-6 rounded-lg animate-slide-in-up">
            <h3 className="font-bold mb-4">Quick Stats</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-success">K{totalPaid.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Payments</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
              
              {lastPayment && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Last Payment</p>
                  <p className="font-semibold">
                    {new Date(lastPayment.payment_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="glass p-6 rounded-lg animate-slide-in-up">
            <h3 className="font-bold mb-4">Actions</h3>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => router.push(`/dashboard/payments?memberId=${member.member_id}`)}
              >
                <CreditCard size={20} />
                <span>Record Payment</span>
              </Button>

              <Button
                variant={member.is_active ? 'secondary' : 'primary'}
                size="md"
                className="w-full justify-center"
                onClick={handleToggleStatus}
              >
                {member.is_active ? (
                  <>
                    <XCircle size={20} />
                    <span>Mark as Inactive</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Mark as Active</span>
                  </>
                )}
              </Button>

              <Button
                variant="danger"
                size="md"
                className="w-full justify-center"
                onClick={handleDelete}
              >
                <Trash2 size={20} />
                <span>Delete Member</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
