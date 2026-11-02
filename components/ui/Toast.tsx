'use client'

import React, { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />,
  }

  const colors = {
    success: 'bg-success/20 border-success/50 text-success',
    error: 'bg-error/20 border-error/50 text-error',
    warning: 'bg-warning/20 border-warning/50 text-warning',
    info: 'bg-primary/20 border-primary/50 text-primary',
  }

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border backdrop-blur-md shadow-lg ${colors[type]} animate-slide-in-right`}
      style={{
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X size={18} />
      </button>
    </div>
  )
}
