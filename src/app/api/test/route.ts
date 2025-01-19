import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    return NextResponse.json({ status: 'Connected', userCount })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }
} 