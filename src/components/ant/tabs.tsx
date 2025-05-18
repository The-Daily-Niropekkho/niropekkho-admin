"use client"

import { Tabs as AntTabs } from "antd"
import type { TabsProps as AntTabsProps } from "antd"
import { useTheme } from "@/components/theme-context"
import React, { forwardRef } from "react"
import { motion } from "framer-motion"

const { TabPane: AntTabPane } = AntTabs

export interface TabsProps extends AntTabsProps {
  variant?: "default" | "filled" | "pills" | "underlined" | "bordered"
  tabSize?: "small" | "medium" | "large"
  showAnimation?: boolean
  rounded?: "none" | "sm" | "md" | "lg" | "full"
}

export interface TabPaneProps extends React.ComponentProps<typeof AntTabPane> {}

export const TabPane = AntTabPane

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      variant = "default",
      tabSize = "medium",
      showAnimation = true,
      rounded = "md",
      children,
      className,
      style,
      activeKey,
      defaultActiveKey,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    // Get inline styles based on variant
    const getVariantStyles = () => {
      const styles: React.CSSProperties = {}

      switch (variant) {
        case "default":
          // Default styling
          break
        case "filled":
          styles.backgroundColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)"
          styles.borderRadius = getBorderRadius()
          styles.padding = "4px"
          break
        case "pills":
          styles.backgroundColor = "transparent"
          break
        case "underlined":
          styles.borderBottom = isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)"
          break
        case "bordered":
          styles.border = isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)"
          styles.borderRadius = getBorderRadius()
          styles.padding = "12px"
          break
        default:
          break
      }

      return styles
    }

    // Get tab content padding based on tab size
    const getTabPadding = () => {
      switch (tabSize) {
        case "small":
          return "8px 12px"
        case "medium":
          return "10px 16px"
        case "large":
          return "12px 20px"
        default:
          return "10px 16px"
      }
    }

    // Get font size based on tab size
    const getTabFontSize = () => {
      switch (tabSize) {
        case "small":
          return "13px"
        case "medium":
          return "14px"
        case "large":
          return "16px"
        default:
          return "14px"
      }
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
        case "full":
          return "9999px"
        default:
          return "8px"
      }
    }

    // Generate CSS for tab styles
    const tabsCSS = `
      .custom-tabs-${variant} .ant-tabs-nav::before {
        display: ${variant === "underlined" ? "block" : "none"} !important;
        border-bottom: ${isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)"} !important;
      }
      
      .custom-tabs-${variant} .ant-tabs-tab {
        padding: ${getTabPadding()} !important;
        font-size: ${getTabFontSize()} !important;
        transition: all 0.2s !important;
        margin: ${variant === "pills" || variant === "filled" ? "2px 4px !important" : "0 !important"};
        ${
          variant === "pills"
            ? `
          border-radius: ${getBorderRadius()} !important;
          &:hover {
            background: ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"} !important;
          }
        `
            : ""
        }
      }
      
      .custom-tabs-${variant} .ant-tabs-tab-active {
        ${
          variant === "pills"
            ? `
          background: ${isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.1)"} !important;
          font-weight: 500 !important;
        `
            : ""
        }
      }
      
      .custom-tabs-${variant} .ant-tabs-tab:hover {
        color: #10b981 !important;
      }
      
      .custom-tabs-${variant} .ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #10b981 !important;
        font-weight: 500 !important;
      }
      
      .custom-tabs-${variant} .ant-tabs-ink-bar {
        background: #10b981 !important;
        height: ${variant === "underlined" ? "2px" : "0"} !important;
      }
    `

    // Create tab animation variants
    const tabContentVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    }

    // Create custom render for animated tab content
    const renderTabBar = showAnimation ? props.renderTabBar : undefined

    return (
      <>
        <style>{tabsCSS}</style>
        <AntTabs
          ref={ref}
          className={`custom-tabs-${variant} ${className || ""}`}
          style={{ ...getVariantStyles(), ...style }}
          activeKey={activeKey}
          defaultActiveKey={defaultActiveKey}
          renderTabBar={renderTabBar}
          animated={
            showAnimation
              ? {
                  inkBar: true,
                  tabPane: true,
                }
              : false
          }
          {...props}
        >
          {showAnimation
            ? React.Children.map(children as React.ReactElement[], (child) => {
                if (!React.isValidElement(child)) return child

                // Clone the child with render props for animation
                return React.cloneElement(child, {
                  ...child.props,
                  forceRender: true,
                  children: (
                    <motion.div
                      key={child.key}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={tabContentVariants}
                      transition={{ duration: 0.2 }}
                    >
                      {child.props.children}
                    </motion.div>
                  ),
                })
              })
            : children}
        </AntTabs>
      </>
    )
  },
)

Tabs.displayName = "Tabs"
