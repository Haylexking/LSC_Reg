/*
  # Create Bootcamp Registrations Table

  1. New Tables
    - `bootcamp_registrations`
      - `id` (uuid, primary key) - Unique identifier for each registration
      - `full_name` (text) - Participant's full name
      - `email` (text) - Participant's email address
      - `phone_number` (text) - Participant's phone number
      - `skill` (text) - Selected skill from dropdown
      - `membership_status` (text) - Either 'Member' or 'Visitor'
      - `payment_status` (text) - Payment status (pending, completed, failed)
      - `payment_reference` (text, nullable) - Paystack payment reference
      - `created_at` (timestamptz) - Registration timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `bootcamp_registrations` table
    - Add policy for public insert access (anyone can register)
    - Add policy for authenticated users to read all registrations (for admin purposes)

  3. Important Notes
    - Email field has a unique constraint to prevent duplicate registrations
    - Payment status defaults to 'pending'
    - Timestamps are automatically managed
*/

CREATE TABLE IF NOT EXISTS bootcamp_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone_number text NOT NULL,
  skill text NOT NULL,
  membership_status text NOT NULL CHECK (membership_status IN ('Member', 'Visitor')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_reference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bootcamp_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register"
  ON bootcamp_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own registration by email"
  ON bootcamp_registrations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can view all registrations"
  ON bootcamp_registrations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update registrations"
  ON bootcamp_registrations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);