"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

interface Stock {
  id: string
  symbol: string
  shares: number
  costBasis: number
}

export default function ManualPortfolioPage() {
  const { toast } = useToast()
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [currentStock, setCurrentStock] = useState({
    symbol: "",
    shares: "",
    costBasis: ""
  })
  const [addingStock, setAddingStock] = useState(false)
  const [removingStockId, setRemovingStockId] = useState<string | null>(null)
  const [stockToDelete, setStockToDelete] = useState<Stock | null>(null)

  // Load existing stocks
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const response = await fetch("/api/stocks")
        if (response.ok) {
          const data = await response.json()
          setStocks(data)
        }
      } catch (error) {
        console.error("Error loading stocks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStocks()
  }, [])

  const validateSymbol = async (symbol: string) => {
    try {
      const response = await fetch(`/api/stocks/validate?symbol=${symbol}`)
      const data = await response.json()
      return data.valid
    } catch (error) {
      return false
    }
  }

  const addStock = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingStock(true)
    
    try {
      const isValid = await validateSymbol(currentStock.symbol)
      if (!isValid) {
        toast({
          title: "Invalid Symbol",
          description: "Please enter a valid stock symbol.",
          variant: "destructive"
        })
        return
      }

      const response = await fetch("/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: currentStock.symbol,
          shares: parseFloat(currentStock.shares),
          costBasis: parseFloat(currentStock.costBasis)
        })
      })

      if (response.ok) {
        const newStock = await response.json()
        setStocks([...stocks, newStock])
        setCurrentStock({ symbol: "", shares: "", costBasis: "" })
        toast({
          title: "Stock added",
          description: `${currentStock.symbol} has been added to your portfolio.`
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add stock. Please try again.",
        variant: "destructive"
      })
    } finally {
      setAddingStock(false)
    }
  }

  const removeStock = async (stock: Stock) => {
    setRemovingStockId(stock.id)
    
    try {
      const response = await fetch(`/api/stocks?id=${stock.id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setStocks(stocks.filter(s => s.id !== stock.id))
        toast({
          title: "Stock removed",
          description: "Stock has been removed from your portfolio."
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove stock. Please try again.",
        variant: "destructive"
      })
    } finally {
      setRemovingStockId(null)
      setStockToDelete(null)
    }
  }

  if (loading) {
    return <div>Loading your portfolio...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Your Portfolio</h1>

      <form onSubmit={addStock} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Stock Symbol (e.g., AAPL)"
            value={currentStock.symbol}
            onChange={(e) => setCurrentStock({
              ...currentStock,
              symbol: e.target.value.toUpperCase()
            })}
            required
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Number of Shares"
            value={currentStock.shares}
            onChange={(e) => setCurrentStock({
              ...currentStock,
              shares: e.target.value
            })}
            required
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Cost Basis per Share"
            value={currentStock.costBasis}
            onChange={(e) => setCurrentStock({
              ...currentStock,
              costBasis: e.target.value
            })}
            required
          />
        </div>
        <Button 
          type="submit" 
          disabled={addingStock}
        >
          {addingStock ? "Adding..." : "Add Stock"}
        </Button>
      </form>

      {stocks.length > 0 ? (
        <div className="space-y-4">
          {stocks.map((stock) => (
            <div key={stock.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
              <div>
                <h3 className="font-semibold">{stock.symbol}</h3>
                <p className="text-sm text-gray-600">
                  {stock.shares} shares @ ${stock.costBasis}
                </p>
              </div>
              <AlertDialog open={!!stockToDelete} onOpenChange={() => setStockToDelete(null)}>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={removingStockId === stock.id}
                  onClick={() => setStockToDelete(stock)}
                >
                  {removingStockId === stock.id ? "Removing..." : "Remove"}
                </Button>
                
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Stock</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {stockToDelete?.symbol} from your portfolio?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => stockToDelete && removeStock(stockToDelete)}
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No stocks in your portfolio yet. Add some above!
        </p>
      )}
    </div>
  )
} 