"use client"

import { useRouter } from "next/navigation"
import { PreferencesForm } from "@/components/PreferencesForm"

export default function SignupPreferencesPage() {
  const router = useRouter()

  const handleSubmit = async (preferences: any) => {
    try {
      await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences)
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving preferences:", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">
          Set Your Preferences
        </h1>
        <p className="text-slate-600 text-center mb-8">
          Customize your news and alerts to get the most relevant information.
        </p>
        
        <PreferencesForm 
          onSubmit={handleSubmit}
          submitText="Complete Setup"
        />
      </div>
    </div>
  )
} 