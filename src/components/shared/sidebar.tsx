/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useTheme } from "@/components/theme-context";
import { useMobile } from "@/hooks/use-mobile";
import {
    BarChartOutlined,
    BarsOutlined,
    DashboardOutlined,
    FileOutlined,
    FileTextOutlined,
    GlobalOutlined,
    IdcardOutlined,
    InboxOutlined,
    MenuOutlined,
    NotificationOutlined,
    PictureOutlined,
    ScheduleOutlined,
    SearchOutlined,
    SettingOutlined,
    TagsOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Layout, Menu, MenuProps } from "antd";
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

    const menuItems = [
        {
            key: "/dashboard",
            icon: <DashboardOutlined />,
            label: <Link href="/dashboard">Dashboard</Link>,
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
            key: "/dashboard/menus",
            icon: <MenuOutlined />,
            label: <Link href="/dashboard/menus">Menu</Link>,
        },
        {
            key: "/dashboard/categories",
            icon: <TagsOutlined />,
            label: <Link href="/dashboard/categories">Categories</Link>,
        },
        {
            key: "/dashboard/topics",
            icon: <BarsOutlined />,
            label: <Link href="/dashboard/topics">Topics</Link>,
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
            key: "/dashboard/polls",
            icon: <ScheduleOutlined />,
            label: <Link href="/dashboard/polls">Polls</Link>,
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
            key: "/dashboard/reporters",
            icon: <IdcardOutlined />,
            label: <Link href="/dashboard/reporters">Reporters</Link>,
        },
        {
            key: "/dashboard/profile",
            icon: <UserOutlined />,
            label: <Link href="/dashboard/profile">Profile</Link>,
        },
        {
            key: "users",
            icon: <FileTextOutlined />,
            label: "Users",
            children: [
                {
                    key: "/dashboard/users/admin",
                    label: <Link href="/dashboard/users/admin">Admins</Link>,
                },
                {
                    key: "/dashboard/users/writer",
                    label: <Link href="/dashboard/users/writer">Writers</Link>,
                },
                {
                    key: "/dashboard/users/moderator",
                    label: (
                        <Link href="/dashboard/users/moderator">Moderator</Link>
                    ),
                },
                {
                    key: "/dashboard/users/add",
                    label: <Link href="/dashboard/users/add">Create User</Link>,
                },
            ],
        },
        {
            key: "zone",
            icon: <GlobalOutlined />,
            label: "Zone",
            children: [
                {
                    key: "/dashboard/zone/country",
                    label: <Link href="/dashboard/zone/country">Country</Link>,
                },
                {
                    key: "/dashboard/zone/division",
                    label: (
                        <Link href="/dashboard/zone/division">Division</Link>
                    ),
                },

                {
                    key: "/dashboard/zone/district",
                    label: (
                        <Link href="/dashboard/zone/district">District</Link>
                    ),
                },
                {
                    key: "/dashboard/zone/upazilla",
                    label: <Link href="/dashboard/zone/upazilla">Upazila</Link>,
                },
                {
                    key: "/dashboard/zone/union",
                    label: <Link href="/dashboard/zone/union">Union</Link>,
                },
            ],
        },
        {
            key: "/dashboard/settings",
            icon: <SettingOutlined />,
            label: <Link href="/dashboard/settings">Settings</Link>,
        },
    ];

    interface LevelKeysProps {
        key?: string;
        children?: LevelKeysProps[];
    }

    const getLevelKeys = (items1: LevelKeysProps[]) => {
        const key: Record<string, number> = {};
        const func = (items2: LevelKeysProps[], level = 1) => {
            items2.forEach((item) => {
                if (item.key) {
                    key[item.key] = level;
                }
                if (item.children) {
                    func(item.children, level + 1);
                }
            });
        };
        func(items1);
        return key;
    };

    const levelKeys = getLevelKeys(menuItems as LevelKeysProps[]);

    const [stateOpenKeys, setStateOpenKeys] = useState([
        pathname.split("/")[1],
    ]);

    const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
        const currentOpenKey = openKeys.find(
            (key) => stateOpenKeys.indexOf(key) === -1
        );
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex(
                    (key) => levelKeys[key] === levelKeys[currentOpenKey]
                );

            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter(
                        (key) => levelKeys[key] <= levelKeys[currentOpenKey]
                    )
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };

    const isDark = theme === "dark";

    const primaryColor = "#10b981"; // Green color for primary elements
    const secondaryColor = "#8b5cf6"; // Purple for secondary elements

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
                borderRight: `1px solid ${
                    isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"
                }`,
                // background: isDark ? "#111827" : "#ffffff",
                background: isDark ? "#1f2937" : "#ffffff",
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
                    background: isDark ? "#1f2937" : "#ffffff",
                    color: isDark ? "#ffffff" : "#1f2937",
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
                    openKeys={stateOpenKeys}
                    onOpenChange={onOpenChange}
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
                            src="/placeholder.png"
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
                    margin: 4px 5px !important;
                    padding-left: ${collapsed ? "12px" : "24px"} !important;
                    border-radius: 8px !important;
                    height: 44px !important;
                    line-height: 44px !important;
                    transition: all 0.2s ease !important;
                }

                .custom-sidebar-menu .ant-menu-submenu-title {
                    margin: 4px 5px !important;
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
