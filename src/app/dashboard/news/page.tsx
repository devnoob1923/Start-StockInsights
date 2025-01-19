"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NewsItem, fetchNewsForStocks } from "@/lib/news"
import { Stock } from "@prisma/client"

export default function NewsDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stocks, setStocks] = useState<Stock[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    } else if (status === 'authenticated') {
      loadPortfolioAndNews()
    }
  }, [status, router])

  const loadPortfolioAndNews = async () => {
    try {
      // Load portfolio
      const portfolioResponse = await fetch("/api/portfolio")
      if (portfolioResponse.ok) {
        const data = await portfolioResponse.json()
        console.log("Portfolio data:", data) // Debug log
        setStocks(data.stocks)
        
        // Fetch news for portfolio stocks
        const symbols = data.stocks.map((stock: Stock) => stock.symbol)
        console.log("Fetching news for symbols:", symbols) // Debug log
        const newsData = await fetchNewsForStocks(symbols)
        console.log("News data:", newsData) // Debug log
        setNews(newsData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Portfolio Summary */}
        <div className="md:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>
            <ScrollArea className="h-[600px]">
              {stocks.map((stock) => (
                <div 
                  key={stock.id} 
                  className="flex justify-between items-center p-3 border-b"
                >
                  <div>
                    <h3 className="font-medium">{stock.symbol}</h3>
                    <p className="text-sm text-gray-500">
                      {stock.shares} shares
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(stock.shares * stock.costBasis).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      @${stock.costBasis}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </Card>
        </div>

        {/* News Feed */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Latest News</h2>
            <ScrollArea className="h-[600px]">
              {news.map((item, index) => (
                <div 
                  key={index} 
                  className="p-4 border-b last:border-0"
                >
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    <h3 className="font-medium mb-2">{item.title}</h3>
                  </a>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.summary}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{item.source}</span>
                    <span>
                      {new Date(item.time_published).toLocaleDateString()}
                    </span>
                  </div>
                  {item.ticker_sentiment && (
                    <div className="mt-2 flex gap-2">
                      {item.ticker_sentiment.map((sentiment, idx) => (
                        <span 
                          key={idx}
                          className={`text-xs px-2 py-1 rounded ${
                            sentiment.sentiment_score > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {sentiment.ticker}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  )
} 