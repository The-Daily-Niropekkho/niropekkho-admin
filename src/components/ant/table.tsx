"use client"

import { Table as AntTable } from "antd"
import type { TableProps as AntTableProps } from "antd"
import { useTheme } from "@/components/theme-context"
import type React from "react"
import { forwardRef } from "react"

export interface TableProps extends AntTableProps<any> {
  variant?: "default" | "bordered" | "striped" | "hoverable" | "minimal"
  rounded?: "none" | "sm" | "md" | "lg"
  withShadow?: boolean
  isCompact?: boolean
  highlightOnHover?: boolean
  headerBackground?: boolean
}

export const Table = forwardRef<HTMLDivElement, TableProps>(
  (
    {
      variant = "default",
      rounded = "md",
      withShadow = true,
      isCompact = false,
      highlightOnHover = true,
      headerBackground = true,
      style,
      className,
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
          return "6px"
        case "md":
          return "10px"
        case "lg":
          return "14px"
        default:
          return "10px"
      }
    }

    // Base styles based on variant
    const getVariantStyles = () => {
      const styles: React.CSSProperties = {
        borderRadius: getBorderRadius(),
        overflow: "hidden",
      }

      if (withShadow) {
        styles.boxShadow = isDark ? "0 4px 12px rgba(0, 0, 0, 0.2)" : "0 4px 12px rgba(0, 0, 0, 0.08)"
      }

      return styles
    }

    // Generate table classes
    const getTableClasses = () => {
      const classes = []

      if (highlightOnHover) {
        classes.push("ant-table-hover-highlight")
      }

      if (variant === "striped") {
        classes.push("ant-table-striped")
      }

      if (isCompact) {
        classes.push("ant-table-compact")
      }

      if (variant === "minimal") {
        classes.push("ant-table-minimal")
      }

      return classes.join(" ")
    }

    // Get header background style
    const getHeaderStyle = () => {
      if (headerBackground) {
        return isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.02)"
      }
      return "transparent"
    }

    // Combine all styles
    const tableStyles: React.CSSProperties = {
      ...getVariantStyles(),
      ...style,
    }

    // Generate component CSS
    const tableCSS = `
      .ant-table-hover-highlight .ant-table-tbody > tr:hover > td {
        background: ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)"} !important;
      }
      
      .ant-table-striped .ant-table-tbody > tr:nth-child(odd) > td {
        background: ${isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.01)"};
      }
      
      .ant-table-compact .ant-table-thead > tr > th,
      .ant-table-compact .ant-table-tbody > tr > td {
        padding: 8px 12px !important;
      }
      
      .ant-table-minimal .ant-table-thead > tr > th {
        border-bottom: 1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)"};
        border-top: none;
        background: transparent !important;
      }
      
      .ant-table-minimal .ant-table-tbody > tr > td {
        border-bottom: 1px solid ${isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"};
      }
      
      .ant-table-minimal .ant-table-tbody > tr:last-child > td {
        border-bottom: none;
      }
    `

    // Custom components
    const components = {
      header: {
        cell: (props: any) => (
          <th
            {...props}
            style={{
              ...props.style,
              background: getHeaderStyle(),
              fontWeight: 600,
              color: isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.85)",
            }}
          />
        ),
      },
      body: {
        row: (props: any) => <tr {...props} />,
        cell: (props: any) => (
          <td
            {...props}
            style={{
              ...props.style,
              borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
            }}
          />
        ),
      },
    }

    return (
      <>
        <style>{tableCSS}</style>
        <AntTable
          ref={ref}
          className={`${getTableClasses()} ${className || ""}`}
          style={tableStyles}
          components={components}
          bordered={variant === "bordered"}
          {...props}
        />
      </>
    )
  },
)

Table.displayName = "Table"
