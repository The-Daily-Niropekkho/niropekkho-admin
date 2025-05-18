"use client"

import { Divider as AntDivider } from "antd"
import type { DividerProps as AntDividerProps } from "antd"
import { useTheme } from "@/components/theme-context"
import type React from "react"
import { forwardRef } from "react"

export interface DividerProps extends AntDividerProps {
  variant?: "default" | "light" | "dark" | "colored" | "dashed" | "dotted" | "gradient"
  thickness?: "thin" | "medium" | "thick"
  spacing?: "tight" | "normal" | "loose"
  gradientColors?: [string, string]
  rounded?: boolean
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      variant = "default",
      thickness = "medium",
      spacing = "normal",
      gradientColors = ["#10b981", "#8b5cf6"],
      rounded = false,
      style,
      className,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    // Get thickness value in pixels
    const getThicknessValue = () => {
      switch (thickness) {
        case "thin":
          return "1px"
        case "medium":
          return "2px"
        case "thick":
          return "4px"
        default:
          return "1px"
      }
    }

    // Get spacing value in pixels
    const getSpacingValue = () => {
      switch (spacing) {
        case "tight":
          return "12px"
        case "normal":
          return "24px"
        case "loose":
          return "36px"
        default:
          return "24px"
      }
    }

    // Get styles based on variant
    const getVariantStyles = () => {
      const styles: React.CSSProperties = {}

      // Set thickness
      styles.height = getThicknessValue()

      // Set vertical spacing
      styles.margin = `${getSpacingValue()} 0`

      // Set border radius if rounded
      if (rounded) {
        styles.borderRadius = getThicknessValue()
      }

      switch (variant) {
        case "default":
          styles.backgroundColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
          styles.border = "none"
          break
        case "light":
          styles.backgroundColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
          styles.border = "none"
          break
        case "dark":
          styles.backgroundColor = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
          styles.border = "none"
          break
        case "colored":
          styles.backgroundColor = gradientColors[0]
          styles.border = "none"
          break
        case "dashed":
          styles.backgroundColor = "transparent"
          styles.borderTop = `${getThicknessValue()} dashed ${
            isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"
          }`
          break
        case "dotted":
          styles.backgroundColor = "transparent"
          styles.borderTop = `${getThicknessValue()} dotted ${
            isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"
          }`
          break
        case "gradient":
          styles.border = "none"
          styles.background = `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`
          break
        default:
          break
      }

      return styles
    }

    // Combine all styles
    const dividerStyles: React.CSSProperties = {
      ...getVariantStyles(),
      ...style,
    }

    return <AntDivider ref={ref} className={className} style={dividerStyles} {...props} />
  },
)

Divider.displayName = "Divider"
