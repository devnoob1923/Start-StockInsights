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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <LineChart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">StockInsights</span>
            </Link>
          </div>

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
            
            {status === 'loading' ? (
              <div className="h-9 w-20 bg-slate-100 animate-pulse rounded-md" />
            ) : session ? (
              <>
                <Button asChild variant="default">
                  <Link href="/dashboard" className="flex items-center space-x-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {session.user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/preferences">Preferences</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
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
      </div>
    </header>
  )
} 