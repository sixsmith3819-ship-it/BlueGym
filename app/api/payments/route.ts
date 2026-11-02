import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { createVerificationToken } from '@/lib/qrcode-utils'

/**
 * GET /api/payments
 * Fetch all payments with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const memberId = searchParams.get('memberId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query = supabaseAdmin
      .from('payments')
      .select(`
        *,
        members:member_id (id, member_id, full_name, phone_number)
      `)

    if (memberId) {
      query = query.eq('member_id', memberId)
    }

    if (startDate) {
      query = query.gte('payment_date', startDate)
    }

    if (endDate) {
      query = query.lte('payment_date', endDate)
    }

    query = query.order('payment_date', { ascending: false })

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/payments
 * Create a new payment and subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      member_id,
      amount_paid,
      payment_method,
    } = body

    // Validate input
    if (!member_id || !amount_paid || !payment_method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['cash', 'ecocash', 'bank_transfer', 'other'].includes(payment_method)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Check member exists
    const { data: member, error: memberError } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('id', member_id)
      .single()

    if (memberError || !member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Generate receipt number
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
    const { data: todaysPayments } = await supabaseAdmin
      .from('payments')
      .select('id')
      .like('receipt_number', `RCP${dateStr}%`)

    const paymentCount = String((todaysPayments?.length || 0) + 1).padStart(6, '0')
    const receipt_number = `RCP${dateStr}${paymentCount}`

    // Get last subscription end date if exists
    const { data: lastSubscription } = await supabaseAdmin
      .from('subscriptions')
      .select('end_date')
      .eq('member_id', member_id)
      .order('end_date', { ascending: false })
      .limit(1)
      .single()

    // Calculate subscription dates
    let subscription_start_date: Date
    let subscription_end_date: Date

    if (lastSubscription) {
      const lastEndDate = new Date(lastSubscription.end_date)
      // If paying before or on expiry, starts after expiry
      if (today <= lastEndDate) {
        subscription_start_date = new Date(lastEndDate)
        subscription_start_date.setDate(subscription_start_date.getDate() + 1)
      } else {
        subscription_start_date = today
      }
    } else {
      subscription_start_date = today
    }

    // Set end date to last day of the month
    subscription_end_date = new Date(subscription_start_date.getFullYear(), subscription_start_date.getMonth() + 1, 0)

    // Create verification token
    const verification_token = createVerificationToken()

    // Create payment
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        receipt_number,
        verification_token,
        member_id,
        amount_paid,
        payment_method,
        payment_date: today.toISOString(),
        subscription_start_date: subscription_start_date.toISOString().split('T')[0],
        subscription_end_date: subscription_end_date.toISOString().split('T')[0],
        payment_status: 'paid',
      })
      .select()
      .single()

    if (paymentError) {
      return NextResponse.json({ error: paymentError.message }, { status: 400 })
    }

    // Create subscription
    const { error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        member_id,
        payment_id: payment.id,
        start_date: subscription_start_date.toISOString().split('T')[0],
        end_date: subscription_end_date.toISOString().split('T')[0],
        is_active: true,
      })

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError)
    }

    return NextResponse.json(
      {
        data: {
          payment,
          subscription: {
            start_date: subscription_start_date.toISOString().split('T')[0],
            end_date: subscription_end_date.toISOString().split('T')[0],
          },
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
