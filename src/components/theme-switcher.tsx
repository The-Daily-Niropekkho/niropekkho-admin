"use client"

import { useTheme } from "@/components/theme-context"
import { Button } from "antd"
import { MoonIcon, SunIcon } from "lucide-react"

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Button
      type="text"
      icon={isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
      }}
    />
  )
}
