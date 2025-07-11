import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import * as cheerio from "cheerio"
import { translateToUrdu } from "@/lib/translator"
import { generateSummary } from "@/lib/summarizer"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

// Make MongoDB connection optional during development
const mongoUri = process.env.MONGODB_URI
const mongoClient = mongoUri ? new MongoClient(mongoUri) : null

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      // Scrape the blog content
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Failed to fetch blog content: ${response.status} ${response.statusText}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      // Extract title and content
      const title = $("title").text() || $("h1").first().text() || "Untitled Blog Post"

      // Remove script and style elements
      $("script, style, nav, header, footer, aside, .advertisement, .ads").remove()

      // Extract main content with multiple fallbacks
      let content =
        $("article").text() ||
        $("main").text() ||
        $(".content").text() ||
        $(".post-content").text() ||
        $(".entry-content").text() ||
        $("body").text()

      content = content.replace(/\s+/g, " ").trim()

      if (!content || content.length < 100) {
        return NextResponse.json(
          {
            error:
              "Could not extract sufficient content from the blog. The page might be protected or have dynamic content.",
          },
          { status: 400 },
        )
      }

      // Generate summary using static logic
      const summary = generateSummary(content)

      // Translate to Urdu
      const urduSummary = translateToUrdu(summary)

      let supabaseData: { id: string } | null = null

      // Save summary to Supabase (only if configured)
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data, error: supabaseError } = await supabase
            .from("summaries")
            .insert({
              title,
              url,
              summary,
              urdu_summary: urduSummary,
              created_at: new Date().toISOString(),
            })
            .select()
            .single()

          if (supabaseError) {
            console.error("Supabase error:", supabaseError)
          } else {
            supabaseData = data
          }
        } catch (error) {
          console.error("Supabase connection error:", error)
        }
      } else {
        console.warn("Supabase not configured - skipping database save")
      }

      // Save full text to MongoDB (only if configured)
      if (mongoClient) {
        try {
          await mongoClient.connect()
          const db = mongoClient.db("blog_summarizer")
          const collection = db.collection("full_texts")

          await collection.insertOne({
            title,
            url,
            full_text: content,
            summary_id: supabaseData?.id || null,
            created_at: new Date(),
          })
        } catch (mongoError) {
          console.error("MongoDB error:", mongoError)
        } finally {
          await mongoClient.close()
        }
      } else {
        console.warn("MongoDB not configured - skipping full text save")
      }

      return NextResponse.json({
        title,
        url,
        originalText: content,
        summary,
        urduSummary,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json({ error: "Request timeout - the website took too long to respond" }, { status: 408 })
      }
      throw fetchError
    }
  } catch (error) {
    console.error("Summarization error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process blog post",
      },
      { status: 500 },
    )
  }
}
