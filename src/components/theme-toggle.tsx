"use client"

import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Only render after mounting to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="default"
        className="font-medium rounded-2xl px-3 py-1.5 h-9 w-9 flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faSun} className="text-sm" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="default"
      className="font-medium rounded-2xl px-3 py-1.5 h-9 w-9 flex items-center justify-center"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <FontAwesomeIcon icon={faMoon} className="text-sm" />
      ) : (
        <FontAwesomeIcon icon={faSun} className="text-sm" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
