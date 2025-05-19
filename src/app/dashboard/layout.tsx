"use client"

import AppHeader from "@/components/shared/header"
import Sidebar from "@/components/shared/sidebar"
import { useTheme } from "@/components/theme-context"
import { useMobile } from "@/hooks/use-mobile"
import { ConfigProvider, Layout, theme as antTheme } from "antd"
import { usePathname } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

const { Content } = Layout

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { theme } = useTheme()
  const isMobile = useMobile()
  const pathname = usePathname()

  const isDark = theme === "dark"

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean)
    if (path.length === 1 && path[0] === "dashboard") {
      return "Dashboard"
    }

    const lastSegment = path[path.length - 1]
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
  }

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    } else {
      setCollapsed(false)
    }
  }, [isMobile])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#10b981",
          borderRadius: 8,
          colorBgContainer: isDark ? "#1f2937" : "#ffffff",
          colorBgElevated: isDark ? "#1f2937" : "#ffffff",
          colorBgLayout: isDark ? "#111827" : "#f9fafb",
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout style={{ marginLeft: collapsed ? "80px" : "280px", transition: "margin-left 0.3s ease" }}>
          <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} pageTitle={getPageTitle()} />
          <Content
            style={{
              margin: "24px",
              padding: 0,
              minHeight: 280,
              borderRadius: "12px",
              overflow: "hidden",
              background: "transparent",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}