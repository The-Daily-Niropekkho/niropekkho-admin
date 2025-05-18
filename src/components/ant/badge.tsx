"use client"

import { Badge as AntBadge } from "antd"
import type { BadgeProps as AntBadgeProps } from "antd"
import { useTheme } from "@/components/theme-context"
import type React from "react"
import { forwardRef } from "react"

export interface BadgeProps extends AntBadgeProps {
  variant?: "default" | "filled" | "outlined" | "dot" | "pill"
  colorScheme?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral"
  withAnimation?: boolean
  withPulse?: boolean
  withGlow?: boolean
  withBorder?: boolean
  size?: "small" | "medium" | "large"
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      colorScheme = "primary",
      withAnimation = false,
      withPulse = false,
      withGlow = false,
      withBorder = false,
      size = "medium",
      children,
      style,
      className,
      count,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    // Get colors based on color scheme
    const getColorsByScheme = () => {
      switch (colorScheme) {
        case "primary":
          return {
            bg: "#10b981",
            text: "white",
            border: "#10b981",
            glow: "rgba(16, 185, 129, 0.4)",
          }
        case "secondary":
          return {
            bg: "#8b5cf6",
            text: "white",
            border: "#8b5cf6",
            glow: "rgba(139, 92, 246, 0.4)",
          }
        case "success":
          return {
            bg: "#22c55e",
            text: "white",
            border: "#22c55e",
            glow: "rgba(34, 197, 94, 0.4)",
          }
        case "warning":
          return {
            bg: "#f59e0b",
            text: "white",
            border: "#f59e0b",
            glow: "rgba(245, 158, 11, 0.4)",
          }
        case "danger":
          return {
            bg: "#ef4444",
            text: "white",
            border: "#ef4444",
            glow: "rgba(239, 68, 68, 0.4)",
          }
        case "info":
          return {
            bg: "#3b82f6",
            text: "white",
            border: "#3b82f6",
            glow: "rgba(59, 130, 246, 0.4)",
          }
        case "neutral":
          return {
            bg: isDark ? "#4b5563" : "#9ca3af",
            text: "white",
            border: isDark ? "#4b5563" : "#9ca3af",
            glow: "rgba(75, 85, 99, 0.4)",
          }
        default:
          return {
            bg: "#10b981",
            text: "white",
            border: "#10b981",
            glow: "rgba(16, 185, 129, 0.4)",
          }
      }
    }

    // Get dot size based on size prop
    const getDotSize = () => {
      switch (size) {
        case "small":
          return "6px"
        case "medium":
          return "8px"
        case "large":
          return "10px"
        default:
          return "8px"
      }
    }

    // Get styles based on variant
    const getVariantStyles = () => {
      const colors = getColorsByScheme()
      const styles: React.CSSProperties = {}

      // Base styles for badge
      styles.color = colors.text

      switch (variant) {
        case "default":
          styles.background = colors.bg
          break
        case "filled":
          styles.background = colors.bg
          styles.fontWeight = 500
          break
        case "outlined":
          styles.background = "transparent"
          styles.color = colors.bg
          styles.border = `1px solid ${colors.border}`
          break
        case "dot":
          styles.background = colors.bg
          styles.minWidth = getDotSize()
          styles.height = getDotSize()
          styles.padding = 0
          break
        case "pill":
          styles.background = colors.bg
          styles.borderRadius = "9999px"
          styles.padding = size === "small" ? "0 6px" : size === "medium" ? "0 8px" : "0 10px"
          styles.fontWeight = 500
          break
        default:
          break
      }

      // Add glow effect
      if (withGlow) {
        styles.boxShadow = `0 0 10px ${colors.glow}`
      }

      // Add border
      if (withBorder && variant !== "outlined") {
        styles.border = `1px solid ${isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.65)"}`
      }

      return styles
    }

    // Combine all styles
    const badgeStyles: React.CSSProperties = {
      ...getVariantStyles(),
      ...style,
    }

    // Animation CSS
    const animationCSS = `
      @keyframes badgeFadeIn {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes badgePulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.2);
          opacity: 0.7;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      .badge-animated {
        animation: badgeFadeIn 0.3s ease forwards;
      }
      
      .badge-pulse .ant-badge-count, 
      .badge-pulse .ant-badge-dot {
        animation: badgePulse 1.5s infinite ease-in-out;
      }
    `

    // Get badge classes
    const badgeClasses = [className || "", withAnimation ? "badge-animated" : "", withPulse ? "badge-pulse" : ""]
      .filter(Boolean)
      .join(" ")

    return (
      <>
        {(withAnimation || withPulse) && <style>{animationCSS}</style>}
        <AntBadge
          ref={ref}
          className={badgeClasses}
          style={badgeStyles}
          size={size === "small" ? "small" : "default"}
          count={count}
          dot={variant === "dot"}
          {...props}
        >
          {children}
        </AntBadge>
      </>
    )
  },
)

Badge.displayName = "Badge"
