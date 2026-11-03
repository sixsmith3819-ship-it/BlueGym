'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Bell, User, Clock, UserPlus, AlertCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [notificationCount, setNotificationCount] = useState(0)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set date on client side to avoid prerender blocking
    setCurrentDate(
      new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    )

    // Fetch notifications
    fetchNotifications()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/dashboard/stats?_=${Date.now()}`, {
        cache: 'no-store'
      })
      const result = await response.json()
      
      if (response.ok && result.data) {
        const notifs: any[] = []

        // Expiring subscriptions
        if (result.data.members?.expiringSoon > 0) {
          notifs.push({
            id: 'expiring',
            type: 'warning',
            icon: Clock,
            title: 'Subscriptions Expiring Soon',
            message: `${result.data.members.expiringSoon} member${result.data.members.expiringSoon > 1 ? 's' : ''} expiring in the next 3 days`,
            link: '/dashboard/members',
          })
        }

        // Registered but unpaid members
        if (result.data.members?.registeredUnpaid > 0) {
          notifs.push({
            id: 'unpaid',
            type: 'info',
            icon: UserPlus,
            title: 'Pending First Payment',
            message: `${result.data.members.registeredUnpaid} member${result.data.members.registeredUnpaid > 1 ? 's' : ''} registered but haven't paid yet`,
            link: '/dashboard/members',
          })
        }

        // Expired subscriptions
        if (result.data.members?.expired > 0) {
          notifs.push({
            id: 'expired',
            type: 'error',
            icon: AlertCircle,
            title: 'Expired Subscriptions',
            message: `${result.data.members.expired} member${result.data.members.expired > 1 ? 's have' : ' has'} expired subscriptions`,
            link: '/dashboard/members',
          })
        }

        setNotifications(notifs)
        setNotificationCount(notifs.length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-warning'
      case 'error':
        return 'text-error'
      case 'info':
        return 'text-primary'
      default:
        return 'text-gray-400'
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-warning/10 border-warning/20'
      case 'error':
        return 'bg-error/10 border-error/20'
      case 'info':
        return 'bg-primary/10 border-primary/20'
      default:
        return 'bg-white/5 border-white/10'
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
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={toggleNotifications}
            className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Bell size={20} className="text-gray-300" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 glass border border-white/20 rounded-lg shadow-lg overflow-hidden animate-scale-in z-50">
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Notification List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-white/10">
                    {notifications.map((notif) => {
                      const Icon = notif.icon
                      return (
                        <Link
                          key={notif.id}
                          href={notif.link}
                          onClick={() => setShowNotifications(false)}
                          className="block px-4 py-3 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex gap-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${getNotificationBg(notif.type)} border flex items-center justify-center`}>
                              <Icon size={20} className={getNotificationColor(notif.type)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white mb-1">
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-400 line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Bell size={32} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No notifications</p>
                    <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-white/10 bg-white/5">
                  <button
                    onClick={() => {
                      fetchNotifications()
                    }}
                    className="text-xs text-primary hover:text-cyan-400 transition-colors"
                  >
                    Refresh notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-3 md:pl-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg bg-gradient-aurora flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            <User size={18} className="text-white" />
          </button>
        </div>
      </div>
    </header>
  )
}
