import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')

  if (!symbol) {
    return NextResponse.json({ valid: false })
  }

  try {
    // You can use Alpha Vantage or another API to validate the symbol
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`
    )
    const data = await response.json()
    
    // If we get a valid price, the symbol is valid
    const valid = data['Global Quote']?.['05. price'] ? true : false
    
    return NextResponse.json({ valid })
  } catch (error) {
    return NextResponse.json({ valid: false })
  }
} 