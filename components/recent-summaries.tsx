"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, ExternalLink, FileText, AlertCircle } from "lucide-react"

interface Summary {
  id: string
  title: string
  url: string
  summary: string
  created_at: string
}

export function RecentSummaries() {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecentSummaries()
  }, [])

  const fetchRecentSummaries = async () => {
    try {
      setError(null)
      const response = await fetch("/api/summaries")

      if (response.ok) {
        const data = await response.json()
        setSummaries(Array.isArray(data) ? data : [])
      } else {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
    } catch (error) {
      console.error("Failed to fetch summaries:", error)
      setError("Failed to load recent summaries")
      setSummaries([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Summaries
        </CardTitle>
        <CardDescription>Your previously summarized blog posts</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">{error}</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={fetchRecentSummaries}>
                Try Again
              </Button>
            </div>
          ) : summaries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No summaries yet</p>
              <p className="text-sm">Start by summarizing your first blog!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {summaries.map((summary) => (
                <div key={summary.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm line-clamp-2">{summary.title}</h4>
                    <Button variant="ghost" size="sm" onClick={() => window.open(summary.url, "_blank")}>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-3 mb-3">{summary.summary}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {new Date(summary.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
