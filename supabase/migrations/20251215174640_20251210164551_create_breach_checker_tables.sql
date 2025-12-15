/*
  # Create breach checker database tables

  1. New Tables
    - `breach_searches` - Track user searches for audit/analytics
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `search_type` (email|password|advanced)
      - `search_query` (masked email/query)
      - `hibp_breaches_found` (integer)
      - `dehashed_records_found` (integer)
      - `credits_used` (integer)
      - `created_at` (timestamp)
      
    - `user_credits` - User credit balance for advanced searches
      - `user_id` (uuid, primary key)
      - `balance` (integer, default 0)
      - `total_purchased` (integer, default 0)
      - `total_used` (integer, default 0)
      - `updated_at` (timestamp)
      
    - `credit_purchases` - Purchase history
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `amount` (integer)
      - `price_cents` (integer)
      - `status` (pending|completed|failed)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only view their own data
    - App service role can insert searches

  3. Indexes
    - user_id on all tables for fast lookups
    - created_at for time-based queries
*/

-- Create breach_searches table
CREATE TABLE IF NOT EXISTS breach_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  search_type text NOT NULL CHECK (search_type IN ('email', 'password', 'advanced')),
  search_query text NOT NULL,
  hibp_breaches_found integer DEFAULT 0,
  dehashed_records_found integer DEFAULT 0,
  credits_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_credits table
CREATE TABLE IF NOT EXISTS user_credits (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance integer DEFAULT 0,
  total_purchased integer DEFAULT 0,
  total_used integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Create credit_purchases table
CREATE TABLE IF NOT EXISTS credit_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  price_cents integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE breach_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for breach_searches
CREATE POLICY "Users can view own searches"
  ON breach_searches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert searches"
  ON breach_searches FOR INSERT
  WITH CHECK (true);

-- RLS Policies for user_credits
CREATE POLICY "Users can view own credits"
  ON user_credits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service can update credits"
  ON user_credits FOR UPDATE
  WITH CHECK (true);

-- RLS Policies for credit_purchases
CREATE POLICY "Users can view own purchases"
  ON credit_purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert purchases"
  ON credit_purchases FOR INSERT
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_breach_searches_user_id ON breach_searches(user_id);
CREATE INDEX idx_breach_searches_created_at ON breach_searches(created_at);
CREATE INDEX idx_credit_purchases_user_id ON credit_purchases(user_id);
CREATE INDEX idx_credit_purchases_created_at ON credit_purchases(created_at);