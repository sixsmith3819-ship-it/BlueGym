'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Mail, Lock, AlertCircle, CheckCircle, UserPlus, KeyRound } from 'lucide-react'

type AuthMode = 'login' | 'signup' | 'forgot'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user just verified their email
    if (searchParams.get('verified') === 'true') {
      setSuccess('Email verified! You can now sign in.')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || data.error || 'Login failed')
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Signup failed')
        return
      }

      setSuccess(data.message)
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      
      setTimeout(() => {
        setMode('login')
        setSuccess('Please check your email to verify your account before signing in.')
      }, 3000)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to send reset email')
        return
      }

      setSuccess(data.message)
      setEmail('')
      
      setTimeout(() => {
        setMode('login')
      }, 3000)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (mode === 'login') return handleLogin(e)
    if (mode === 'signup') return handleSignup(e)
    if (mode === 'forgot') return handleForgotPassword(e)
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    resetForm()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="fixed inset-0 aurora-glow"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-aurora flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">
                {mode === 'login' && '💪'}
                {mode === 'signup' && '👤'}
                {mode === 'forgot' && '🔑'}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">BLUE GYM</h1>
            <p className="text-gray-400">
              {mode === 'login' && 'Admin Dashboard'}
              {mode === 'signup' && 'Create Admin Account'}
              {mode === 'forgot' && 'Reset Password'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-error/20 border border-error/50 rounded-lg flex items-start gap-3 animate-slide-in">
              <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-success/20 border border-success/50 rounded-lg flex items-start gap-3 animate-slide-in">
              <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
              <p className="text-success text-sm">{success}</p>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bluegym.com"
                  className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input (not shown in forgot mode) */}
            {mode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Confirm Password Input (only in signup mode) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Forgot Password Link (only in login mode) */}
            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-6"
            >
              {mode === 'login' && (isLoading ? 'Signing in...' : 'Sign In')}
              {mode === 'signup' && (isLoading ? 'Creating account...' : 'Create Account')}
              {mode === 'forgot' && (isLoading ? 'Sending email...' : 'Send Reset Email')}
            </Button>
          </form>

          {/* Mode Switch Links */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            {mode === 'login' && (
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  disabled={isLoading}
                >
                  Sign Up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  disabled={isLoading}
                >
                  Sign In
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p className="text-gray-400 text-sm">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  disabled={isLoading}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Tagline */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          © 2026 Blue Gym. All rights reserved.
        </p>
      </div>
    </div>
  )
}
