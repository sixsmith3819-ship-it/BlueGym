'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color: 'blue' | 'green' | 'orange' | 'purple' | 'cyan'
  change?: string
  trend?: 'up' | 'down'
}

const colorClasses = {
  blue: 'from-primary to-cyan-500',
  green: 'from-success to-emerald-500',
  orange: 'from-warning to-orange-500',
  purple: 'from-accent to-pink-500',
  cyan: 'from-secondary to-blue-400',
}

export default function StatCard({ label, value, icon: Icon, color, change, trend }: StatCardProps) {
  return (
    <div className="glass p-6 rounded-lg hover:border-white/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-2">{label}</p>
          <h3 className="text-3xl md:text-4xl font-bold">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} opacity-20 group-hover:opacity-30 transition-opacity`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-1">
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </span>
          <span className="text-xs text-gray-500">vs last period</span>
        </div>
      )}
    </div>
  )
}
