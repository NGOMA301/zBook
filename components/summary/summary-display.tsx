"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, FileText, Calendar, Hash } from "lucide-react"

interface Summary {
  id: string
  user_id: string
  summary: string
  key_points: string
  word_count: number
  file_type: string
  created_at: string
}

interface SummaryDisplayProps {
  summary: Summary
}

export function SummaryDisplay({ summary }: SummaryDisplayProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatKeyPoints = (keyPoints: string | undefined | null) => {
    if (!keyPoints) {
      return []
    }
    // Split by common delimiters and filter out empty strings
    return keyPoints.map((point) => point.trim()).filter((point) => point.length > 0)
      // .split(/[•\n\r-]/)
      
     
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Book Summary
          </CardTitle>
          <Badge variant="secondary" className="capitalize">
            {summary.file_type}
          </Badge>
        </div>
        <CardDescription className="flex items-center space-x-4 text-sm">
          <span className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            {formatDate(summary.created_at)}
          </span>
          <span className="flex items-center">
            <Hash className="mr-1 h-4 w-4" />
            {summary.word_count.toLocaleString()} words
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Summary
          </h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summary.summary}</p>
          </div>
        </div>

        <Separator />

        {/* Key Points Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Key Points</h3>
          <div className="space-y-2">
            {formatKeyPoints(summary.key_points).map((point, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
