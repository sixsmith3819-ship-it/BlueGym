import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client (uses service role key)
// This should ONLY be used in server-side code (API routes, server actions)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Export specific databases for cleaner imports
export const memberDatabase = supabaseAdmin.from('members')
export const paymentDatabase = supabaseAdmin.from('payments')
export const subscriptionDatabase = supabaseAdmin.from('subscriptions')
export const gymSettingsDatabase = supabaseAdmin.from('gym_settings')
