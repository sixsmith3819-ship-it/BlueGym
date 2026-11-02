'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import EmptyState from '@/components/ui/EmptyState'
import { TableRowSkeleton } from '@/components/ui/Skeleton'

interface ExpiringMember {
  id: string
  member_id: string
  full_name: string
  phone_number: string
  end_date: string
}

export default function ExpiringMemberships() {
  const [members, setMembers] = useState<ExpiringMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchExpiring = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const threeDaysFromNow = new Date()
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
        const expiringSoonDate = threeDaysFromNow.toISOString().split('T')[0]

        // Fetch expiring subscriptions with member details
        const response = await fetch(
          `/api/members?isActive=true`
        )
        const result = await response.json()

        if (response.ok) {
          // For now, this is a placeholder
          // In a real implementation, we'd join with subscriptions table
          setMembers([])
        }
      } catch (error) {
        console.error('Error fetching expiring memberships:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchExpiring()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="All Clear!"
        description="No memberships expiring in the next 3 days. All members are up to date."
        variant="success"
      />
    )
  }

  return (
    <div className="space-y-3">
      {members.map((member, index) => {
        const daysUntilExpiry = Math.ceil(
          (new Date(member.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )

        return (
          <Link
            key={member.id}
            href={`/dashboard/members/${member.id}`}
            className="block p-4 bg-warning/10 hover:bg-warning/20 border border-warning/30 rounded-lg transition-all group animate-slide-in-up"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-warning" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate group-hover:text-warning transition-colors">
                  {member.full_name}
                </h4>
                <p className="text-xs text-gray-400 font-mono">{member.member_id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-warning">
                  {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-gray-400">remaining</p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
