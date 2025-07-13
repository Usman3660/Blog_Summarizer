import { type NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"
import { translateToUrdu } from "@/lib/translator"
import { generateSummary } from "@/lib/summarizer"
import { supabase, isSupabaseConfigured, testSupabaseConnection, type Summary } from "@/lib/supabase"
import { getMongoClientPromise } from "@/lib/mongodb" // Import the function to get the client promise

export async function POST(request: NextRequest) {
  let mongoSaveAttempted = false // Flag to track if MongoDB save was attempted
  let mongoSavedSuccessfully = false // Flag to track if MongoDB save was successful

  try {
    console.log("--- Environment Variable Check ---")
    console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "NOT SET")
    console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "NOT SET")
    console.log("MONGODB_URI:", process.env.MONGODB_URI ? "SET" : "NOT SET")
    console.log("----------------------------------")

    const { url } = await request.json()

    if (!url) {
      console.error("❌ URL is required for summarization.")
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch (e) {
      console.error("❌ Invalid URL format:", url, e)
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    console.log(`🔄 Processing URL: ${url}`)

    // Create AbortController for timeout for the fetch operation
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      console.error(`❌ Fetch request timed out for URL: ${url}`)
    }, 15000) // 15 second timeout for fetching content

    let htmlContent = ""
    let pageTitle = "Untitled Blog Post"
    let extractedContent = ""

    try {
      // Scrape the blog content
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate",
          Connection: "keep-alive",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId) // Clear timeout if fetch completes within time

      if (!response.ok) {
        const errorText = await response.text()
        console.error(
          `❌ Failed to fetch blog content: ${response.status} ${response.statusText}. Response: ${errorText.substring(0, 200)}`,
        )
        throw new Error(`Failed to fetch blog content: ${response.status} ${response.statusText}`)
      }

      htmlContent = await response.text()
      const $ = cheerio.load(htmlContent)

      // Extract title
      pageTitle = $("title").text().trim() || $("h1").first().text().trim() || "Untitled Blog Post"

      // Remove unwanted elements to clean up content
      $("script, style, nav, header, footer, aside, .advertisement, .ads, .sidebar, .menu, .navigation").remove()

      // Extract main content with multiple fallbacks
      const contentSelectors = [
        "article",
        "main",
        ".content",
        ".post-content",
        ".entry-content",
        ".article-content",
        "[role='main']",
        ".post-body",
        ".story-body",
      ]

      for (const selector of contentSelectors) {
        extractedContent = $(selector).text().trim()
        if (extractedContent && extractedContent.length > 200) break // Found enough content
      }

      // Fallback to body if no sufficient content found with specific selectors
      if (!extractedContent || extractedContent.length < 200) {
        extractedContent = $("body").text().trim()
      }

      // Clean up content: replace multiple spaces/newlines with single space
      extractedContent = extractedContent.replace(/\s+/g, " ").replace(/\n+/g, " ").trim()

      if (!extractedContent || extractedContent.length < 100) {
        console.error("❌ Could not extract sufficient content from the blog.")
        return NextResponse.json(
          {
            error:
              "Could not extract sufficient content from the blog. The page might be protected or have dynamic content.",
          },
          { status: 400 },
        )
      }

      console.log(`✅ Content extracted: ${extractedContent.length} characters. Title: "${pageTitle}"`)
    } catch (fetchError) {
      clearTimeout(timeoutId) // Ensure timeout is cleared even if an error occurs
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("❌ Request timeout during fetch:", fetchError.message)
        return NextResponse.json({ error: "Request timeout - the website took too long to respond" }, { status: 408 })
      }
      console.error("❌ Error during content fetching or parsing:", fetchError)
      return NextResponse.json(
        {
          error: `Failed to fetch or parse blog content: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`,
        },
        { status: 500 },
      )
    }

    // Generate summary
    const summary = generateSummary(extractedContent)
    console.log(`✅ Summary generated: ${summary.length} characters`)

    // Translate to Urdu
    const urduSummary = translateToUrdu(summary)
    console.log(`✅ Urdu translation completed`)

    let supabaseData: { id: string } | null = null
    let supabaseSaveError: string | null = null

    // Save to Supabase
    if (isSupabaseConfigured() && supabase) {
      console.log("🔄 Attempting to save to Supabase...")
      const connectionTestPassed = await testSupabaseConnection()

      if (connectionTestPassed) {
        try {
          const summaryToSave: Summary = {
            title: pageTitle.substring(0, 500), // Limit title length to match DB schema
            url: url.substring(0, 500), // Limit URL length
            summary: summary.substring(0, 2000), // Limit summary length
            urdu_summary: urduSummary.substring(0, 2000), // Limit Urdu summary length
            // created_at is handled by default in DB, no need to send
          }

          const { data, error: insertError } = await supabase
            .from("summaries")
            .insert(summaryToSave)
            .select("id") // Select only the ID to confirm insertion
            .single()

          if (insertError) {
            console.error("❌ Supabase insert error:", insertError)
            supabaseSaveError = insertError.message
          } else if (data) {
            supabaseData = data as { id: string }
            console.log("✅ Successfully saved to Supabase with ID:", data.id)
          } else {
            console.error("❌ No data returned from Supabase insert operation.")
            supabaseSaveError = "No data returned from insert operation."
          }
        } catch (error) {
          console.error("❌ Supabase save operation failed:", error)
          supabaseSaveError = error instanceof Error ? error.message : "Unknown Supabase save error"
        }
      } else {
        console.error("❌ Supabase connection test failed before saving. Data not saved to Supabase.")
        supabaseSaveError = "Supabase connection failed."
      }
    } else {
      console.warn("⚠️ Supabase not configured or client not initialized. Skipping database save.")
      supabaseSaveError = "Supabase not configured."
    }

    // Save to MongoDB
    const mongoClientPromise = getMongoClientPromise() // Get the promise by calling the function
    if (mongoClientPromise) {
      mongoSaveAttempted = true
      try {
        console.log("🔄 Attempting to save to MongoDB...")
        const client = await mongoClientPromise // Await the promise to get the client
        const db = client.db("user") // Use your MongoDB database name 'user'
        const collection = db.collection("full_texts") // Collection name

        // Log the database and collection being used
        console.log(
          `MongoDB: Connected to database '${db.databaseName}', attempting to insert into collection '${collection.collectionName}'`,
        )

        await collection.insertOne({
          title: pageTitle,
          url,
          full_text: extractedContent,
          summary_id: supabaseData?.id || null, // Link to Supabase summary if available
          created_at: new Date(),
        })
        console.log("✅ Successfully saved full text to MongoDB.")
        mongoSavedSuccessfully = true
      } catch (mongoError) {
        console.error("❌ MongoDB save error:", mongoError)
      }
      // No need to call client.close() here, as getMongoClientPromise manages the connection lifecycle.
    } else {
      console.warn("⚠️ MongoDB not configured. Skipping full text save to MongoDB.")
      if (!process.env.MONGODB_URI) {
        console.error("  - MONGODB_URI is missing from environment variables.")
      }
    }

    // Return response with debug info for client-side feedback
    const finalResponse = {
      title: pageTitle,
      url,
      originalText: extractedContent,
      summary,
      urduSummary,
      debug: {
        supabaseConfigured: isSupabaseConfigured(),
        supabaseSaved: !!supabaseData,
        supabaseError: supabaseSaveError,
        mongoConfigured: !!mongoClientPromise, // Check if clientPromise was initialized
        mongoSaved: mongoSaveAttempted && mongoSavedSuccessfully,
      },
    }
    console.log("✅ Processing completed successfully.")
    return NextResponse.json(finalResponse)
  } catch (error) {
    console.error("❌ Overall summarization process failed:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to process blog post due to an unknown error.",
      },
      { status: 500 },
    )
  }
}
