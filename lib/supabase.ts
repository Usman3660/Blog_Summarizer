import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Database types
export interface Summary {
  id?: string
  title: string
  url: string
  summary: string
  urdu_summary: string
  created_at?: string
}

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate configuration
const isValidConfig = Boolean(
  supabaseUrl &&
    supabaseServiceKey &&
    supabaseUrl.startsWith("https://") &&
    supabaseUrl.includes(".supabase.co") &&
    supabaseServiceKey.length > 20,
)

// Create client
let supabaseClient: SupabaseClient | null = null

if (isValidConfig && supabaseUrl && supabaseServiceKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
    console.log("✅ Supabase client created successfully")
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error)
    supabaseClient = null
  }
} else {
  console.warn("⚠️ Supabase configuration missing or invalid")
  if (!supabaseUrl) console.warn("  - Missing SUPABASE_URL")
  if (!supabaseServiceKey) console.warn("  - Missing SUPABASE_SERVICE_ROLE_KEY")
}

// Export functions
export const isSupabaseConfigured = (): boolean => {
  return isValidConfig && supabaseClient !== null
}

export const supabase = supabaseClient

// Helper function to test connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  try {
    const { error } = await supabase.from("summaries").select("count").limit(1)
    if (error) {
      console.error("Supabase connection test failed:", error)
      return false
    }
    console.log("✅ Supabase connection test passed")
    return true
  } catch (error) {
    console.error("Supabase connection test error:", error)
    return false
  }
}
