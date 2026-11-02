import { XCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-darker">
      {/* Background Elements */}
      <div className="fixed inset-0 aurora-glow"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>

      {/* Error Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass p-8 rounded-lg text-center">
          {/* Logo */}
          <div className="w-16 h-16 rounded-xl bg-gradient-aurora flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💪</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">BLUE GYM</h1>
          <p className="text-sm text-gray-400 mb-8">Payment Receipt Verification</p>

          {/* Error Status */}
          <div className="p-6 rounded-lg mb-6 bg-error/20 border border-error/50">
            <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-4 text-error">
              <XCircle size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-error">INVALID RECEIPT</h2>
            <p className="text-gray-300">
              This QR code or verification link is not valid.
            </p>
          </div>

          {/* Possible Reasons */}
          <div className="text-left p-4 bg-white/5 rounded-lg mb-6">
            <p className="font-semibold mb-3 text-sm">Possible reasons:</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-error mt-0.5">•</span>
                <span>The QR code or link is incorrect</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-error mt-0.5">•</span>
                <span>The receipt has been cancelled</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-error mt-0.5">•</span>
                <span>The verification code has expired</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <p className="text-sm text-gray-400 mb-4">
            Please contact Blue Gym staff if you believe this is an error.
          </p>

          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
          >
            Return to Home
          </Link>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-400">
            <p>Blue Gym • Stronger Together</p>
            <p className="mt-1">© 2026 Blue Gym. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
