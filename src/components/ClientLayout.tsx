"use client"

import { AuthProvider } from "./providers/auth-provider"
import Header from "./Header"
import { useState, useEffect } from "react"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AuthProvider>
      <Header />
      <main>{children}</main>
    </AuthProvider>
  )
} 