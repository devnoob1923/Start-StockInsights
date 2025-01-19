"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Frequency, Channel, Topic } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"

interface Preferences {
  newsFrequency: Frequency
  deliveryChannel: Channel[]
  topics: Topic[]
  priceAlerts: boolean
  alertThreshold?: number
}

export default function PreferencesPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>({
    newsFrequency: "DAILY",
    deliveryChannel: ["EMAIL"],
    topics: [],
    priceAlerts: false,
    alertThreshold: 5
  })

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch("/api/preferences")
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setPreferences(data)
          }
        }
      } catch (error) {
        console.error("Error loading preferences:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [])

  const topicLabels: Record<Topic, string> = {
    EARNINGS: "Earnings Reports",
    DIVIDENDS: "Dividend Announcements",
    MERGERS_ACQUISITIONS: "Mergers & Acquisitions",
    MARKET_ANALYSIS: "Market Analysis",
    INDUSTRY_NEWS: "Industry News",
    TECHNICAL_ANALYSIS: "Technical Analysis",
    INSIDER_TRADING: "Insider Trading",
    SEC_FILINGS: "SEC Filings",
    PRICE_MOVEMENTS: "Price Movements",
    ANALYST_RATINGS: "Analyst Ratings"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences)
      })
      
      if (response.ok) {
        toast({
          title: "Preferences saved",
          description: "Your notification preferences have been updated.",
        })
      } else {
        throw new Error("Failed to save preferences")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading preferences...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">News & Alert Preferences</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        {/* Frequency Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Update Frequency</h2>
          <RadioGroup
            value={preferences.newsFrequency}
            onValueChange={(value: string) => 
              setPreferences({ ...preferences, newsFrequency: value as Frequency })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="REALTIME" id="realtime" />
              <Label htmlFor="realtime">Real-time updates</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="DAILY" id="daily" />
              <Label htmlFor="daily">Daily digest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="WEEKLY" id="weekly" />
              <Label htmlFor="weekly">Weekly summary</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Delivery Channels */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Delivery Channels</h2>
          <div className="space-y-2">
            {["EMAIL", "WHATSAPP"].map((channel) => (
              <div key={channel} className="flex items-center space-x-2">
                <Checkbox
                  id={channel}
                  checked={preferences.deliveryChannel.includes(channel as Channel)}
                  onCheckedChange={(checked: boolean | 'indeterminate') => {
                    if (checked === true) {
                      setPreferences({
                        ...preferences,
                        deliveryChannel: [...preferences.deliveryChannel, channel as Channel]
                      })
                    } else {
                      setPreferences({
                        ...preferences,
                        deliveryChannel: preferences.deliveryChannel.filter(
                          (c) => c !== channel
                        )
                      })
                    }
                  }}
                />
                <Label htmlFor={channel}>{channel}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Alerts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Price Alerts</h2>
            <Switch
              checked={preferences.priceAlerts}
              onCheckedChange={(checked: boolean) => 
                setPreferences({ ...preferences, priceAlerts: checked })
              }
            />
          </div>
          
          {preferences.priceAlerts && (
            <div className="flex items-center space-x-2">
              <Label htmlFor="threshold">Alert Threshold (%)</Label>
              <Input
                id="threshold"
                type="number"
                min="0.1"
                step="0.1"
                value={preferences.alertThreshold}
                onChange={(e) => setPreferences({
                  ...preferences,
                  alertThreshold: parseFloat(e.target.value)
                })}
                className="w-24"
              />
            </div>
          )}
        </div>

        {/* Topics with categories */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Topics of Interest</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(topicLabels).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={preferences.topics.includes(key as Topic)}
                  onCheckedChange={(checked: boolean) => {
                    if (checked) {
                      setPreferences({
                        ...preferences,
                        topics: [...preferences.topics, key as Topic]
                      })
                    } else {
                      setPreferences({
                        ...preferences,
                        topics: preferences.topics.filter(t => t !== key)
                      })
                    }
                  }}
                />
                <Label htmlFor={key}>{label}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit">Save Preferences</Button>
      </form>
    </div>
  )
} 