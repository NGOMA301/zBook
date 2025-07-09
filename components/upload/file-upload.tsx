"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface Summary {
  id: string
  user_id: string
  summary: string
  key_points: string
  word_count: number
  file_type: string
  created_at: string
}

interface FileUploadProps {
  onSummaryGenerated: (summary: Summary) => void
}

const baseurl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"


export function FileUpload({ onSummaryGenerated }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      setError("")
      setSuccess(false)

      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch(`${baseurl}/api/v1/summaries/`, {
          method: "POST",
          credentials: "include",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || "Upload failed")
        }

        const summary = await response.json()
        setSuccess(true)
        onSummaryGenerated(summary)

        setTimeout(() => setSuccess(false), 3000)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed")
      } finally {
        setUploading(false)
      }
    },
    [onSummaryGenerated],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="mr-2 h-5 w-5" />
          Upload Book
        </CardTitle>
        <CardDescription>Upload a book file (PDF, TXT, DOC, DOCX) to generate an AI summary</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Book uploaded and summarized successfully!</AlertDescription>
          </Alert>
        )}

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
            ${uploading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center space-y-4">
            {uploading ? (
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            ) : (
              <FileText className="h-12 w-12 text-gray-400" />
            )}

            <div>
              {uploading ? (
                <p className="text-lg font-medium text-gray-700">Processing your book...</p>
              ) : isDragActive ? (
                <p className="text-lg font-medium text-blue-600">Drop the book file here</p>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag & drop a book file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">Supports PDF, TXT, DOC, DOCX files</p>
                </div>
              )}
            </div>

            {!uploading && (
              <Button variant="outline" className="mt-4 bg-transparent">
                Choose File
              </Button>
            )}
          </div>
        </div>

        {uploading && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">This may take a few moments while we analyze your book...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
