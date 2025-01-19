  export interface StockSearchResult {
    symbol: string
    name: string
    type: string
    region: string
    marketOpen: string
    marketClose: string
    timezone: string
    currency: string
    matchScore: string
  }

  export async function searchStocks(query: string): Promise<StockSearchResult[]> {
    if (!query) return []

    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=7R6N2LMQPEFQ6785`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'request'
        }
      })

      if (!response.ok) {
        console.log('Status:', response.status)
        return []
      }

      const data = await response.json()
      console.log('API Response:', data)

      if (!data.bestMatches) return []

      return data.bestMatches.map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency'],
        matchScore: match['9. matchScore']
      }))

    } catch (err) {
      console.log('Error:', err)
      return []
    }
  } 