"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Set Up Your Portfolio</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Manual Entry Option */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Manual Entry</h2>
            <p className="text-slate-600 mb-4">
              Add your stocks manually by entering symbols and quantities
            </p>
            <Button asChild>
              <Link href="/dashboard/portfolio/manual">
                Add Stocks Manually
              </Link>
            </Button>
          </div>

          {/* Broker Integration Option */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Broker Integration</h2>
            <p className="text-slate-600 mb-4">
              Connect your brokerage account for automatic portfolio sync
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard/portfolio/integrate">
                Connect Broker
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 