/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useTheme } from "@/components/theme-context";
import { useMobile } from "@/hooks/use-mobile";
import { useSession } from "@/provider/session-provider";
import {
    AuditOutlined,
    BarChartOutlined,
    BarsOutlined,
    DashboardOutlined,
    DiffOutlined,
    FileTextOutlined,
    FormOutlined,
    GlobalOutlined,
    IdcardOutlined,
    NotificationOutlined,
    PictureOutlined,
    ScheduleOutlined,
    SettingOutlined,
    TagsOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CustomImage from "../ui/image";

const { Sider } = Layout;

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

interface MenuItem {
    key: string;
    icon?: React.ReactNode;
    label: React.ReactNode;
    children?: MenuItem[];
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const isMobile = useMobile();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { session } = useSession();


    const menuItems: MenuItem[] = [
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
                {
                    key: "/dashboard/news/breakings",
                    label: (
                        <Link href="/dashboard/news/breakings">Breakings</Link>
                    ),
                },
                {
                    key: "/dashboard/news/featured",
                    label: (
                        <Link href="/dashboard/news/featured">Featured News</Link>
                    ),
                },
            ],
        },
        {
            key: "/dashboard/posts",
            icon: <FormOutlined />,
            label: <Link href="/dashboard/posts">Posts</Link>,
        },
        {
            key: "/dashboard/media",
            icon: <PictureOutlined />,
            label: <Link href="/dashboard/media">Media Library</Link>,
        },
        {
            key: "/dashboard/categories",
            icon: <TagsOutlined />,
            label: <Link href="/dashboard/categories">Categories</Link>,
        },
        // {
        //     key: "/dashboard/sub-categories",
        //     icon: <TagsOutlined />,
        //     label: <Link href="/dashboard/sub-categories">Sub Categories</Link>,
        // },
        {
            key: "/dashboard/topics",
            icon: <BarsOutlined />,
            label: <Link href="/dashboard/topics">Topics</Link>,
        },
        {
            key: "/dashboard/polls",
            icon: <ScheduleOutlined />,
            label: <Link href="/dashboard/polls">Polls</Link>,
        },
        {
            key: "epaper",
            icon: <DiffOutlined />,
            label: "EPaper",
            children: [
                {
                    key: "/dashboard/epaper/categories",
                    label: (
                        <Link href="/dashboard/epaper/categories">
                            Manage Categories
                        </Link>
                    ),
                },
                {
                    key: "/dashboard/epaper/pages",
                    label: (
                        <Link href="/dashboard/epaper/pages">Manage Page</Link>
                    ),
                },
                {
                    key: "/dashboard/epaper/add",
                    label: (
                        <Link href="/dashboard/epaper/add">Create User</Link>
                    ),
                },
            ],
        },
        {
            key: "/dashboard/advertisement",
            icon: <NotificationOutlined />,
            label: <Link href="/dashboard/advertisement">Advertisement</Link>,
        },
        {
            key: "/dashboard/reports",
            icon: <BarChartOutlined />,
            label: <Link href="/dashboard/reports">Reports</Link>,
        },
        {
            key: "/dashboard/reporters",
            icon: <IdcardOutlined />,
            label: <Link href="/dashboard/reporters">Generic Reporters</Link>,
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
            key: "/dashboard/department",
            icon: <AuditOutlined />,
            label: <Link href="/dashboard/department">Department</Link>,
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

    const nonAdminAllowedKeys = [
        "/dashboard",
        "news",
        "/dashboard/posts",
        "/dashboard/media",
        "/dashboard/categories",
        "/dashboard/topics",
        "/dashboard/polls",
        "epaper",
    ];

    const filterMenuByRole = (
        items: MenuItem[],
        userType: string
    ): MenuItem[] => {
        if (userType === "admin") return items;

        return items
            .filter((item) => nonAdminAllowedKeys.includes(item.key))
            .map((item) => {
                if (item.children) {
                    // Only filter children if parent is allowed
                    const filteredChildren = item.children.filter(
                        (child) => nonAdminAllowedKeys.includes(item.key) // only keep children if parent is allowed
                    );
                    return { ...item, children: filteredChildren };
                }
                return item;
            });
    };

    const filteredMenuItems = filterMenuByRole(
        menuItems,
        session?.user_type ?? ""
    );

    const getLevelKeys = (items: MenuItem[]) => {
        const key: Record<string, number> = {};
        const func = (items2: MenuItem[], level = 1) => {
            items2.forEach((item) => {
                if (item.key) key[item.key] = level;
                if (item.children) func(item.children, level + 1);
            });
        };
        func(items);
        return key;
    };

    const levelKeys = getLevelKeys(menuItems);
    const [stateOpenKeys, setStateOpenKeys] = useState([
        pathname.split("/")[1],
    ]);

    const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
        const currentOpenKey = openKeys.find(
            (key) => !stateOpenKeys.includes(key)
        );
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex(
                    (key) => levelKeys[key] === levelKeys[currentOpenKey]
                );

            setStateOpenKeys(
                openKeys
                    .filter((_, index) => index !== repeatIndex)
                    .filter(
                        (key) => levelKeys[key] <= levelKeys[currentOpenKey]
                    )
            );
        } else {
            setStateOpenKeys(openKeys);
        }
    };

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
                {collapsed && (
                    <CustomImage
                        width={50}
                        height={50}
                        src={
                            isDark
                                ? "/logo-square-dark.png"
                                : "/logo-square.png"
                        }
                        alt="Niropekkho Logo"
                        className={isDark ? "invert" : ""}
                    />
                )}
                {!collapsed && (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <CustomImage
                            width={180}
                            height={50}
                            src={isDark ? "/logo-dark.png" : "/logo.png"}
                            alt="Niropekkho Logo"
                            className={isDark ? "invert" : ""}
                        />
                    </div>
                )}
            </div>

            <div
                style={{
                    padding: "12px 0",
                    height: "calc(100vh - 80px)",
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                <Menu
                    mode="inline"
                    defaultOpenKeys={[pathname.split("/")[1]]}
                    selectedKeys={[pathname]}
                    style={{ borderRight: 0, background: "transparent" }}
                    openKeys={stateOpenKeys}
                    onOpenChange={onOpenChange}
                    items={filteredMenuItems as MenuProps["items"]}
                    theme={isDark ? "dark" : "light"}
                    className="custom-sidebar-menu"
                />
            </div>
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
                    background: ${collapsed ? "" : "transparent"} !important;
                }

                .custom-sidebar-menu .ant-menu-sub .ant-menu-item {
                    padding-left: ${collapsed ? "12px" : "48px"} !important;
                    height: 40px !important;
                    line-height: 40px !important;
                }
                // .ant-tooltip-inner {
                //     background-color: white !important;
                //     color: black !important;
                // }

                // .ant-tooltip-arrow::before {
                //     background-color: white !important;
                // }
            `}</style>
        </Sider>
    );
}
