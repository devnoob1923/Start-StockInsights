const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY

export interface NewsItem {
  title: string
  url: string
  time_published: string
  summary: string
  source: string
  relevance_score?: number
  ticker_sentiment?: {
    ticker: string
    relevance_score: number
    sentiment_score: number
  }[]
}

export async function fetchNewsForStocks(symbols: string[]): Promise<NewsItem[]> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&symbols=${symbols.join(',')}&apikey=${ALPHA_VANTAGE_API_KEY}`
    )
    const data = await response.json()
    return data.feed || []
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
} 