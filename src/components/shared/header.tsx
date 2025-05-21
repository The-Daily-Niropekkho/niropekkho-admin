/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useTheme } from "@/components/theme-context";
import { useMobile } from "@/hooks/use-mobile";
import {
    BulbFilled,
    BulbOutlined,
    DownOutlined,
    GlobalOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
    SettingOutlined,
    TranslationOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Input, Layout, Tooltip } from "antd";

import Link from "next/link";
import NotificationMenu from "./notification-menu";

const { Header } = Layout;

interface HeaderProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    pageTitle?: string;
}

export default function AppHeader({
    collapsed,
    setCollapsed,
    pageTitle = "Dashboard",
}: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const isMobile = useMobile();


    const isDark = theme === "dark";
    const primaryColor = "#10b981";

    const userMenuItems = [
        {
            key: "1",
            icon: <UserOutlined />,
            label: <Link href="/profile">My Profile</Link>,
        },
        {
            key: "2",
            icon: <SettingOutlined />,
            label: <Link href="/settings">Settings</Link>,
        },
        {
            type: "divider" as const,
        },
        {
            key: "4",
            icon: <LogoutOutlined />,
            label: <Link href="/login">Sign Out</Link>,
        },
    ];

    return (
        <Header
            style={{
                padding: 0,
                background: isDark ? "#1f2937" : "#ffffff",
                boxShadow: "0 0 3px rgba(0, 0, 0, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 999,
                height: "80px",
                borderBottom: `1px solid ${
                    isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"
                }`,
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                    type="text"
                    icon={
                        collapsed ? (
                            <MenuUnfoldOutlined />
                        ) : (
                            <MenuFoldOutlined />
                        )
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: "16px",
                        width: 64,
                        height: 80,
                        color: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.65)",
                    }}
                />
                {!isMobile && (
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            padding: "0 5px",
                            maxWidth: "500px",
                            flex: 1,
                            color: isDark ? "#ffffff" : "#111827",
                            marginLeft: "20px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <Input
                            placeholder="Search for anything..."
                            prefix={
                                <SearchOutlined
                                    style={{
                                        color: primaryColor,
                                        fontSize: "16px",
                                    }}
                                />
                            }
                            style={{
                                width: "100%",
                                border: "none",
                                padding: "10px 15px",
                                height: "42px",
                                background: isDark
                                    ? "rgba(255, 255, 255, 0.05)"
                                    : "rgba(0, 0, 0, 0.03)",
                                fontSize: "14px",
                            }}
                        />
                    </div>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 16px",
                }}
            >
                <Tooltip title="Help">
                    <Button
                        type="text"
                        icon={<QuestionCircleOutlined />}
                        style={{
                            marginRight: "8px",
                            color: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.65)",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                        }}
                    />
                </Tooltip>

                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "1",
                                label: "English",
                                icon: <GlobalOutlined />,
                            },
                            {
                                key: "2",
                                label: "Bengali",
                                icon: <TranslationOutlined />,
                            },
                        ],
                    }}
                    placement="bottomRight"
                >
                    <Button
                        type="text"
                        icon={<GlobalOutlined />}
                        style={{
                            marginRight: "8px",
                            color: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.65)",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                        }}
                    />
                </Dropdown>

                <Tooltip
                    title={
                        theme === "dark"
                            ? "Switch to Light Mode"
                            : "Switch to Dark Mode"
                    }
                >
                    <Button
                        type="text"
                        icon={
                            theme === "dark" ? <BulbFilled /> : <BulbOutlined />
                        }
                        onClick={toggleTheme}
                        style={{
                            marginRight: "16px",
                            color: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.65)",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                        }}
                    />
                </Tooltip>

                <NotificationMenu/>

                <Dropdown
                    menu={{ items: userMenuItems as any }}
                    placement="bottomRight"
                    trigger={["click"]}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            padding: "6px 8px 6px 6px",
                            borderRadius: "30px",
                            background: isDark
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(0, 0, 0, 0.03)",
                            transition: "all 0.2s ease",
                            border: `1px solid ${
                                isDark
                                    ? "rgba(255, 255, 255, 0.1)"
                                    : "rgba(0, 0, 0, 0.05)"
                            }`,
                        }}
                    >
                        <Avatar
                            src="/placeholder.png"
                            size={32}
                            style={{
                                marginRight: !isMobile ? "8px" : 0,
                                border: `2px solid ${primaryColor}`,
                            }}
                        />
                        {!isMobile && (
                            <>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        marginRight: "4px",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    <span
                                        style={{
                                            color: isDark
                                                ? "#ffffff"
                                                : "rgba(0, 0, 0, 0.85)",
                                            fontWeight: "500",
                                            fontSize: "14px",
                                        }}
                                    >
                                        Admin User
                                    </span>
                                    <span
                                        style={{
                                            color: isDark
                                                ? "rgba(255, 255, 255, 0.5)"
                                                : "rgba(0, 0, 0, 0.5)",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Editor
                                    </span>
                                </div>
                                <DownOutlined
                                    style={{
                                        fontSize: "10px",
                                        color: isDark
                                            ? "rgba(255, 255, 255, 0.5)"
                                            : "rgba(0, 0, 0, 0.5)",
                                    }}
                                />
                            </>
                        )}
                    </div>
                </Dropdown>
            </div>
        </Header>
    );
}
