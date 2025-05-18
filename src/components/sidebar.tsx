/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useTheme } from "@/components/theme-context";
import { useMobile } from "@/hooks/use-mobile";
import {
    AppstoreOutlined,
    BarChartOutlined,
    DashboardOutlined,
    FileOutlined,
    FileTextOutlined,
    GlobalOutlined,
    InboxOutlined,
    MenuOutlined,
    NotificationOutlined,
    PictureOutlined,
    SearchOutlined,
    SettingOutlined,
    TagsOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Layout, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const { Sider } = Layout;

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const isMobile = useMobile();
    const { theme } = useTheme();
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

    const isDark = theme === "dark";

    const primaryColor = "#10b981"; // Green color for primary elements
    const secondaryColor = "#8b5cf6"; // Purple for secondary elements

    const menuItems = [
        {
            key: "/dashboard",
            icon: <DashboardOutlined />,
            label: <Link href="/dashboard">Dashboard</Link>,
        },
        {
            key: "/components-showcase",
            icon: <AppstoreOutlined />,
            label: <Link href="/dashboard/components-showcase">Components</Link>,
        },
        {
            key: "news",
            icon: <FileTextOutlined />,
            label: "News",
            children: [
                {
                    key: "/dashboard/news/all",
                    label: <Link href="/dashboard/news/all">All News</Link>,
                },
                {
                    key: "/dashboard/news/create",
                    label: (
                        <Link href="/dashboard/news/create">Create News</Link>
                    ),
                },
                {
                    key: "/dashboard/news/drafts",
                    label: <Link href="/dashboard/news/drafts">Drafts</Link>,
                },
            ],
        },
        {
            key: "/dashboard/media",
            icon: <PictureOutlined />,
            label: <Link href="/dashboard/media">Media Library</Link>,
        },
        {
            key: "/dashboard/menu",
            icon: <MenuOutlined />,
            label: <Link href="/dashboard/menu">Menu</Link>,
        },
        {
            key: "/dashboard/categories",
            icon: <TagsOutlined />,
            label: <Link href="/dashboard/categories">Categories</Link>,
        },
        {
            key: "/dashboard/archive",
            icon: <InboxOutlined />,
            label: <Link href="/dashboard/archive">Archive</Link>,
        },
        {
            key: "/dashboard/advertisement",
            icon: <NotificationOutlined />,
            label: <Link href="/dashboard/advertisement">Advertisement</Link>,
        },
        {
            key: "reporters",
            icon: <TeamOutlined />,
            label: "Reporters",
            children: [
                {
                    key: "/dashboard/reporters/all",
                    label: (
                        <Link href="/dashboard/reporters/all">
                            All Reporters
                        </Link>
                    ),
                },
                {
                    key: "/dashboard/reporters/add",
                    label: (
                        <Link href="/dashboard/reporters/add">
                            Add Reporter
                        </Link>
                    ),
                },
                {
                    key: "/dashboard/reporters/performance",
                    label: (
                        <Link href="/dashboard/reporters/performance">
                            Performance
                        </Link>
                    ),
                },
            ],
        },
        {
            key: "/dashboard/pages",
            icon: <FileOutlined />,
            label: <Link href="/dashboard/pages">Pages</Link>,
        },
        {
            key: "/dashboard/seo",
            icon: <SearchOutlined />,
            label: <Link href="/dashboard/seo">SEO</Link>,
        },
        {
            key: "analytics",
            icon: <BarChartOutlined />,
            label: "Analytics",
            children: [
                {
                    key: "/dashboard/analytics/overview",
                    label: (
                        <Link href="/dashboard/analytics/overview">
                            Overview
                        </Link>
                    ),
                },
                {
                    key: "/dashboard/reports",
                    label: <Link href="/dashboard/reports">Reports</Link>,
                },
            ],
        },
        {
            key: "/dashboard/profile",
            icon: <UserOutlined />,
            label: <Link href="/dashboard/profile">Profile</Link>,
        },
        {
            key: "/dashboard/settings",
            icon: <SettingOutlined />,
            label: <Link href="/dashboard/settings">Settings</Link>,
        },
        {
            key: "/dashboard/web-setup",
            icon: <SettingOutlined />,
            label: <Link href="/dashboard/web-setup">Web Setup</Link>,
        },
    ];

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{
                overflow: "hidden",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 1000,
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
                background: isDark ? "#111827" : "#ffffff",
                transition: "all 0.3s ease",
            }}
            width={285}
            theme={isDark ? "dark" : "light"}
        >
            <div
                className="logo"
                style={{
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    padding: collapsed ? "16px" : "16px 24px",
                    background: isDark ? "#111827" : "#ffffff",
                    color: isDark ? "#ffffff" : "#111827",
                    borderBottom: `1px solid ${
                        isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.05)"
                    }`,
                    transition: "all 0.3s ease",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: collapsed ? "40px" : "48px",
                        height: collapsed ? "40px" : "48px",
                        borderRadius: "12px",
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        marginRight: collapsed ? 0 : "16px",
                        transition: "all 0.3s ease",
                    }}
                >
                    <GlobalOutlined
                        style={{ fontSize: "20px", color: "#ffffff" }}
                    />
                </div>
                {!collapsed && (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                            style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                letterSpacing: "0.5px",
                            }}
                        >
                            নিরপেক্ষ
                        </span>
                        <span style={{ fontSize: "12px", opacity: 0.7 }}>
                            Newspaper Admin
                        </span>
                    </div>
                )}
            </div>

            <div
                style={{
                    padding: "12px 0",
                    height: "calc(100vh - 80px - 80px)",
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                <Menu
                    mode="inline"
                    defaultOpenKeys={[pathname.split("/")[1]]}
                    selectedKeys={[pathname]}
                    style={{
                        borderRight: 0,
                        background: "transparent",
                    }}
                    items={menuItems}
                    theme={isDark ? "dark" : "light"}
                    className="custom-sidebar-menu"
                />
            </div>

            {!collapsed && (
                <div
                    style={{
                        padding: "20px 24px",
                        borderTop: `1px solid ${
                            isDark
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(0, 0, 0, 0.05)"
                        }`,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                            size={50}
                            src="/diverse-group.png"
                            style={{
                                border: `2px solid ${primaryColor}`,
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                        <div style={{ marginLeft: "12px" }}>
                            <div
                                style={{
                                    fontWeight: "bold",
                                    color: isDark ? "#ffffff" : "#111827",
                                    fontSize: "15px",
                                }}
                            >
                                Admin User
                            </div>
                            <div
                                style={{
                                    fontSize: "13px",
                                    color: isDark
                                        ? "rgba(255, 255, 255, 0.6)"
                                        : "rgba(0, 0, 0, 0.6)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                                <Badge status="success" />
                                <span>Editor</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-sidebar-menu .ant-menu-item {
                    margin: 4px 12px !important;
                    padding-left: ${collapsed ? "12px" : "24px"} !important;
                    border-radius: 8px !important;
                    height: 44px !important;
                    line-height: 44px !important;
                    transition: all 0.2s ease !important;
                }

                .custom-sidebar-menu .ant-menu-submenu-title {
                    margin: 4px 12px !important;
                    padding-left: ${collapsed ? "12px" : "24px"} !important;
                    border-radius: 8px !important;
                    height: 44px !important;
                    line-height: 44px !important;
                    transition: all 0.2s ease !important;
                }

                .custom-sidebar-menu .ant-menu-item-selected {
                    background: ${isDark
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(16, 185, 129, 0.1)"} !important;
                    font-weight: 500 !important;
                }

                .custom-sidebar-menu .ant-menu-item-selected::after {
                    display: none !important;
                }

                .custom-sidebar-menu .ant-menu-item:hover,
                .custom-sidebar-menu .ant-menu-submenu-title:hover {
                    background: ${isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)"} !important;
                }

                .custom-sidebar-menu .ant-menu-submenu-arrow {
                    right: 16px !important;
                }

                .custom-sidebar-menu .ant-menu-item .ant-menu-item-icon,
                .custom-sidebar-menu
                    .ant-menu-submenu-title
                    .ant-menu-item-icon {
                    min-width: 16px !important;
                    font-size: 16px !important;
                }

                .custom-sidebar-menu .ant-menu-sub {
                    background: transparent !important;
                }

                .custom-sidebar-menu .ant-menu-sub .ant-menu-item {
                    padding-left: ${collapsed ? "12px" : "48px"} !important;
                    height: 40px !important;
                    line-height: 40px !important;
                }
            `}</style>
        </Sider>
    );
}
