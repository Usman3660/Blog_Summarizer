import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function saveSummary(url, summary) {
  const { error } = await supabase
    .from('summaries')
    .insert([{ url, summary, created_at: new Date().toISOString() }]);

  if (error) throw new Error(`Supabase error: ${error.message}`);
}