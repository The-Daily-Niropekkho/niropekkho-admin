"use client"

import { Dropdown as AntDropdown } from "antd"
import type { DropdownProps as AntDropdownProps } from "antd"
import { useTheme } from "@/components/theme-context"
import React, { forwardRef } from "react"

export interface DropdownProps extends AntDropdownProps {
  variant?: "default" | "bordered" | "elevated" | "filled" | "minimal"
  rounded?: "none" | "sm" | "md" | "lg"
  withShadow?: boolean
  withAnimation?: "fade" | "slide" | "scale" | "none"
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      variant = "default",
      rounded = "md",
      withShadow = true,
      withAnimation = "fade",
      children,
      style,
      className,
      overlayClassName,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"

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

    // Get styles based on variant
    const getVariantStyles = () => {
      const styles: React.CSSProperties = {}

      switch (variant) {
        case "default":
          styles.background = isDark ? "#1f2937" : "#ffffff"
          styles.border = isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.05)"
          break
        case "bordered":
          styles.background = isDark ? "#1f2937" : "#ffffff"
          styles.border = isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(0, 0, 0, 0.15)"
          break
        case "elevated":
          styles.background = isDark ? "#1f2937" : "#ffffff"
          styles.border = "none"
          styles.boxShadow = isDark
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"
          break
        case "filled":
          styles.background = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)"
          styles.border = "none"
          break
        case "minimal":
          styles.background = isDark ? "#1f2937" : "#ffffff"
          styles.border = "none"
          break
        default:
          break
      }

      if (withShadow && variant !== "elevated") {
        styles.boxShadow = isDark ? "0 4px 12px rgba(0, 0, 0, 0.2)" : "0 4px 12px rgba(0, 0, 0, 0.08)"
      }

      styles.borderRadius = getBorderRadius()
      return styles
    }

    // Define animation CSS
    const animationCSS = `
      /* Dropdown animations */
      .ant-dropdown-fade {
        animation-name: antFadeIn;
        animation-duration: 0.2s;
        animation-fill-mode: both;
        animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
      }
      
      .ant-dropdown-slide {
        animation-name: antSlideUpIn;
        animation-duration: 0.2s;
        animation-fill-mode: both;
        animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
      }
      
      .ant-dropdown-scale {
        animation-name: antZoomIn;
        animation-duration: 0.2s;
        animation-fill-mode: both;
        animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
      }
      
      @keyframes antFadeIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      
      @keyframes antSlideUpIn {
        0% {
          opacity: 0;
          transform: scaleY(0.8);
          transform-origin: 0% 0%;
        }
        100% {
          opacity: 1;
          transform: scaleY(1);
          transform-origin: 0% 0%;
        }
      }
      
      @keyframes antZoomIn {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      /* Item hover styling */
      .ant-dropdown-custom-menu .ant-dropdown-menu-item {
        transition: background-color 0.2s ease, color 0.2s ease;
      }
      
      .ant-dropdown-custom-menu .ant-dropdown-menu-item:hover {
        background-color: ${isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.05)"} !important;
        color: #10b981 !important;
      }
      
      .ant-dropdown-custom-menu .ant-dropdown-menu-item-selected {
        background-color: ${isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.05)"} !important;
        color: #10b981 !important;
      }
    `

    // Get animation class
    const getAnimationClass = () => {
      switch (withAnimation) {
        case "fade":
          return "ant-dropdown-fade"
        case "slide":
          return "ant-dropdown-slide"
        case "scale":
          return "ant-dropdown-scale"
        case "none":
        default:
          return ""
      }
    }

    // Combine dropdown content styles with variant styles
    const dropdownContentStyle: React.CSSProperties = {
      ...getVariantStyles(),
      ...style,
    }

    return (
      <>
        <style>{animationCSS}</style>
        <AntDropdown
          ref={ref}
          className={className}
          overlayClassName={`${getAnimationClass()} ant-dropdown-custom-menu ${overlayClassName || ""}`}
          dropdownRender={(menu) => {
            if (!menu) return null

            return (
              <div style={dropdownContentStyle}>
                {React.cloneElement(menu as React.ReactElement, {
                  style: {
                    background: "transparent",
                    boxShadow: "none",
                    border: "none",
                  },
                })}
              </div>
            )
          }}
          {...props}
        >
          {children}
        </AntDropdown>
      </>
    )
  },
)

Dropdown.displayName = "Dropdown"
