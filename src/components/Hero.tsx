'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Bell, Mail, Newspaper } from 'lucide-react'
import { useState } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Hero() {
  const { data: session } = useSession()
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  const handleFreeTrial = () => {
    if (session) {
      router.push('/dashboard/portfolio')
    } else {
      router.push('/signup')
    }
  }

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block mb-4 px-4 py-1 bg-slate-100 rounded-full">
          <span className="text-sm text-slate-600">AI-Powered Stock News Delivery</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Your Personalized Stock News,
          <br />
          Delivered Your Way
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Get curated news and updates about your stock portfolio, delivered straight to your inbox or WhatsApp. Never miss important updates about your investments.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button 
            size="lg" 
            className="bg-black hover:bg-slate-800 text-white"
            onClick={handleFreeTrial}
          >
            Start Free Trial
          </Button>
          <Button variant="outline" size="lg" className="border-slate-200">
            View Sample Digest
          </Button>
        </div>
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform rotate-1 rounded-2xl blur-xl"></div>
          <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">Daily Email Digest</h3>
                </div>
                <div className="relative w-full h-[200px]">
                  <Image 
                    src="/newimage.jpg"
                    alt="Email Digest Preview"
                    fill
                    className="rounded-lg shadow-md object-cover bg-slate-100"
                    priority
                    onError={(e) => {
                      console.error("Failed to load image at:", e.currentTarget.src);
                      setImageError(true);
                    }}
                  />
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">WhatsApp Updates</h3>
                </div>
                <img 
                  src="/placeholder.svg?height=200&width=300"
                  alt="WhatsApp Updates Preview"
                  className="rounded-lg shadow-md w-full"
                  width={300}
                  height={200}
                />
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-slate-200">
                <Newspaper className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-600">Real-time news updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

