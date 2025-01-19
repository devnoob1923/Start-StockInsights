import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { stocks } = await req.json()

    // Create or update portfolio
    const portfolio = await prisma.portfolio.upsert({
      where: {
        userId: session.user.id
      },
      create: {
        userId: session.user.id,
        stocks: {
          create: stocks.map((stock: any) => ({
            symbol: stock.symbol,
            shares: stock.shares,
            costBasis: stock.costBasis
          }))
        }
      },
      update: {
        stocks: {
          deleteMany: {},
          create: stocks.map((stock: any) => ({
            symbol: stock.symbol,
            shares: stock.shares,
            costBasis: stock.costBasis
          }))
        }
      }
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error("Portfolio error:", error)
    return NextResponse.json(
      { error: "Error saving portfolio" },
      { status: 500 }
    )
  }
} 