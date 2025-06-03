/* eslint-disable react-hooks/exhaustive-deps */
// app/dashboard/settings/SettingsClientPage.tsx
"use client";

import GeneralSettingsTab from "@/components/features/settings/general-tab";
import NotificationTab from "@/components/features/settings/notification-tab";
import { useTheme } from "@/components/theme-context";
import { GlobalOutlined, NotificationOutlined } from "@ant-design/icons";
import { Card, Tabs } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();

    const tabParam = searchParams.get("tab") || "general";
    const [activeTab, setActiveTab] = useState(tabParam);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("tab", key);
        router.replace(`?${newParams.toString()}`);
    };

    useEffect(() => {
        if (tabParam !== activeTab) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    return (
        <>
            <div style={{ marginBottom: 24 }}>
                <h1
                    style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        marginBottom: "8px",
                        color: isDark ? "#fff" : "#000",
                    }}
                >
                    Settings
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Configure your newspaper website and admin settings.
                </p>
            </div>

            <Card
                variant="borderless"
                style={{
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    background: isDark ? "#1f2937" : "#ffffff",
                }}
            >
                <Tabs
                    defaultActiveKey="1"
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    items={[
                        {
                            key: "general",
                            label: (
                                <span>
                                    <GlobalOutlined /> General
                                </span>
                            ),
                            children: <GeneralSettingsTab />,
                        },
                        {
                            key: "notification",
                            label: (
                                <span>
                                    <NotificationOutlined /> Notification
                                </span>
                            ),
                            children: <NotificationTab />,
                        },
                    ]}
                />
            </Card>
        </>
    );
}
