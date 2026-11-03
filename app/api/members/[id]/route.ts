import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

/**
 * GET /api/members/[id]
 * Fetch a single member with payment history
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch member
    const { data: member, error: memberError } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('id', id)
      .single()

    if (memberError) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Fetch payment history
    const { data: payments, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('member_id', id)
      .order('payment_date', { ascending: false })

    if (paymentError) {
      console.error('Error fetching payments:', paymentError)
    }

    // Fetch subscription
    const { data: subscription, error: subscriptionError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('member_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', subscriptionError)
    }

    return NextResponse.json(
      {
        data: {
          member,
          payments: payments || [],
          subscription: subscription || null,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching member:', error)
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/members/[id]
 * Update member information
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { full_name, phone_number, is_active } = body

    // Validate input
    if (!full_name && !phone_number && is_active === undefined) {
      return NextResponse.json(
        { error: 'At least one field is required to update' },
        { status: 400 }
      )
    }

    // Build update object
    const updates: any = {}
    if (full_name) updates.full_name = full_name
    if (phone_number) updates.phone_number = phone_number
    if (is_active !== undefined) updates.is_active = is_active
    updates.updated_at = new Date().toISOString()

    // Update member
    const { data, error } = await supabaseAdmin
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/members/[id]
 * Permanently delete a member and all related data
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Hard delete - permanently remove member
    // Note: Subscriptions and payments will be cascade deleted due to foreign key constraints
    const { error } = await supabaseAdmin
      .from('members')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete member' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Member deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    )
  }
}
