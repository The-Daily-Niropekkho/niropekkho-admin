"use client"

import { Modal as AntModal } from "antd"
import type { ModalProps as AntModalProps } from "antd"
import { useTheme } from "@/components/theme-context"
import type React from "react"
import { forwardRef } from "react"

export interface ModalProps extends AntModalProps {
  variant?: "default" | "bordered" | "filled"
  animation?: "fade" | "slide" | "scale" | "none"
  rounded?: "none" | "sm" | "md" | "lg" | "full"
  withShadow?: boolean
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      variant = "default",
      animation = "fade",
      rounded = "md",
      withShadow = true,
      children,
      style,
      open,
      className,
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
        case "default":
          styles.background = isDark ? "#1f2937" : "#ffffff"
          styles.border = "none"
          break
        case "bordered":
          styles.background = isDark ? "#1f2937" : "#ffffff"
          styles.border = isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(0, 0, 0, 0.15)"
          break
        case "filled":
          styles.background = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.02)"
          styles.border = "none"
          break
        default:
          break
      }

      if (withShadow) {
        styles.boxShadow = isDark ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }

      return styles
    }

    // Get border radius based on rounded prop
    const getBorderRadius = () => {
      switch (rounded) {
        case "none":
          return "0px"
        case "sm":
          return "8px"
        case "md":
          return "12px"
        case "lg":
          return "16px"
        case "full":
          return "24px"
        default:
          return "12px"
      }
    }

    // Combine all styles
    const modalStyles: React.CSSProperties = {
      borderRadius: getBorderRadius(),
      overflow: "hidden",
      padding: 0,
      ...getVariantStyles(),
      ...style,
    }

    // Apply styles to modal content
    const modalContentStyles: React.CSSProperties = {
      borderRadius: getBorderRadius(),
      overflow: "hidden",
      padding: 0,
    }

    // Custom close icon style
    const closeIconStyle: React.CSSProperties = {
      color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.45)",
    }

    // Animation CSS
    const animationCSS = `
      /* Modal animations */
      .ant-modal-fade-enter, .ant-modal-fade-appear {
        opacity: 0;
      }
      .ant-modal-fade-enter-active, .ant-modal-fade-appear-active {
        opacity: 1;
        transition: opacity 0.3s ease;
      }
      .ant-modal-fade-exit {
        opacity: 1;
      }
      .ant-modal-fade-exit-active {
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .ant-modal-slide-enter, .ant-modal-slide-appear {
        opacity: 0;
        transform: translateY(50px);
      }
      .ant-modal-slide-enter-active, .ant-modal-slide-appear-active {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .ant-modal-slide-exit {
        opacity: 1;
        transform: translateY(0);
      }
      .ant-modal-slide-exit-active {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .ant-modal-scale-enter, .ant-modal-scale-appear {
        opacity: 0;
        transform: scale(0.9);
      }
      .ant-modal-scale-enter-active, .ant-modal-scale-appear-active {
        opacity: 1;
        transform: scale(1);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .ant-modal-scale-exit {
        opacity: 1;
        transform: scale(1);
      }
      .ant-modal-scale-exit-active {
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
    `

    // Get animation class name
    const getAnimationClassName = () => {
      switch (animation) {
        case "fade":
          return "ant-modal-fade"
        case "slide":
          return "ant-modal-slide"
        case "scale":
          return "ant-modal-scale"
        case "none":
        default:
          return ""
      }
    }

    return (
      <>
        <style>{animationCSS}</style>
        <AntModal
          ref={ref}
          className={`${getAnimationClassName()} ${className || ""}`}
          style={modalStyles}
          open={open}
          closeIcon={props.closeIcon !== null && <span style={closeIconStyle}>×</span>}
          {...props}
        >
          <div style={modalContentStyles}>{children}</div>
        </AntModal>
      </>
    )
  },
)

Modal.displayName = "Modal"
