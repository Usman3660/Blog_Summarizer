-- Drop existing table if it exists (for fresh start)
DROP TABLE IF EXISTS summaries;

-- Create summaries table with proper structure
CREATE TABLE summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  summary TEXT NOT NULL,
  urdu_summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_summaries_created_at ON summaries(created_at DESC);
CREATE INDEX idx_summaries_url ON summaries(url);

-- Enable Row Level Security
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for development (adjust for production)
CREATE POLICY "Allow all operations on summaries" ON summaries
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON summaries TO anon;
GRANT ALL ON summaries TO authenticated;
GRANT ALL ON summaries TO service_role;

-- Verify table creation
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'summaries'
ORDER BY ordinal_position;
