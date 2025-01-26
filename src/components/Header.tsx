'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { LineChart, LayoutDashboard } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { UserButton } from "./ui/user-button"
import { ThemeToggle } from "./ui/theme-toggle"

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Portfolio', href: '/dashboard/portfolio' },
  { name: 'News', href: '/dashboard/news' },
  { name: 'Preferences', href: '/dashboard/preferences' }
]

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <LineChart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">StockInsights</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#pricing" className="text-sm text-slate-600 hover:text-slate-800">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm text-slate-600 hover:text-slate-800">
            Blog
          </Link>
          <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-800">
            Contact us
          </Link>
          
          {session ? (
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
} 