import { NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured() || !supabase) {
      console.warn("Supabase not configured - returning empty array")
      return NextResponse.json([])
    }

    const { data, error } = await supabase
      .from("summaries")
      .select("id, title, url, summary, created_at")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching summaries:", error)
    // Return empty array instead of error during build
    return NextResponse.json([])
  }
}
