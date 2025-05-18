/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useTheme } from "@/components/theme-context";
import { useMobile } from "@/hooks/use-mobile";
import {
    BellOutlined,
    BulbFilled,
    BulbOutlined,
    CheckOutlined,
    ClockCircleOutlined, // Added import
    CommentOutlined,
    DownOutlined,
    FileOutlined,
    GlobalOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    QuestionCircleOutlined,
    ReloadOutlined,
    SearchOutlined,
    SettingOutlined,
    TranslationOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Input, Layout, Tooltip } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

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
    const [showNotifications, setShowNotifications] = useState(false);
    const isDark = theme === "dark";
    const primaryColor = "#10b981";

    const notificationItems = [
        {
            key: "1",
            label: "New article submitted",
            description: "Reporter Rahim has submitted a new article",
            time: "10 minutes ago",
            read: false,
            type: "article",
        },
        {
            key: "2",
            label: "Comment approval needed",
            description: "5 new comments need approval",
            time: "30 minutes ago",
            read: false,
            type: "comment",
        },
        {
            key: "3",
            label: "System update available",
            description: "Version 2.5 is available for installation",
            time: "2 hours ago",
            read: true,
            type: "system",
        },
        {
            key: "4",
            label: "Subscription renewed",
            description: "Premium subscription renewed successfully",
            time: "Yesterday",
            read: true,
            type: "subscription",
        },
    ];

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

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "article":
                return <FileOutlined style={{ color: "#10b981" }} />;
            case "comment":
                return <CommentOutlined style={{ color: "#8b5cf6" }} />;
            case "system":
                return <ReloadOutlined style={{ color: "#f59e0b" }} />;
            case "subscription":
                return <CheckOutlined style={{ color: "#3b82f6" }} />;
            default:
                return <BellOutlined />;
        }
    };

    const notificationMenu = (
        <div
            style={{
                width: 360,
                maxHeight: 480,
                overflow: "hidden",
                background: isDark ? "#1f2937" : "#ffffff",
                boxShadow:
                    "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
                borderRadius: "12px",
                border: `1px solid ${
                    isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"
                }`,
            }}
        >
            <div
                style={{
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: `1px solid ${
                        isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.05)"
                    }`,
                }}
            >
                <span
                    style={{
                        fontWeight: "600",
                        color: isDark ? "#ffffff" : "#111827",
                        fontSize: "16px",
                    }}
                >
                    Notifications
                </span>
                <Button
                    type="text"
                    size="small"
                    style={{
                        color: primaryColor,
                        fontWeight: "500",
                        fontSize: "13px",
                    }}
                >
                    Mark all as read
                </Button>
            </div>

            <div
                style={{
                    maxHeight: "360px",
                    overflow: "auto",
                    padding: "8px 0",
                }}
            >
                {notificationItems.map((item) => (
                    <div
                        key={item.key}
                        style={{
                            padding: "12px 20px",
                            borderBottom: `1px solid ${
                                isDark
                                    ? "rgba(255, 255, 255, 0.05)"
                                    : "rgba(0, 0, 0, 0.03)"
                            }`,
                            background: item.read
                                ? "transparent"
                                : isDark
                                ? "rgba(16, 185, 129, 0.05)"
                                : "rgba(16, 185, 129, 0.03)",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            position: "relative",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                alignItems: "flex-start",
                            }}
                        >
                            <div
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "8px",
                                    background: isDark
                                        ? "rgba(255, 255, 255, 0.05)"
                                        : "rgba(0, 0, 0, 0.03)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "16px",
                                }}
                            >
                                {getNotificationIcon(item.type)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontWeight: item.read
                                            ? "normal"
                                            : "600",
                                        color: isDark ? "#ffffff" : "#111827",
                                        fontSize: "14px",
                                        marginBottom: "4px",
                                    }}
                                >
                                    {item.label}
                                </div>
                                <div
                                    style={{
                                        fontSize: "13px",
                                        color: isDark
                                            ? "rgba(255, 255, 255, 0.6)"
                                            : "rgba(0, 0, 0, 0.6)",
                                        marginBottom: "4px",
                                    }}
                                >
                                    {item.description}
                                </div>
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: isDark
                                            ? "rgba(255, 255, 255, 0.4)"
                                            : "rgba(0, 0, 0, 0.4)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }}
                                >
                                    <ClockCircleOutlined
                                        style={{ fontSize: "10px" }}
                                    />
                                    {item.time}
                                </div>
                            </div>
                            {!item.read && (
                                <div
                                    style={{
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        background: primaryColor,
                                        position: "absolute",
                                        top: "16px",
                                        right: "16px",
                                    }}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div
                style={{
                    padding: "14px 20px",
                    textAlign: "center",
                    borderTop: `1px solid ${
                        isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.05)"
                    }`,
                    background: isDark
                        ? "rgba(255, 255, 255, 0.02)"
                        : "rgba(0, 0, 0, 0.01)",
                }}
            >
                <Button
                    type="link"
                    style={{
                        fontWeight: "500",
                        color: primaryColor,
                        fontSize: "14px",
                    }}
                >
                    View All Notifications
                </Button>
            </div>
        </div>
    );

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

                <div style={{ position: "relative" }}>
                    <Badge
                        count={
                            notificationItems.filter((item) => !item.read)
                                .length
                        }
                        overflowCount={9}
                    >
                        <Button
                            type="text"
                            icon={<BellOutlined />}
                            onClick={() =>
                                setShowNotifications(!showNotifications)
                            }
                            style={{
                                marginRight: "16px",
                                color: isDark
                                    ? "#ffffff"
                                    : "rgba(0, 0, 0, 0.65)",
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "8px",
                                background: showNotifications
                                    ? isDark
                                        ? "rgba(255, 255, 255, 0.1)"
                                        : "rgba(0, 0, 0, 0.05)"
                                    : "transparent",
                            }}
                        />
                        <div>

                        </div>
                    </Badge>
                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: "absolute",
                                    top: "48px",
                                    right: "0",
                                    zIndex: 1000,
                                }}
                            >
                                {notificationMenu}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

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
                            src="/diverse-group.png"
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
