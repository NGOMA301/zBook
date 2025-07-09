"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { BookOpen } from "lucide-react"

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex-col justify-center items-center text-white">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center mb-8">
            <BookOpen className="h-16 w-16 mr-4" />
            <h1 className="text-5xl font-bold">zBook</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Transform Books into Insights</h2>
          <p className="text-lg opacity-90">
            Upload any book and get intelligent summaries with key points extracted. Save time and absorb knowledge
            faster than ever before.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>AI-powered summarization</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>Support for PDF, TXT, and more</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>Organized summary history</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-12 w-12 mr-2 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">zBook</h1>
            </div>
          </div>

          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  )
}
