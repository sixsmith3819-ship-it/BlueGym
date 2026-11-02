import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

/**
 * GET /api/dashboard/revenue
 * Fetch revenue data for charts
 * Query params: period (daily|weekly|monthly)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'daily'

    let data: any[] = []

    if (period === 'daily') {
      // Last 7 days
      const days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        days.push(date.toISOString().split('T')[0])
      }

      const revenueByDay = await Promise.all(
        days.map(async (day) => {
          const { data: payments } = await supabaseAdmin
            .from('payments')
            .select('amount_paid')
            .gte('payment_date', `${day}T00:00:00`)
            .lte('payment_date', `${day}T23:59:59`)
            .eq('payment_status', 'paid')

          const total = payments?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0

          return {
            date: day,
            label: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
            revenue: total,
          }
        })
      )

      data = revenueByDay
    } else if (period === 'weekly') {
      // Last 4 weeks
      const weeks = []
      for (let i = 3; i >= 0; i--) {
        const endDate = new Date()
        endDate.setDate(endDate.getDate() - (i * 7))
        const startDate = new Date(endDate)
        startDate.setDate(startDate.getDate() - 6)

        weeks.push({
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
          label: `Week ${4 - i}`,
        })
      }

      const revenueByWeek = await Promise.all(
        weeks.map(async (week) => {
          const { data: payments } = await supabaseAdmin
            .from('payments')
            .select('amount_paid')
            .gte('payment_date', `${week.start}T00:00:00`)
            .lte('payment_date', `${week.end}T23:59:59`)
            .eq('payment_status', 'paid')

          const total = payments?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0

          return {
            date: week.end,
            label: week.label,
            revenue: total,
          }
        })
      )

      data = revenueByWeek
    } else if (period === 'monthly') {
      // Last 6 months
      const months = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        months.push({
          yearMonth: date.toISOString().substring(0, 7),
          label: date.toLocaleDateString('en-US', { month: 'short' }),
        })
      }

      const revenueByMonth = await Promise.all(
        months.map(async (month) => {
          const { data: payments } = await supabaseAdmin
            .from('payments')
            .select('amount_paid')
            .like('payment_date', `${month.yearMonth}%`)
            .eq('payment_status', 'paid')

          const total = payments?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0

          return {
            date: month.yearMonth,
            label: month.label,
            revenue: total,
          }
        })
      )

      data = revenueByMonth
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    )
  }
}
