import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-server'
import VerificationDisplay from '@/components/verification/VerificationDisplay'

interface VerifyPageProps {
  params: Promise<{ token: string }>
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { token } = await params

  // Fetch payment by verification token
  const { data: payment, error } = await supabaseAdmin
    .from('payments')
    .select(`
      *,
      members:member_id (
        id,
        member_id,
        full_name,
        phone_number,
        is_active
      )
    `)
    .eq('verification_token', token)
    .single()

  if (error || !payment) {
    console.error('Payment verification error:', error)
    return notFound()
  }

  // Check if subscription is still active
  const today = new Date().toISOString().split('T')[0]
  const isActive = today <= payment.subscription_end_date

  return (
    <VerificationDisplay
      payment={payment}
      member={payment.members}
      isActive={isActive}
    />
  )
}
