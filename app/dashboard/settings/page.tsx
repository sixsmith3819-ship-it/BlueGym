'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/ToastContainer'
import { 
  Building2, 
  DollarSign, 
  Bell, 
  Palette, 
  Lock, 
  Database,
  Save,
  RefreshCw
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function SettingsPage() {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    gymName: 'Blue Gym',
    tagline: 'Stronger Together',
    subscriptionFee: '20',
    currency: 'USD',
    notifications: true,
    emailNotifications: false,
    smsNotifications: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      showToast('Settings saved successfully!', 'success')
    } catch (error) {
      showToast('Failed to save settings', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSettings({
      gymName: 'Blue Gym',
      tagline: 'Stronger Together',
      subscriptionFee: '20',
      currency: 'USD',
      notifications: true,
      emailNotifications: false,
      smsNotifications: false,
    })
    showToast('Settings reset to defaults', 'info')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Configure your gym settings and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gym Information */}
        <div className="glass p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Building2 className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Gym Information</h2>
              <p className="text-sm text-gray-400">Basic information about your gym</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gym Name
              </label>
              <input
                type="text"
                name="gymName"
                value={settings.gymName}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="glass p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <DollarSign className="text-success" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Pricing</h2>
              <p className="text-sm text-gray-400">Subscription and payment settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monthly Subscription Fee
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">$</span>
                <input
                  type="number"
                  name="subscriptionFee"
                  value={settings.subscriptionFee}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full bg-white/5 border border-white/20 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
              >
                <option value="USD" className="bg-surface text-white">USD ($)</option>
                <option value="EUR" className="bg-surface text-white">EUR (€)</option>
                <option value="GBP" className="bg-surface text-white">GBP (£)</option>
                <option value="ZWL" className="bg-surface text-white">ZWL (Z$)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <Bell className="text-warning" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Notifications</h2>
              <p className="text-sm text-gray-400">Manage notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-400">Receive notifications in the app</p>
              </div>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="w-5 h-5 rounded accent-primary"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-400">Get updates via email</p>
              </div>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="w-5 h-5 rounded accent-primary"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-400">Receive SMS alerts for important events</p>
              </div>
              <input
                type="checkbox"
                name="smsNotifications"
                checked={settings.smsNotifications}
                onChange={handleChange}
                className="w-5 h-5 rounded accent-primary"
              />
            </label>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Palette className="text-accent" size={20} />
              <h3 className="font-bold">Theme</h3>
            </div>
            <p className="text-sm text-gray-400 mb-3">Dark theme with glassmorphism design</p>
            <p className="text-xs text-primary">Active</p>
          </div>

          <div className="glass p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="text-error" size={20} />
              <h3 className="font-bold">Security</h3>
            </div>
            <p className="text-sm text-gray-400 mb-3">Supabase authentication enabled</p>
            <p className="text-xs text-success">Secure</p>
          </div>

          <div className="glass p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Database className="text-secondary" size={20} />
              <h3 className="font-bold">Database</h3>
            </div>
            <p className="text-sm text-gray-400 mb-3">PostgreSQL with Row Level Security</p>
            <p className="text-xs text-success">Connected</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="flex-1 sm:flex-initial"
          >
            <Save size={18} className="mr-2" />
            Save Changes
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleReset}
            disabled={isLoading}
            className="flex-1 sm:flex-initial"
          >
            <RefreshCw size={18} className="mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </form>

      {/* Info Footer */}
      <div className="glass p-4 rounded-lg">
        <p className="text-sm text-gray-400 text-center">
          💡 <strong>Tip:</strong> Settings are saved to your browser's local storage. 
          For production, connect to a database to persist settings across devices.
        </p>
      </div>
    </div>
  )
}
