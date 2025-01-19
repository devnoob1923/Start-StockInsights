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

    const { newsFrequency, deliveryChannel, topics, priceAlerts, alertThreshold } = await req.json()

    const preferences = await prisma.userPreferences.upsert({
      where: {
        userId: session.user.id
      },
      create: {
        userId: session.user.id,
        newsFrequency,
        deliveryChannel,
        topics,
        priceAlerts,
        alertThreshold
      },
      update: {
        newsFrequency,
        deliveryChannel,
        topics,
        priceAlerts,
        alertThreshold
      }
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Preferences error:", error)
    return NextResponse.json(
      { error: "Error saving preferences" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: {
        userId: session.user.id
      }
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Preferences error:", error)
    return NextResponse.json(
      { error: "Error fetching preferences" },
      { status: 500 }
    )
  }
} 