"use client"

import { Card as AntCard } from "antd"
import type { CardProps as AntCardProps } from "antd"
import { useTheme } from "@/components/theme-context"
import type React from "react"
import { forwardRef, useState, useEffect } from "react"

export interface CardProps extends AntCardProps {
  variant?: "default" | "elevated" | "outlined" | "filled" | "gradient"
  isHoverable?: boolean
  isAnimated?: boolean
  gradientDirection?: "to-right" | "to-bottom" | "to-bottom-right" | "to-top-right"
  gradientFrom?: string
  gradientTo?: string
  isInteractive?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      isHoverable = false,
      isAnimated = false,
      gradientDirection = "to-right",
      gradientFrom = "#10b981",
      gradientTo = "#8b5cf6",
      isInteractive = false,
      children,
      style,
      className,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const [isVisible, setIsVisible] = useState(!isAnimated)

    // Base styles based on variant
    const getVariantStyles = () => {
      const styles: React.CSSProperties = {
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }

      switch (variant) {
        case "default":
          styles.background = isDark ? "#1f2937" : "#ffffff"
          styles.border = isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.05)"
          styles.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"
          break
        case "elevated":
          styles.background = isDark ? "#1f2937" : "#ffffff"
          styles.border = isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.05)"
          styles.boxShadow = isDark
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
          break
        case "outlined":
          styles.background = "transparent"
          styles.border = isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(0, 0, 0, 0.15)"
          break
        case "filled":
          styles.background = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"
          styles.border = "none"
          break
        case "gradient":
          let gradientStyle: string

          switch (gradientDirection) {
            case "to-right":
              gradientStyle = `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
              break
            case "to-bottom":
              gradientStyle = `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`
              break
            case "to-bottom-right":
              gradientStyle = `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`
              break
            case "to-top-right":
              gradientStyle = `linear-gradient(to top right, ${gradientFrom}, ${gradientTo})`
              break
            default:
              gradientStyle = `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`
          }

          styles.background = gradientStyle
          styles.border = "none"
          styles.color = "white"
          break
        default:
          break
      }

      if (isHoverable) {
        styles.cursor = "pointer"
      }

      return styles
    }

    // Combine all styles
    const cardStyles: React.CSSProperties = {
      ...getVariantStyles(),
      ...style,
    }

    // Animation CSS
    const animationCSS = isAnimated
      ? `
      @keyframes cardFadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animated-card {
        animation: cardFadeIn 0.3s ease forwards;
      }
      
      .interactive-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .interactive-card:hover {
        transform: translateY(-5px);
        box-shadow: ${
          isDark
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
            : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.05)"
        };
      }
      `
      : ""

    // Handle animation
    useEffect(() => {
      if (isAnimated) {
        setIsVisible(true)
      }
    }, [isAnimated])

    const cardClasses = [className || "", isAnimated ? "animated-card" : "", isInteractive ? "interactive-card" : ""]
      .filter(Boolean)
      .join(" ")

    return (
      <>
        {(isAnimated || isInteractive) && <style>{animationCSS}</style>}
        <div style={{ display: isVisible ? "block" : "none" }}>
          <AntCard
            ref={ref}
            className={cardClasses}
            style={cardStyles}
            hoverable={isHoverable}
            bordered={false}
            {...props}
          >
            {children}
          </AntCard>
        </div>
      </>
    )
  },
)

Card.displayName = "Card"
