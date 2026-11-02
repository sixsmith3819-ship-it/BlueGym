'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import Button from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
}: EmptyStateProps) {
  const colors = {
    default: {
      bg: 'bg-primary/20',
      icon: 'text-primary/60',
      gradient: 'from-primary/30 to-primary/10',
      dot: 'bg-primary/30',
    },
    success: {
      bg: 'bg-success/20',
      icon: 'text-success/60',
      gradient: 'from-success/30 to-success/10',
      dot: 'bg-success/30',
    },
    warning: {
      bg: 'bg-warning/20',
      icon: 'text-warning/60',
      gradient: 'from-warning/30 to-warning/10',
      dot: 'bg-warning/30',
    },
    error: {
      bg: 'bg-error/20',
      icon: 'text-error/60',
      gradient: 'from-error/30 to-error/10',
      dot: 'bg-error/30',
    },
  }

  const colorScheme = colors[variant]

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      {/* Animated Icon */}
      <div className="relative mb-6">
        <div className={`absolute inset-0 ${colorScheme.bg} rounded-full blur-xl animate-pulse`}></div>
        <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${colorScheme.gradient} flex items-center justify-center`}>
          <Icon size={40} className={colorScheme.icon} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-2 text-gray-200">{title}</h3>

      {/* Description */}
      <p className="text-gray-400 mb-6 max-w-md text-sm">{description}</p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}

      {/* Decorative Elements */}
      <div className="mt-8 flex gap-2">
        <div className={`w-2 h-2 rounded-full ${colorScheme.dot} animate-pulse`} style={{ animationDelay: '0ms' }}></div>
        <div className={`w-2 h-2 rounded-full ${colorScheme.dot} animate-pulse`} style={{ animationDelay: '150ms' }}></div>
        <div className={`w-2 h-2 rounded-full ${colorScheme.dot} animate-pulse`} style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}
