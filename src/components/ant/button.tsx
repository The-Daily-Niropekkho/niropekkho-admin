"use client"

import { Button as AntButton } from "antd"
import type { ButtonProps as AntButtonProps } from "antd"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-context"
import type React from "react"
import { forwardRef } from "react"

export interface ButtonProps extends AntButtonProps {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "ghost" | "link" | "outline"
  rounded?: "none" | "sm" | "md" | "lg" | "full"
  animated?: boolean
  hoverScale?: number
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      rounded = "md",
      animated = true,
      hoverScale = 1.02,
      children,
      type,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    // Base styles based on variant
    const getVariantStyles = () => {
      const styles: React.CSSProperties = {}

      switch (variant) {
        case "primary":
          styles.background = "#10b981"
          styles.color = "white"
          styles.border = "none"
          styles.boxShadow = "0 4px 14px rgba(16, 185, 129, 0.25)"
          break
        case "secondary":
          styles.background = "#8b5cf6"
          styles.color = "white"
          styles.border = "none"
          styles.boxShadow = "0 4px 14px rgba(139, 92, 246, 0.25)"
          break
        case "success":
          styles.background = "#22c55e"
          styles.color = "white"
          styles.border = "none"
          styles.boxShadow = "0 4px 14px rgba(34, 197, 94, 0.25)"
          break
        case "warning":
          styles.background = "#f59e0b"
          styles.color = "white"
          styles.border = "none"
          styles.boxShadow = "0 4px 14px rgba(245, 158, 11, 0.25)"
          break
        case "danger":
          styles.background = "#ef4444"
          styles.color = "white"
          styles.border = "none"
          styles.boxShadow = "0 4px 14px rgba(239, 68, 68, 0.25)"
          break
        case "ghost":
          styles.background = "transparent"
          styles.color = isDark ? "white" : "#333"
          styles.border = "none"
          styles.boxShadow = "none"
          break
        case "link":
          styles.background = "transparent"
          styles.color = "#10b981"
          styles.border = "none"
          styles.boxShadow = "none"
          styles.padding = "4px 0"
          break
        case "outline":
          styles.background = "transparent"
          styles.color = isDark ? "white" : "#333"
          styles.border = `1px solid ${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"}`
          styles.boxShadow = "none"
          break
        default:
          break
      }

      return styles
    }

    // Radius styles based on rounded prop
    const getRadiusStyles = () => {
      switch (rounded) {
        case "none":
          return "0px"
        case "sm":
          return "4px"
        case "md":
          return "8px"
        case "lg":
          return "12px"
        case "full":
          return "9999px"
        default:
          return "8px"
      }
    }

    // Combine all styles
    const buttonStyles: React.CSSProperties = {
      height: "auto",
      minHeight: "40px",
      padding: "0.5rem 1.25rem",
      fontWeight: 500,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      borderRadius: getRadiusStyles(),
      ...getVariantStyles(),
    }

    // Handle size adjustments for "large" and "small"
    if (props.size === "large") {
      buttonStyles.minHeight = "48px"
      buttonStyles.padding = "0.75rem 1.5rem"
      buttonStyles.fontSize = "1rem"
    } else if (props.size === "small") {
      buttonStyles.minHeight = "32px"
      buttonStyles.padding = "0.25rem 0.75rem"
      buttonStyles.fontSize = "0.875rem"
    }

    // Default Ant Button type if not explicitly defined
    const buttonType = type || (variant === "primary" ? "primary" : "default")

    // Handle hover styles for variants
    const getHoverStyles = () => {
      switch (variant) {
        case "primary":
          return { background: "#0ea271" }
        case "secondary":
          return { background: "#7c4dff" }
        case "success":
          return { background: "#16a34a" }
        case "warning":
          return { background: "#d97706" }
        case "danger":
          return { background: "#dc2626" }
        case "ghost":
          return { background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)" }
        case "link":
          return { textDecoration: "underline" }
        case "outline":
          return {
            background: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
            borderColor: isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.25)",
          }
        default:
          return {}
      }
    }

    // If animated, wrap in motion.div
    if (animated) {
      return (
        <motion.div whileHover={{ scale: hoverScale }} whileTap={{ scale: 0.98 }} style={{ display: "inline-block" }}>
          <AntButton
            ref={ref}
            type={buttonType as any}
            className={className}
            style={buttonStyles}
            onClick={onClick}
            {...props}
          >
            {children}
          </AntButton>
        </motion.div>
      )
    }

    // Otherwise return regular button with hover styles
    return (
      <AntButton
        ref={ref}
        type={buttonType as any}
        className={`hover:shadow-lg ${className || ""}`}
        style={buttonStyles}
        onClick={onClick}
        {...props}
      >
        {children}
      </AntButton>
    )
  },
)

Button.displayName = "Button"
