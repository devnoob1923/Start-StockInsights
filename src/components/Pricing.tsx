import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Basic",
    price: "$9.99",
    description: "Perfect for casual investors",
    features: [
      "Daily news digest via email",
      "Up to 5 stocks in portfolio",
      "End-of-day summary",
      "Basic news filtering"
    ]
  },
  {
    name: "Pro",
    price: "$19.99",
    description: "For active investors",
    features: [
      "Real-time news alerts",
      "Email and WhatsApp delivery",
      "Up to 20 stocks",
      "Advanced news filtering",
      "Market impact analysis"
    ]
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For investment teams",
    features: [
      "Custom delivery frequency",
      "Multi-user accounts",
      "Unlimited stocks",
      "API access",
      "Custom news sources",
      "Dedicated support"
    ]
  }
]

export default function Pricing() {
  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
        Choose Your News Plan
      </h2>
      <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
        Select the perfect plan for your investment news needs
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card key={index} className="flex flex-col border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-t-lg">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-slate-200">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-6">
              <p className="text-3xl font-bold mb-4 text-slate-800">{plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-slate-600">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button size="sm" asChild className="w-full bg-black hover:bg-slate-800 text-white">
                <Link href={`/signup?plan=${plan.name.toLowerCase()}`}>Select {plan.name}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

