"use client";

import {
    BellOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    CommentOutlined,
    FileOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { Badge, Button } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme-context";

export default function NotificationMenu() {
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const { isDark } = useTheme();
    const primaryColor = "#10b981";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showNotifications]);

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

    return (
        <div style={{ position: "relative" , marginRight: "16px" }}>
            <Badge
                count={notificationItems.filter((item) => !item.read).length}
                overflowCount={9}
            >
                <Button
                    type="text"
                    icon={<BellOutlined />}
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{
                        color: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.65)",
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
            </Badge>
            <AnimatePresence>
                {showNotifications && (
                    <motion.div
                        ref={notificationRef} // <-- here
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: "absolute",
                            top: "60px",
                            right: "0",
                            zIndex: 1000,
                        }}
                    >
                        <div className="border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800 w-80 overflow-hidden">
                            <div
                                style={{
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                }}
                                className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 py-3"
                            >
                                <span className="dark:text-gray-200 font-medium text-base">
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

                            <div className="max-h-[360px] overflow-y-auto">
                                {notificationItems.map((item) => (
                                    <div
                                        key={item.key}
                                        style={{
                                            padding: "14px 16px",
                                            margin: "4px 8px",
                                            borderRadius: "12px",
                                            background: item.read
                                                ? "rgba(255, 255, 255, 0.03)"
                                                : "rgba(16, 185, 129, 0.08)",
                                            boxShadow: item.read
                                                ? "none"
                                                : "0 2px 8px rgba(0, 0, 0, 0.1)",
                                            border: `1px solid ${
                                                item.read
                                                    ? "rgba(255, 255, 255, 0.05)"
                                                    : "rgba(16, 185, 129, 0.15)"
                                            }`,
                                        }}
                                        className={`relative rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200`}
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
                                                    width: "38px",
                                                    height: "38px",
                                                    borderRadius: "10px",
                                                    background: `${
                                                        isDark
                                                            ? "rgba(255, 255, 255, 0.1)"
                                                            : "rgba(0, 0, 0, 0.1)"
                                                    }`,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "16px",
                                                    boxShadow:
                                                        "0 2px 6px rgba(0, 0, 0, 0.1)",
                                                    border: `1px solid rgba(255, 255, 255, 0.1)`,
                                                }}
                                            >
                                                {getNotificationIcon(item.type)}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div
                                                    style={{
                                                        fontWeight: item.read
                                                            ? "500"
                                                            : "600",
                                                        color: `${
                                                            isDark
                                                                ? "#ffffff"
                                                                : "#111827"
                                                        }`,
                                                        fontSize: "14px",
                                                        marginBottom: "4px",
                                                        lineHeight: "1.3",
                                                    }}
                                                >
                                                    {item.label}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "13px",
                                                        color: `${
                                                            isDark
                                                                ? "#ffffff"
                                                                : "#111827"
                                                        }`,
                                                        marginBottom: "6px",
                                                        lineHeight: "1.4",
                                                    }}
                                                >
                                                    {item.description}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                        color: `${
                                                            isDark
                                                                ? "rgba(255, 255, 255, 0.4)"
                                                                : "rgba(0, 0, 0, 0.4)"
                                                        }`,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                    }}
                                                >
                                                    <ClockCircleOutlined
                                                        style={{
                                                            fontSize: "11px",
                                                        }}
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
                                                        background:
                                                            primaryColor,
                                                        position: "absolute",
                                                        top: "16px",
                                                        right: "16px",
                                                        boxShadow: `0 0 0 3px rgba(16, 185, 129, 0.2)`,
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div
                                style={{
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
