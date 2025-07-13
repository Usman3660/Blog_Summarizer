import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Database types for Supabase table
export interface Summary {
  id?: string
  title: string
  url: string
  summary: string
  urdu_summary: string
  created_at?: string
}

// Get environment variables for Supabase
// Prioritize SUPABASE_SERVICE_ROLE_KEY for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Fallback for anon key if service role key is not set (less secure for server-side)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Determine which key to use for the server-side client
const finalSupabaseKey = supabaseServiceKey || supabaseAnonKey

// Validate configuration
const isValidConfig = Boolean(
  supabaseUrl &&
    finalSupabaseKey &&
    supabaseUrl.startsWith("https://") &&
    supabaseUrl.includes(".supabase.co") &&
    finalSupabaseKey.length > 20, // Basic length check for a valid key
)

// Create Supabase client instance
let supabaseClient: SupabaseClient | null = null

if (isValidConfig && supabaseUrl && finalSupabaseKey) {
  try {
    supabaseClient = createClient(supabaseUrl, finalSupabaseKey, {
      auth: {
        persistSession: false, // Important for server-side
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
    console.log("✅ Supabase client created successfully.")
    if (!supabaseServiceKey) {
      console.warn(
        "⚠️ Using anon key for server-side Supabase client. Ensure RLS policies are permissive or use SERVICE_ROLE_KEY.",
      )
    }
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error)
    supabaseClient = null
  }
} else {
  console.warn("⚠️ Supabase configuration missing or invalid. Data will not be saved to Supabase.")
  if (!supabaseUrl) console.warn("  - Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL")
  if (!finalSupabaseKey) console.warn("  - Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Export functions and client
export const isSupabaseConfigured = (): boolean => {
  return isValidConfig && supabaseClient !== null
}

export const supabase = supabaseClient

// Helper function to test Supabase connection by trying to fetch from the table
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn("Supabase not configured for connection test.")
    return false
  }

  try {
    // Attempt a simple query to check connectivity and permissions
    const { error } = await supabase.from("summaries").select("id").limit(1)
    if (error) {
      console.error("Supabase connection test failed:", error.message)
      // Specific error codes can help debug RLS issues [^1]
      if (error.code === "PGRST001" || error.code === "42501") {
        // PGRST001: RLS enabled, 42501: permission denied
        console.error("Possible RLS or permission issue. Check your Supabase policies and key permissions.")
      }
      return false
    }
    console.log("✅ Supabase connection test passed.")
    return true
  } catch (error) {
    console.error("Supabase connection test error:", error)
    return false
  }
}
