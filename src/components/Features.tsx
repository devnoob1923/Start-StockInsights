import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper, Smartphone, Calendar, Target, Filter, Zap, Bell, Settings } from 'lucide-react'

const features = [
  {
    title: "Personalized News Feed",
    description: "Get news specifically curated for your stock portfolio",
    icon: Target
  },
  {
    title: "Multi-Channel Delivery",
    description: "Choose between email or WhatsApp for your updates",
    icon: Smartphone
  },
  {
    title: "Flexible Frequency",
    description: "Set your preferred delivery schedule that works for you",
    icon: Calendar
  },
  {
    title: "Smart Filtering",
    description: "AI filters out noise and delivers only relevant news",
    icon: Filter
  },
  {
    title: "Real-time Alerts",
    description: "Instant notifications for critical stock updates",
    icon: Bell
  },
  {
    title: "Market Impact Analysis",
    description: "Understand how news affects your portfolio",
    icon: Zap
  },
  {
    title: "Easy Portfolio Management",
    description: "Simple tools to manage your stock watchlist",
    icon: Settings
  },
  {
    title: "Custom News Categories",
    description: "Focus on the news types that matter to you",
    icon: Newspaper
  }
]

export default function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Smart Stock News Delivery
      </h2>
      <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
        Stay informed about your investments with our intelligent news delivery platform
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded-full flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-center text-slate-800">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-slate-600">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

