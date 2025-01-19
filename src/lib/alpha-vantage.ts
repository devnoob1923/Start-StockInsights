const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

export interface StockInfo {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
}

export interface NewsItem {
  title: string;
  url: string;
  time_published: string;
  summary: string;
  source: string;
  ticker_sentiment?: {
    ticker: string;
    sentiment_score: number;
  }[];
}

export async function searchStock(query: string): Promise<StockInfo[]> {
  if (!query || !API_KEY) return [];

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      console.error('Alpha Vantage API error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    
    if (!data.bestMatches || !Array.isArray(data.bestMatches)) {
      console.warn('Unexpected API response format:', data);
      return [];
    }
    
    return data.bestMatches.map((match: any) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      currency: match['8. currency']
    }));
  } catch (error) {
    console.error('Stock search error:', error);
    return [];
  }
}

export async function getStockNews(symbol: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    return data.feed || [];
  } catch (error) {
    console.error('News fetch error:', error);
    return [];
  }
} 