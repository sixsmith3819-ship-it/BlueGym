export type Member = {
  id: string
  member_id: string
  full_name: string
  phone_number: string
  email?: string
  address?: string
  registration_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Payment = {
  id: string
  receipt_number: string
  verification_token: string
  member_id: string
  amount_paid: number
  payment_method: 'cash' | 'ecocash' | 'bank_transfer' | 'other'
  payment_date: string
  subscription_start_date: string
  subscription_end_date: string
  subscription_id?: string
  payment_status: 'pending' | 'paid' | 'cancelled'
  created_at: string
}

export type Subscription = {
  id: string
  member_id: string
  payment_id: string
  start_date: string
  end_date: string
  created_at: string
}

export type GymSettings = {
  id: string
  gym_name: string
  monthly_subscription_fee: number
  currency: string
  expiry_warning_days: number
  gym_logo?: string
  contact_information?: string
  updated_at: string
}

export type MembershipStatus = 'active' | 'expiring_soon' | 'expired' | 'inactive'

export type User = {
  id: string
  email: string
  created_at: string
}
