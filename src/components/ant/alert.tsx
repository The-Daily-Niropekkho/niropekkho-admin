"use client"

import { Alert as AntAlert } from "antd"
import type { AlertProps as AntAlertProps } from "antd"
import { useTheme } from "@/components/theme-context"
import type React from "react"
import { forwardRef, useRef, useEffect, useState } from "react"
import { CheckCircleOutlined, InfoCircleOutlined, WarningOutlined, CloseCircleOutlined } from "@ant-design/icons"

export interface AlertProps extends AntAlertProps {
  variant?: "default" | "filled" | "outlined" | "soft"
  rounded?: "none" | "sm" | "md" | "lg"
  isAnimated?: boolean
  withIcon?: boolean
  withBorder?: boolean
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "default",
      rounded = "md",
      isAnimated = false,
      withIcon = true,
      withBorder = false,
      type = "info",
      message,
      description,
      icon,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const alertRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(!isAnimated)

    // Get icon based on alert type
    const getIcon = () => {
      if (icon) return icon

      switch (type) {
        case "success":
          return <CheckCircleOutlined />
        case "info":
          return <InfoCircleOutlined />
        case "warning":
          return <WarningOutlined />
        case "error":
          return <CloseCircleOutlined />
        default:
          return <InfoCircleOutlined />
      }
    }

    // Get colors based on type
    const getColorsByType = () => {
      switch (type) {
        case "success":
          return {
            bg: isDark ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.05)",
            text: isDark ? "#22c55e" : "#16a34a",
            border: "#22c55e",
            bgFilled: "#22c55e",
            textOnFilled: "white",
            bgSoft: isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.1)",
          }
        case "info":
          return {
            bg: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
            text: isDark ? "#3b82f6" : "#2563eb",
            border: "#3b82f6",
            bgFilled: "#3b82f6",
            textOnFilled: "white",
            bgSoft: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.1)",
          }
        case "warning":
          return {
            bg: isDark ? "rgba(245, 158, 11, 0.1)" : "rgba(245, 158, 11, 0.05)",
            text: isDark ? "#f59e0b" : "#d97706",
            border: "#f59e0b",
            bgFilled: "#f59e0b",
            textOnFilled: "white",
            bgSoft: isDark ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.1)",
          }
        case "error":
          return {
            bg: isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.05)",
            text: isDark ? "#ef4444" : "#dc2626",
            border: "#ef4444",
            bgFilled: "#ef4444",
            textOnFilled: "white",
            bgSoft: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
          }
        default:
          return {
            bg: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
            text: isDark ? "#3b82f6" : "#2563eb",
            border: "#3b82f6",
            bgFilled: "#3b82f6",
            textOnFilled: "white",
            bgSoft: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.1)",
          }
      }
    }

    // Get styles based on variant
    const getVariantStyles = () => {
      const colors = getColorsByType()
      const styles: React.CSSProperties = {}

      switch (variant) {
        case "default":
          styles.background = colors.bg
          styles.color = colors.text
          styles.border = withBorder ? `1px solid ${colors.border}` : "none"
          break
        case "filled":
          styles.background = colors.bgFilled
          styles.color = colors.textOnFilled
          styles.border = "none"
          break
        case "outlined":
          styles.background = "transparent"
          styles.color = colors.text
          styles.border = `1px solid ${colors.border}`
          break
        case "soft":
          styles.background = colors.bgSoft
          styles.color = colors.text
          styles.border = withBorder ? `1px solid ${colors.border}` : "none"
          styles.fontWeight = 500
          break
        default:
          break
      }

      return styles
    }

    // Get border radius based on rounded prop
    const getBorderRadius = () => {
      switch (rounded) {
        case "none":
          return "0px"
        case "sm":
          return "4px"
        case "md":
          return "8px"
        case "lg":
          return "12px"
        default:
          return "8px"
      }
    }

    // Animation CSS
    const animationCSS = isAnimated
      ? `
      @keyframes alertFadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animated-alert {
        animation: alertFadeIn 0.3s ease forwards;
      }
      
      .animated-alert.exit {
        animation: alertFadeIn 0.3s ease forwards reverse;
      }
      `
      : ""

    // Combine all styles
    const alertStyles: React.CSSProperties = {
      borderRadius: getBorderRadius(),
      padding: "12px 16px",
      ...getVariantStyles(),
      ...style,
    }

    // Handle animation
    useEffect(() => {
      if (isAnimated) {
        setIsVisible(true)
      }
    }, [isAnimated])

    return (
      <>
        {isAnimated && <style>{animationCSS}</style>}
        <div
          ref={alertRef}
          className={isAnimated ? "animated-alert" : ""}
          style={{ display: isVisible ? "block" : "none" }}
        >
          <AntAlert
            ref={ref}
            className={className}
            style={alertStyles}
            type={type}
            message={message}
            description={description}
            icon={withIcon ? getIcon() : null}
            showIcon={withIcon}
            {...props}
          />
        </div>
      </>
    )
  },
)

Alert.displayName = "Alert"
