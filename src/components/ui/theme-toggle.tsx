"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 relative overflow-hidden"
    >
      <div className="flex transition-transform duration-300 ease-in-out dark:translate-x-full">
        <Sun className="w-4 h-4 shrink-0" />
        <Moon className="w-4 h-4 shrink-0" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 