import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

/**
 * GET /api/members
 * Fetch all members with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const isActive = searchParams.get('isActive')

    let query = supabaseAdmin.from('members').select('*')

    // Apply filters
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,phone_number.ilike.%${search}%,member_id.ilike.%${search}%`
      )
    }

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    // Sort by registration date, newest first
    query = query.order('registration_date', { ascending: false })

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/members
 * Create a new member
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, phone_number } = body

    // Validate input
    if (!full_name || !phone_number) {
      return NextResponse.json(
        { error: 'Full name and phone number are required' },
        { status: 400 }
      )
    }

    // Generate member ID (format: BGM202411XXXX)
    const today = new Date()
    const yearMonth = today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0')
    
    // Get count of members registered this month
    const { data: monthlyMembers, error: countError } = await supabaseAdmin
      .from('members')
      .select('id')
      .like('member_id', `BGM${yearMonth}%`)

    if (countError) {
      return NextResponse.json(
        { error: 'Failed to generate member ID' },
        { status: 400 }
      )
    }

    const memberNumber = String((monthlyMembers?.length || 0) + 1).padStart(4, '0')
    const member_id = `BGM${yearMonth}${memberNumber}`

    // Create member
    const { data, error } = await supabaseAdmin
      .from('members')
      .insert({
        member_id,
        full_name,
        phone_number,
        registration_date: today.toISOString().split('T')[0],
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    )
  }
}
