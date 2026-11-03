'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Member } from '@/lib/types'
import { ChevronRight, Search, Users } from 'lucide-react'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'

interface MembersListProps {
  refreshTrigger?: number
}

export default function MembersList({ refreshTrigger = 0 }: MembersListProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState<boolean | null>(null) // Show all members by default

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      setError('')

      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filterActive !== null) params.append('isActive', String(filterActive))
      
      // Add cache-busting parameter to get fresh data
      params.append('_', Date.now().toString())

      const response = await fetch(`/api/members?${params}`, {
        cache: 'no-store'
      })
      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to load members')
        return
      }

      setMembers(result.data || [])
    } catch (err) {
      setError('An error occurred while loading members')
      console.error('Fetch members error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers()
    }, 300)

    return () => clearTimeout(timer)
  }, [search, filterActive, refreshTrigger])

  if (error) {
    return (
      <div className="glass p-6 rounded-lg text-center">
        <p className="text-error mb-4">{error}</p>
        <button
          onClick={fetchMembers}
          className="text-primary hover:underline"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 animate-slide-in-up">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, phone, or member ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterActive(true)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
              filterActive === true
                ? 'bg-primary text-white'
                : 'bg-white/5 text-gray-400 border border-white/20'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterActive(null)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${
              filterActive === null
                ? 'bg-primary text-white'
                : 'bg-white/5 text-gray-400 border border-white/20'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Members List */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members found"
          description={search ? "No members match your search. Try a different query." : "Start by registering your first member to get started."}
          actionLabel={search ? undefined : "Register Member"}
          onAction={search ? undefined : () => window.location.href = '/dashboard/members'}
        />
      ) : (
        <div className="space-y-2 stagger-animation">
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/dashboard/members/${member.id}`}
              className="glass p-4 rounded-lg hover:border-white/30 transition-all group cursor-pointer block"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                    {member.full_name}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                    <span className="font-mono text-primary">{member.member_id}</span>
                    <span>{member.phone_number}</span>
                    <span className="text-xs">
                      {new Date(member.registration_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    member.is_active
                      ? 'bg-success/20 text-success'
                      : 'bg-error/20 text-error'
                  }`}>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <ChevronRight className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
