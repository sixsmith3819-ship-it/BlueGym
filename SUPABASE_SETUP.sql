-- Blue Gym Database Schema
-- Execute these queries in Supabase SQL Editor

-- ============================================================================
-- 1. GYM SETTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS gym_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_name VARCHAR(255) NOT NULL DEFAULT 'Blue Gym',
  monthly_subscription_fee DECIMAL(10, 2) NOT NULL DEFAULT 20.00,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  expiry_warning_days INTEGER NOT NULL DEFAULT 3,
  gym_logo TEXT,
  contact_information TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. MEMBERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  registration_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for fast member lookups
CREATE INDEX idx_members_member_id ON members(member_id);
CREATE INDEX idx_members_full_name ON members(full_name);
CREATE INDEX idx_members_is_active ON members(is_active);

-- ============================================================================
-- 3. PAYMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number VARCHAR(50) NOT NULL UNIQUE,
  verification_token VARCHAR(100) NOT NULL UNIQUE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'ecocash', 'bank_transfer', 'other')),
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  subscription_start_date DATE NOT NULL,
  subscription_end_date DATE NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for payment lookups
CREATE INDEX idx_payments_member_id ON payments(member_id);
CREATE INDEX idx_payments_receipt_number ON payments(receipt_number);
CREATE INDEX idx_payments_verification_token ON payments(verification_token);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_subscription_end_date ON payments(subscription_end_date);

-- ============================================================================
-- 4. SUBSCRIPTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for subscription lookups
CREATE INDEX idx_subscriptions_member_id ON subscriptions(member_id);
CREATE INDEX idx_subscriptions_payment_id ON subscriptions(payment_id);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);
CREATE INDEX idx_subscriptions_is_active ON subscriptions(is_active);

-- ============================================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE gym_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated admin can read/write gym_settings
CREATE POLICY "Admins can manage gym settings" ON gym_settings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated admin can read/write members
CREATE POLICY "Admins can manage members" ON members
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated admin can read/write payments
CREATE POLICY "Admins can manage payments" ON payments
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated admin can read/write subscriptions
CREATE POLICY "Admins can manage subscriptions" ON subscriptions
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Public can read payment verification (anonymous access with token)
-- This will be handled via API endpoint for security

-- ============================================================================
-- 6. INSERT DEFAULT GYM SETTINGS
-- ============================================================================

INSERT INTO gym_settings (gym_name, monthly_subscription_fee, currency, expiry_warning_days)
VALUES ('Blue Gym', 20.00, 'USD', 3)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to generate member ID
CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS VARCHAR(20) AS $$
BEGIN
  RETURN 'BGM' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || LPAD((
    SELECT COUNT(*) + 1
    FROM members
    WHERE DATE_TRUNC('month', registration_date) = DATE_TRUNC('month', CURRENT_DATE)
  )::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate receipt number
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS VARCHAR(50) AS $$
BEGIN
  RETURN 'RCP' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD((
    SELECT COUNT(*) + 1
    FROM payments
    WHERE DATE(payment_date) = CURRENT_DATE
  )::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to calculate subscription dates
CREATE OR REPLACE FUNCTION calculate_subscription_dates(
  last_subscription_end DATE,
  payment_date_input DATE,
  OUT start_date DATE,
  OUT end_date DATE
) AS $$
DECLARE
  v_start_date DATE;
  v_end_date DATE;
BEGIN
  -- If there's a previous subscription
  IF last_subscription_end IS NOT NULL THEN
    -- If paying before expiry, new subscription starts after expiry
    IF payment_date_input <= last_subscription_end THEN
      v_start_date := last_subscription_end + INTERVAL '1 day';
    -- If paying after expiry, new subscription starts on payment date
    ELSE
      v_start_date := payment_date_input;
    END IF;
  -- First subscription
  ELSE
    v_start_date := payment_date_input;
  END IF;

  -- Calculate end date (last day of subscription month)
  v_end_date := (DATE_TRUNC('month', v_start_date) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

  start_date := v_start_date;
  end_date := v_end_date;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Tables are created with RLS enabled
-- 3. Only authenticated users can access data
-- 4. Helper functions for generating IDs and calculating dates
-- 5. Indexes created for optimal query performance
-- 6. Foreign key constraints ensure data integrity
