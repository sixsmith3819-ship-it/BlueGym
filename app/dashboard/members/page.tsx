'use client'

import React, { useState } from 'react'
import MemberRegistrationForm from '@/components/members/MemberRegistrationForm'
import MembersList from '@/components/members/MembersList'

export const dynamic = 'force-dynamic'

export default function MembersPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleMemberRegistered = () => {
    // Trigger refresh of members list
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Members</h1>
        <p className="text-gray-400">Manage and view all Blue Gym members.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div>
          <MemberRegistrationForm onSuccess={handleMemberRegistered} />
        </div>

        {/* Members List */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">Registered Members</h2>
          </div>
          <MembersList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}
