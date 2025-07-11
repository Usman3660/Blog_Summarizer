"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Link, FileText, Languages, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SummaryResult {
  originalText: string
  summary: string
  urduSummary: string
  url: string
  title: string
}

export function BlogSummarizerForm() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SummaryResult | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid blog URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error("Failed to process blog")
      }

      const data = await response.json()
      setResult(data)

      toast({
        title: "Success!",
        description: "Blog has been summarized and translated successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to process the blog. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Enter Blog URL
          </CardTitle>
          <CardDescription>Paste the URL of any blog post to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Blog URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/blog-post"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Summarize Blog
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Summary Results
            </CardTitle>
            <CardDescription>{result.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* English Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">English Summary</Badge>
                <Save className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Saved to Supabase</span>
              </div>
              <Textarea value={result.summary} readOnly className="min-h-[120px] resize-none" />
            </div>

            <Separator />

            {/* Urdu Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <Languages className="mr-1 h-3 w-3" />
                  Urdu Translation
                </Badge>
              </div>
              <Textarea
                value={result.urduSummary}
                readOnly
                className="min-h-[120px] resize-none font-urdu text-right"
                dir="rtl"
              />
            </div>

            <Separator />

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Full text saved to MongoDB</span>
              <Badge variant="outline">{result.originalText.length} characters</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
