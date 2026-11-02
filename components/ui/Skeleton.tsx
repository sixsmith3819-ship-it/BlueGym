'use client'

import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export default function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) {
  const baseClass = 'animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%]'
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

// Pre-built skeleton components
export function StatCardSkeleton() {
  return (
    <div className="glass p-6 rounded-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="w-24 h-4 mb-3" variant="text" />
          <Skeleton className="w-20 h-8" variant="text" />
        </div>
        <Skeleton className="w-12 h-12" variant="circular" />
      </div>
      <Skeleton className="w-16 h-3" variant="text" />
    </div>
  )
}

export function PaymentCardSkeleton() {
  return (
    <div className="p-4 bg-white/5 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="w-32 h-5 mb-2" variant="text" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-20 h-3" variant="text" />
            <Skeleton className="w-16 h-3" variant="text" />
          </div>
        </div>
        <div className="text-right">
          <Skeleton className="w-16 h-6 mb-1" variant="text" />
          <Skeleton className="w-20 h-3" variant="text" />
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="glass p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="w-40 h-5 mb-2" variant="text" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-24 h-3" variant="text" />
            <Skeleton className="w-28 h-3" variant="text" />
          </div>
        </div>
        <Skeleton className="w-20 h-8" variant="rectangular" />
      </div>
    </div>
  )
}
