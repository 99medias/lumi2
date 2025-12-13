/*
  # Create Scan Results Tables

  1. New Tables
    - `scan_results`
      - `id` (uuid, primary key)
      - `device_fingerprint` (text, unique) - Device identifier for consistent results
      - `security_score` (integer) - Overall security score 0-100
      - `threat_count` (integer) - Number of detected threats
      - `privacy_issues` (integer) - Count of privacy issues
      - `performance_issues` (integer) - Count of performance issues
      - `vulnerabilities` (integer) - Count of vulnerabilities
      - `recommended_plan` (text) - Recommended plan: 's', 'm', or 'l'
      - `last_scanned_at` (timestamptz) - Last scan timestamp
      - `created_at` (timestamptz) - Record creation timestamp

    - `detected_threats`
      - `id` (uuid, primary key)
      - `scan_result_id` (uuid, foreign key) - Reference to scan_results
      - `threat_name` (text) - Name of the threat
      - `threat_type` (text) - Type: malware, spyware, adware, etc.
      - `severity` (text) - Severity level: low, medium, high, critical
      - `location` (text) - Location where threat was found
      - `description` (text) - Description of the threat
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on both tables
    - Public read/write access for anonymous scan results (no auth required for scans)
    - Results are tied to device fingerprint, not user accounts

  3. Indexes
    - Index on device_fingerprint for fast lookups
*/

-- Create scan_results table
CREATE TABLE IF NOT EXISTS scan_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_fingerprint text UNIQUE NOT NULL,
  security_score integer DEFAULT 50,
  threat_count integer DEFAULT 0,
  privacy_issues integer DEFAULT 0,
  performance_issues integer DEFAULT 0,
  vulnerabilities integer DEFAULT 0,
  recommended_plan text DEFAULT 'm',
  last_scanned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create detected_threats table
CREATE TABLE IF NOT EXISTS detected_threats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_result_id uuid NOT NULL REFERENCES scan_results(id) ON DELETE CASCADE,
  threat_name text NOT NULL,
  threat_type text NOT NULL,
  severity text DEFAULT 'medium',
  location text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create index for fast fingerprint lookups
CREATE INDEX IF NOT EXISTS idx_scan_results_fingerprint ON scan_results(device_fingerprint);

-- Create index for foreign key lookups
CREATE INDEX IF NOT EXISTS idx_detected_threats_scan_result ON detected_threats(scan_result_id);

-- Enable RLS
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_threats ENABLE ROW LEVEL SECURITY;

-- Policy for scan_results: Allow public access for anonymous scans
-- Users can read their own scan results by fingerprint
CREATE POLICY "Allow public read access to scan_results"
  ON scan_results
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to scan_results"
  ON scan_results
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update to scan_results"
  ON scan_results
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for detected_threats: Allow public access linked to scan results
CREATE POLICY "Allow public read access to detected_threats"
  ON detected_threats
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert to detected_threats"
  ON detected_threats
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
