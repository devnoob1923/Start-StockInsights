"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, X, RefreshCw, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NewsItem, fetchNewsForStocks } from "@/lib/news"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { searchStock, getStockNews, type StockInfo } from '@/lib/alpha-vantage'

interface Stock {
  id: string
  symbol: string
  name?: string
  shares: number
  costBasis: number
  source: 'manual' | 'integrated'
}

export default function PortfolioDashboard() {
  const { toast } = useToast()
  const [stocks, setStocks] = useState<Stock[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [totalValue, setTotalValue] = useState(0)
  const [addingStock, setAddingStock] = useState(false)
  const [newStock, setNewStock] = useState({ symbol: '', shares: '', costBasis: '' })
  const { data: session, status } = useSession()
  const router = useRouter()
  const [newsLoading, setNewsLoading] = useState(false)
  const [symbolError, setSymbolError] = useState("")
  const [mounted, setMounted] = useState(false)
  const [searchResults, setSearchResults] = useState<StockInfo[]>([])
  const [selectedStock, setSelectedStock] = useState<StockInfo | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    } else if (status === 'authenticated') {
      loadPortfolioAndNews()
    }
  }, [status, router])

  const loadPortfolioAndNews = async () => {
    try {
      const response = await fetch("/api/portfolio")
      if (response.ok) {
        const data = await response.json()
        setStocks(data.stocks)
        setTotalValue(data.totalValue)
        
        // Fetch news for portfolio stocks
        const symbols = data.stocks.map((stock: Stock) => stock.symbol)
        const newsData = await fetchNewsForStocks(symbols)
        setNews(newsData)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load portfolio",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const validateSymbol = async (symbol: string) => {
    try {
      const response = await fetch(`/api/stocks/validate?symbol=${symbol}`)
      const data = await response.json()
      return data.valid
    } catch (error) {
      return false
    }
  }

  const refreshNews = async () => {
    setNewsLoading(true)
    try {
      const symbols = stocks.map(stock => stock.symbol)
      const newsData = await fetchNewsForStocks(symbols)
      setNews(newsData)
      toast({
        title: "News Updated",
        description: "Latest news has been loaded."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh news",
        variant: "destructive"
      })
    } finally {
      setNewsLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (query.length < 2) return;
    const results = await searchStock(query);
    setSearchResults(results);
  };

  const handleAddStock = async (stock: StockInfo) => {
    setAddingStock(true);
    
    try {
      const response = await fetch("/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: stock.symbol,
          name: stock.name,
          type: stock.type,
          region: stock.region,
          currency: stock.currency
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add stock");
      }

      const newStock = await response.json();
      setStocks([...stocks, newStock]);
      toast({
        title: "Success",
        description: `${stock.name} (${stock.symbol}) has been added to your portfolio.`
      });
      loadPortfolioAndNews();
    } catch (error) {
      console.error("Error adding stock:", error);
      toast({
        title: "Error",
        description: "Failed to add stock. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAddingStock(false);
      setSearchResults([]);
    }
  };

  const handleDeleteStock = async (stockId: string) => {
    try {
      const response = await fetch(`/api/stocks?id=${stockId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete stock')

      setStocks(stocks.filter(stock => stock.id !== stockId))
      toast({
        title: "Stock removed",
        description: "Stock has been removed from your portfolio."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove stock. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (!mounted) {
    return null
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Portfolio */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Your Portfolio</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stock
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Stock to Portfolio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Search Stock</label>
                    <Input
                      placeholder="Search by symbol or name"
                      onChange={(e) => handleSearch(e.target.value)}
                      className="mt-2"
                    />
                    {searchResults.length > 0 && (
                      <div className="mt-2 border rounded-md max-h-60 overflow-y-auto">
                        {searchResults.map((stock) => (
                          <div
                            key={stock.symbol}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                            onClick={() => handleAddStock(stock)}
                          >
                            <div className="font-medium">{stock.name}</div>
                            <div className="text-sm text-gray-500">
                              {stock.symbol} • {stock.region} • {stock.currency}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Number of Stocks</h3>
              <p className="text-2xl font-bold">{stocks.length}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Portfolio Sources</h3>
              <p className="text-2xl font-bold">
                {new Set(stocks.map(s => s.source)).size}
              </p>
            </Card>
          </div>

          {/* Stocks Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Shares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cost Basis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Current Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stocks.map((stock) => (
                    <tr key={stock.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium">{stock.name || stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.symbol}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {stock.shares}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${stock.costBasis}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${(stock.shares * stock.costBasis).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Stock</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {stock.name || stock.symbol} from your portfolio?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteStock(stock.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column - News Feed */}
        <div>
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Latest News</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshNews}
                disabled={newsLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${newsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <ScrollArea className="h-[800px]">
              {newsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No news available for your portfolio stocks
                </div>
              ) : (
                news.map((item, index) => (
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
                ))
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  )
}