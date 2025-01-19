"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

type Preferences = {
  newsFrequency: "REALTIME" | "DAILY" | "WEEKLY" | "MONTHLY"
  deliveryChannel: Array<"EMAIL" | "WHATSAPP">
  topics: string[]
  priceAlerts: boolean
  alertThreshold?: number
}

interface PreferencesFormProps {
  onSubmit: (preferences: Preferences) => void
  submitText?: string
}

export function PreferencesForm({ onSubmit, submitText = "Save Preferences" }: PreferencesFormProps) {
  const [preferences, setPreferences] = useState<Preferences>({
    newsFrequency: "DAILY",
    deliveryChannel: ["EMAIL"],
    topics: [],
    priceAlerts: false,
    alertThreshold: 5
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(preferences)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Reuse the same form fields from your preferences page */}
      {/* Copy the form fields JSX from dashboard/preferences/page.tsx */}
      <Button type="submit">{submitText}</Button>
    </form>
  )
} 