import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { symbol, shares, costBasis } = body

  try {
    const stock = await prisma.stock.create({
      data: {
        symbol: symbol.toUpperCase(),
        shares: parseInt(shares),
        costBasis: parseFloat(costBasis),
        userId: session.user.id
      }
    })

    return NextResponse.json(stock)
  } catch (error) {
    console.error('Error creating stock:', error)
    return NextResponse.json({ error: 'Failed to create stock' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const stockId = searchParams.get('id')

    if (!stockId) {
      return NextResponse.json({ error: "Stock ID required" }, { status: 400 })
    }

    await prisma.stock.delete({
      where: { id: stockId }
    })

    return NextResponse.json({ message: "Stock removed" })
  } catch (error) {
    return NextResponse.json({ error: "Error removing stock" }, { status: 500 })
  }
} 