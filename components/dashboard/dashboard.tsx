"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { FileUpload } from "@/components/upload/file-upload"
import { SummaryDisplay } from "@/components/summary/summary-display"
import { SummaryHistory } from "@/components/summary/summary-history"

interface Summary {
  id: string
  user_id: string
  summary: string
  key_points: string
  word_count: number
  file_type: string
  created_at: string
}

export function Dashboard() {
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSummaryGenerated = (summary: Summary) => {
    setCurrentSummary(summary)
    setRefreshTrigger((prev) => prev + 1) // Trigger history refresh
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Summarizer</h1>
            <p className="text-gray-600">Upload any book and get an AI-powered summary with key insights extracted.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Upload and current summary */}
            <div className="lg:col-span-2 space-y-8">
              <FileUpload onSummaryGenerated={handleSummaryGenerated} />

              {currentSummary && <SummaryDisplay summary={currentSummary} />}
            </div>

            {/* Right column - History */}
            <div className="lg:col-span-1">
              <SummaryHistory refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
