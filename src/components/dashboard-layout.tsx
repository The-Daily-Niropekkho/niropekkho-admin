"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Layout, Menu, Button, Dropdown, Avatar, Badge, Space, Breadcrumb } from "antd"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TableOutlined,
  FormOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"

const { Header, Sider, Content } = Layout

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function DashboardLayout({ children, title = "Dashboard" }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])

  const items = [
    {
      key: "1",
      label: <Link href="/profile">Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: <Link href="/settings">Settings</Link>,
      icon: <SettingOutlined />,
    },
    {
      key: "3",
      type: "divider",
    },
    {
      key: "4",
      label: <Link href="/login">Logout</Link>,
      icon: <LogoutOutlined />,
    },
  ]

  const notificationItems = [
    {
      key: "1",
      label: "New user registered",
    },
    {
      key: "2",
      label: "New order received",
    },
    {
      key: "3",
      label: "System update completed",
    },
  ]

  const getBreadcrumbItems = () => {
    const paths = pathname.split("/").filter(Boolean)
    return [
      {
        title: <Link href="/dashboard">Dashboard</Link>,
      },
      ...paths.slice(1).map((path, index) => {
        const url = `/${paths.slice(0, index + 2).join("/")}`
        return {
          title:
            index === paths.length - 2 ? (
              <Link href={url}>{path.charAt(0).toUpperCase() + path.slice(1)}</Link>
            ) : (
              path.charAt(0).toUpperCase() + path.slice(1)
            ),
        }
      }),
    ]
  }

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: isMobile ? "fixed" : "relative",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
        width={220}
      >
        <div className="logo">{collapsed ? "AD" : "Admin Dashboard"}</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          selectedKeys={[pathname]}
          items={[
            {
              key: "/dashboard",
              icon: <DashboardOutlined />,
              label: <Link href="/dashboard">Dashboard</Link>,
            },
            {
              key: "/tables",
              icon: <TableOutlined />,
              label: <Link href="/tables">Tables</Link>,
            },
            {
              key: "/forms",
              icon: <FormOutlined />,
              label: <Link href="/forms">Forms</Link>,
            },
            {
              key: "/profile",
              icon: <UserOutlined />,
              label: <Link href="/profile">Profile</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "#fff" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div className="header-actions">
            <Dropdown
              menu={{
                items: notificationItems,
              }}
              placement="bottomRight"
              arrow
            >
              <Badge count={3}>
                <Button type="text" icon={<BellOutlined />} shape="circle" />
              </Badge>
            </Dropdown>
            <Dropdown menu={{ items }} placement="bottomRight">
              <Space>
                <Avatar icon={<UserOutlined />} />
                {!isMobile && <span>Admin User</span>}
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            borderRadius: 8,
            overflow: "auto",
          }}
        >
          <Breadcrumb style={{ marginBottom: 16 }} items={getBreadcrumbItems()} />
          <h1 style={{ marginBottom: 24 }}>{title}</h1>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
