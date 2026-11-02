import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

/**
 * GET /api/dashboard/stats
 * Fetch dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const thisMonth = new Date().toISOString().substring(0, 7) // YYYY-MM

    // Get total members
    const { count: totalMembers } = await supabaseAdmin
      .from('members')
      .select('*', { count: 'exact', head: true })

    // Get active members
    const { count: activeMembers } = await supabaseAdmin
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get members with active subscriptions
    const { data: activeSubscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('member_id')
      .gte('end_date', today)
      .eq('is_active', true)

    const activeMemberships = activeSubscriptions?.length || 0

    // Get expiring soon (within 3 days)
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    const expiringSoonDate = threeDaysFromNow.toISOString().split('T')[0]

    const { data: expiringSoon } = await supabaseAdmin
      .from('subscriptions')
      .select('member_id')
      .gte('end_date', today)
      .lte('end_date', expiringSoonDate)
      .eq('is_active', true)

    const expiringSoonCount = expiringSoon?.length || 0

    // Get expired memberships
    const { data: expired } = await supabaseAdmin
      .from('subscriptions')
      .select('member_id')
      .lt('end_date', today)

    const expiredCount = expired?.length || 0

    // Get payments today
    const { count: paymentsToday } = await supabaseAdmin
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .gte('payment_date', `${today}T00:00:00`)
      .lte('payment_date', `${today}T23:59:59`)

    // Get revenue today
    const { data: todayPayments } = await supabaseAdmin
      .from('payments')
      .select('amount_paid')
      .gte('payment_date', `${today}T00:00:00`)
      .lte('payment_date', `${today}T23:59:59`)

    const revenueToday = todayPayments?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0

    // Get revenue this month
    const { data: monthPayments } = await supabaseAdmin
      .from('payments')
      .select('amount_paid')
      .like('payment_date', `${thisMonth}%`)

    const revenueThisMonth = monthPayments?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0

    // Get total revenue
    const { data: allPayments } = await supabaseAdmin
      .from('payments')
      .select('amount_paid')

    const totalRevenue = allPayments?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0

    // Get recent payments (last 5)
    const { data: recentPayments } = await supabaseAdmin
      .from('payments')
      .select(`
        *,
        members:member_id (full_name, member_id)
      `)
      .order('payment_date', { ascending: false })
      .limit(5)

    return NextResponse.json({
      data: {
        members: {
          total: totalMembers || 0,
          active: activeMembers || 0,
          activeMemberships: activeMemberships,
          expiringSoon: expiringSoonCount,
          expired: expiredCount,
        },
        payments: {
          today: paymentsToday || 0,
        },
        revenue: {
          today: revenueToday,
          thisMonth: revenueThisMonth,
          total: totalRevenue,
        },
        recentPayments: recentPayments || [],
      },
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
