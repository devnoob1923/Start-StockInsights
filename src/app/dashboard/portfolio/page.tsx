"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, X, RefreshCw, Trash2, Link2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { searchStock, getStockNews, type StockInfo, type NewsItem } from '@/lib/alpha-vantage'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface PortfolioStock {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
}

export default function PortfolioPage() {
  const { toast } = useToast()
  const [stocks, setStocks] = useState<PortfolioStock[]>([])
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
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<StockInfo[]>([])
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>('all')
  const [allNews, setAllNews] = useState<NewsItem[]>([])
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all')

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
        
        // Fetch news for all stocks
        if (data.stocks.length > 0) {
          const newsPromises = data.stocks.map((stock: PortfolioStock) => getStockNews(stock.symbol));
          const newsResults = await Promise.all(newsPromises);
          const combinedNews = newsResults.flat().sort((a, b) => {
            const stockCompare = a.ticker_sentiment?.[0]?.ticker.localeCompare(b.ticker_sentiment?.[0]?.ticker || '') || 0;
            return stockCompare || new Date(b.time_published).getTime() - new Date(a.time_published).getTime();
          });
          setAllNews(combinedNews);
          setNews(combinedNews);
        }
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

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length >= 2) {
      const results = await searchStock(query)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const addStock = (stock: StockInfo) => {
    setStocks(prevStocks => {
      if (prevStocks.some(s => s.symbol === stock.symbol)) {
        return prevStocks
      }
      return [...prevStocks, {
        symbol: stock.symbol,
        name: stock.name,
        type: stock.type,
        region: stock.region,
        currency: stock.currency
      }]
    })
    setSearchQuery('')
    setSearchResults([])
  }

  const removeStock = (symbol: string) => {
    setStocks(prevStocks => prevStocks.filter(stock => stock.symbol !== symbol))
  }

  const refreshNews = async () => {
    setNewsLoading(true)
    try {
      if (stocks.length > 0) {
        const newsPromises = stocks.map((stock: PortfolioStock) => getStockNews(stock.symbol));
        const newsResults = await Promise.all(newsPromises);
        const combinedNews = newsResults.flat().sort((a, b) => {
          const stockCompare = a.ticker_sentiment?.[0]?.ticker.localeCompare(b.ticker_sentiment?.[0]?.ticker || '') || 0;
          return stockCompare || new Date(b.time_published).getTime() - new Date(a.time_published).getTime();
        });
        setAllNews(combinedNews);
        filterNews(selectedStockFilter, combinedNews);
        toast({
          title: "News Updated",
          description: "Latest news has been loaded."
        })
      }
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

  const filterNews = (symbol: string, newsData = allNews) => {
    setSelectedStockFilter(symbol);
    if (symbol === 'all') {
      setNews(newsData);
    } else {
      setNews(newsData.filter(item => 
        item.ticker_sentiment?.some(sentiment => sentiment.ticker === symbol)
      ));
    }
  }

  const filterStocksByRegion = (region: string) => {
    setSelectedRegionFilter(region);
    
    // Filter news based on the selected region
    const filteredStocks = stocks.filter(stock => 
      region === 'all' || stock.region === region
    );
    const stockSymbols = filteredStocks.map(stock => stock.symbol);
    
    // Filter news to only show news for stocks in the selected region
    const filteredNews = allNews.filter(item =>
      item.ticker_sentiment?.some(sentiment => 
        stockSymbols.includes(sentiment.ticker)
      )
    );
    
    setNews(filteredNews);
    setSelectedStockFilter('all'); // Reset stock filter when region changes
  }

  if (!mounted) {
    return null
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Portfolio */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">My Portfolio</h1>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Link2 className="w-4 h-4 mr-2" />
                    Connect Broker
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-[200px] bg-white border rounded-md shadow-md"
                >
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                    Robinhood
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                    E*TRADE
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                    TD Ameritrade
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                    Charles Schwab
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                    Fidelity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
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
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="mt-2"
                      />
                      {searchResults.length > 0 && (
                        <div className="mt-2 border rounded-md max-h-60 overflow-y-auto">
                          {searchResults.map((stock) => (
                            <div
                              key={stock.symbol}
                              className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                              onClick={() => addStock(stock)}
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
          </div>

          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Number of Stocks</h3>
              <p className="text-2xl font-bold">{stocks.length}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Portfolio Sources</h3>
              <p className="text-2xl font-bold">
                {new Set(stocks.map(s => s.symbol)).size}
              </p>
            </Card>
          </div>

          {/* Add this before the Stocks Table */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedRegionFilter === 'all' ? "default" : "outline"}
              onClick={() => filterStocksByRegion('all')}
            >
              All Regions
            </Button>
            {Array.from(new Set(stocks.map(s => s.region))).map(region => (
              <Button
                key={region}
                variant={selectedRegionFilter === region ? "default" : "outline"}
                onClick={() => filterStocksByRegion(region)}
              >
                {region}
              </Button>
            ))}
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
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Currency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stocks
                    .filter(stock => selectedRegionFilter === 'all' || stock.region === selectedRegionFilter)
                    .map((stock) => (
                      <tr key={stock.symbol}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-sm text-gray-500">{stock.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {stock.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {stock.currency}
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
                                  Are you sure you want to remove {stock.name} from your portfolio?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeStock(stock.symbol)}
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
              <div className="flex gap-2">
                <select
                  className="border rounded-md px-2 py-1 bg-white hover:bg-gray-50 cursor-pointer"
                  value={selectedStockFilter}
                  onChange={(e) => filterNews(e.target.value)}
                >
                  <option value="all">All Stocks</option>
                  {stocks.map((stock) => (
                    <option key={stock.symbol} value={stock.symbol}>
                      {stock.symbol}
                    </option>
                  ))}
                </select>
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