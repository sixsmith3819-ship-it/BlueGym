'use client'

import React, { useState, useEffect } from 'react'
import StatCard from '@/components/dashboard/StatCard'
import RevenueChart from '@/components/dashboard/RevenueChart'
import RecentPayments from '@/components/dashboard/RecentPayments'
import ExpiringMemberships from '@/components/dashboard/ExpiringMemberships'
import { StatCardSkeleton } from '@/components/ui/Skeleton'
import { Users, TrendingUp, Clock, DollarSign, Calendar, CreditCard } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [revenuePeriod, setRevenuePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        const result = await response.json()
        if (response.ok) {
          setStats(result.data)
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Greeting Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-96 skeleton rounded mb-2"></div>
          <div className="h-6 w-64 skeleton rounded"></div>
        </div>

        {/* Statistics Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="glass p-6 rounded-lg">
          <div className="h-6 w-32 skeleton rounded mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 skeleton rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Good Morning, Admin! 👋</h1>
        <p className="text-gray-400">Here's what's happening at Blue Gym today.</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Total Members"
          value={stats?.members?.total || 0}
          icon={Users}
          color="blue"
          change="+2%"
          trend="up"
        />
        <StatCard
          label="Active Members"
          value={stats?.members?.activeMemberships || 0}
          icon={TrendingUp}
          color="green"
          change="+1%"
          trend="up"
        />
        <StatCard
          label="Expiring Soon"
          value={stats?.members?.expiringSoon || 0}
          icon={Clock}
          color="orange"
        />
        <StatCard
          label="Monthly Revenue"
          value={`$${stats?.revenue?.thisMonth?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          color="purple"
          change="+8%"
          trend="up"
        />
      </div>

      {/* Quick Actions */}
      <div className="glass p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="text-primary" size={24} />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/dashboard/members">
            <Button variant="outline" className="w-full">
              <Users size={18} className="mr-2" />
              Register Member
            </Button>
          </Link>
          <Link href="/dashboard/payments">
            <Button variant="outline" className="w-full">
              <CreditCard size={18} className="mr-2" />
              Record Payment
            </Button>
          </Link>
          <Link href="/dashboard/scan-qr">
            <Button variant="outline" className="w-full">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Scan QR Code
            </Button>
          </Link>
          <Link href="/dashboard/reports">
            <Button variant="outline" className="w-full">
              <TrendingUp size={18} className="mr-2" />
              View Reports
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview */}
        <div className="lg:col-span-2 glass p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Revenue Overview</h2>
            <div className="flex gap-2">
              {['daily', 'weekly', 'monthly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setRevenuePeriod(period as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    revenuePeriod === period
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <RevenueChart period={revenuePeriod} />
        </div>

        {/* Payment Stats */}
        <div className="glass p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-6">Today's Overview</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-lg">
              <p className="text-sm text-gray-300 mb-1">Payments Today</p>
              <p className="text-3xl font-bold">{stats?.payments?.today || 0}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-success/20 to-emerald-500/20 rounded-lg">
              <p className="text-sm text-gray-300 mb-1">Revenue Today</p>
              <p className="text-3xl font-bold text-success">
                ${stats?.revenue?.today?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-accent/20 to-pink-500/20 rounded-lg">
              <p className="text-sm text-gray-300 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">
                ${stats?.revenue?.total?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="glass p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Payments</h2>
            <Link href="/dashboard/payments" className="text-primary text-sm hover:underline">
              View All →
            </Link>
          </div>
          <RecentPayments payments={stats?.recentPayments || []} />
        </div>

        {/* Expiring Memberships */}
        <div className="glass p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Expiring Soon
              {stats?.members?.expiringSoon > 0 && (
                <span className="px-2 py-1 bg-warning/20 text-warning text-xs rounded-full">
                  {stats.members.expiringSoon}
                </span>
              )}
            </h2>
          </div>
          <ExpiringMemberships />
        </div>
      </div>
    </div>
  )
}
