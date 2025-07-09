"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { History, Calendar, Hash, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Summary {
  id: string
  user_id: string
  summary: string
  key_points: string
  word_count: number
  file_type: string
  created_at: string
}

interface SummaryHistoryProps {
  refreshTrigger?: number
}

export function SummaryHistory({ refreshTrigger }: SummaryHistoryProps) {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchSummaries()
  }, [refreshTrigger])

  const fetchSummaries = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/v1/summaries", {
        method: "POST", // Based on your API docs, it's POST with empty body
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch summaries")
      }

      const data = await response.json()
      setSummaries(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load summaries")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatKeyPoints = (keyPoints: string | undefined | null) => {
    if (!keyPoints || typeof keyPoints !== "string") {
      return []
    }
    return keyPoints
      .split(/[•\n\r-]/)
      .map((point) => point.trim())
      .filter((point) => point.length > 0)
      .slice(0, 3) // Show only first 3 key points in history
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Summary History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Summary History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="mr-2 h-5 w-5" />
          Summary History
        </CardTitle>
        <CardDescription>
          {summaries.length} {summaries.length === 1 ? "summary" : "summaries"} generated
        </CardDescription>
      </CardHeader>
      <CardContent>
        {summaries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No summaries yet. Upload your first book to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary) => (
              <Collapsible key={summary.id}>
                <Card className="border-l-4 border-l-blue-500">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="capitalize">
                            {summary.file_type}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatDate(summary.created_at)}
                            </span>
                            <span className="flex items-center">
                              <Hash className="mr-1 h-3 w-3" />
                              {summary.word_count.toLocaleString()} words
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          {expandedItems.has(summary.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-gray-600 line-clamp-2">{summary.summary.substring(0, 150)}...</p>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Full Summary</h4>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{summary.summary}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Key Points</h4>
                          <div className="space-y-1">
                            {formatKeyPoints(summary.key_points).map((point, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-gray-700">{point}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
