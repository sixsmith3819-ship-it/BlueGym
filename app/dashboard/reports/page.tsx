'use client'

import React, { useState } from 'react'
import { Download, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })

  const handleExportCSV = () => {
    alert('CSV export will be implemented - fetches data and downloads as CSV file')
  }

  const handleExportPDF = () => {
    alert('PDF export will be implemented - generates PDF report with charts')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-gray-400">View financial and membership reports.</p>
      </div>

      {/* Date Range Filter */}
      <div className="glass p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="text-primary" size={24} />
          Report Period
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all"
            />
          </div>
          <div className="flex items-end">
            <Button variant="primary" className="w-full">
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <DollarSign className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold">$0.00</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleExportCSV}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>

        <div className="glass p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp className="text-success" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Payments</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleExportCSV}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>

        <div className="glass p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
              <Users className="text-warning" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">New Members</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleExportCSV}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>

        <div className="glass p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <Calendar className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Renewals</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleExportCSV}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Export Options */}
      <div className="glass p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Export Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold mb-2">Payment History</h3>
            <p className="text-sm text-gray-400 mb-4">Export all payment records with member details</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download size={16} className="mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download size={16} className="mr-2" />
                PDF
              </Button>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold mb-2">Member List</h3>
            <p className="text-sm text-gray-400 mb-4">Export all registered members with status</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download size={16} className="mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download size={16} className="mr-2" />
                PDF
              </Button>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold mb-2">Revenue Report</h3>
            <p className="text-sm text-gray-400 mb-4">Monthly revenue breakdown with charts</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download size={16} className="mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download size={16} className="mr-2" />
                PDF
              </Button>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="font-semibold mb-2">Subscription Status</h3>
            <p className="text-sm text-gray-400 mb-4">Active and expired memberships report</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download size={16} className="mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download size={16} className="mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="glass p-6 rounded-lg bg-secondary/10 border-secondary/30">
        <h3 className="font-semibold mb-2">📊 Reports Coming Soon</h3>
        <p className="text-sm text-gray-400">
          Detailed reports with date filtering and export functionality are being finalized.
          You'll be able to generate comprehensive financial and membership reports with just a few clicks.
        </p>
      </div>
    </div>
  )
}
