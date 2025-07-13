import { NextResponse } from "next/server"
import { supabase, isSupabaseConfigured, testSupabaseConnection } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("🔄 Fetching recent summaries from Supabase...")

    // Check if Supabase is configured and client is initialized
    if (!isSupabaseConfigured() || !supabase) {
      console.warn("⚠️ Supabase not configured or client not initialized. Returning empty array for summaries.")
      return NextResponse.json([])
    }

    // Test connection before attempting to fetch data
    const connectionTestPassed = await testSupabaseConnection()
    if (!connectionTestPassed) {
      console.error("❌ Supabase connection test failed. Cannot fetch summaries.")
      return NextResponse.json([])
    }

    const { data, error } = await supabase
      .from("summaries")
      .select("id, title, url, summary, created_at")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("❌ Supabase query error:", error)
      // Specific error codes can help debug RLS issues [^1]
      if (error.code === "PGRST001" || error.code === "42501") {
        console.error("Possible RLS or permission issue during SELECT. Check your Supabase policies.")
      }
      return NextResponse.json([])
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} summaries from Supabase.`)
    return NextResponse.json(data || [])
  } catch (error) {
    console.error("❌ Error in GET /api/summaries:", error)
    return NextResponse.json([])
  }
}
