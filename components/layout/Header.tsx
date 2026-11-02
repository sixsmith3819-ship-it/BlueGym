'use client'

import React, { useState, useEffect } from 'react'
import { Search, Bell, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    // Set date on client side to avoid prerender blocking
    setCurrentDate(
      new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    )
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <header className="glass-dark sticky top-0 z-30 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between gap-4">
      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search members, receipts..."
            className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all text-sm"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-4 ml-auto md:ml-0">
        {/* Date */}
        <div className="hidden sm:block text-right text-sm">
          <p className="text-gray-400">{currentDate}</p>
        </div>

        {/* Notification */}
        <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-3 md:pl-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg bg-gradient-aurora flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
