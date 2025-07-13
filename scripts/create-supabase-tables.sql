-- This script ensures your Supabase table is correctly set up with RLS and permissions.
-- Run this in your Supabase SQL Editor.

-- Drop existing table if it exists (for a clean start, useful during development)
-- CAUTION: This will delete all existing data in the 'summaries' table.
-- If you have important data, comment out this line or back it up first.
DROP TABLE IF EXISTS summaries CASCADE;

-- Create the 'summaries' table
CREATE TABLE public.summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  summary TEXT NOT NULL,
  urdu_summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries on common columns
CREATE INDEX IF NOT EXISTS idx_summaries_created_at ON public.summaries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_summaries_url ON public.summaries(url);

-- Enable Row Level Security (RLS) on the 'summaries' table
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies:
-- For development, a permissive policy is often used.
-- In production, you'd typically restrict access based on user roles (e.g., auth.uid()).

-- Policy to allow SELECT (read) access for all users (anon and authenticated)
CREATE POLICY "Allow public read access" ON public.summaries
  FOR SELECT
  USING (true);

-- Policy to allow INSERT (create) access for all users (anon and authenticated)
CREATE POLICY "Allow public insert access" ON public.summaries
  FOR INSERT
  WITH CHECK (true);

-- Policy to allow UPDATE access (optional, if you need to modify summaries)
-- For this app, we typically only insert, so this might not be strictly needed.
CREATE POLICY "Allow public update access" ON public.summaries
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy to allow DELETE access (optional)
CREATE POLICY "Allow public delete access" ON public.summaries
  FOR DELETE
  USING (true);

-- Grant necessary permissions to the 'anon' and 'authenticated' roles
-- These roles are used by the Supabase client when a user is not signed in (anon)
-- or signed in (authenticated).
GRANT ALL ON public.summaries TO anon;
GRANT ALL ON public.summaries TO authenticated;

-- Grant permissions to the 'service_role' role
-- The service_role key bypasses RLS, so it needs direct table permissions.
-- This is crucial if you are using SUPABASE_SERVICE_ROLE_KEY on your server.
GRANT ALL ON public.summaries TO service_role;

-- Verify table and policies (optional, for debugging)
-- SELECT * FROM pg_policies WHERE tablename = 'summaries';
-- SELECT * FROM information_schema.columns WHERE table_name = 'summaries';
