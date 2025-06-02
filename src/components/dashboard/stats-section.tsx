"use client";

import { useGetStatisticsQuery } from "@/redux/features/dashboard/dashboardApi";
import {
    AppstoreOutlined,
    EditOutlined,
    FileTextOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Skeleton } from "antd";
import { useTheme } from "../theme-context";

export default function StatsDashboard() {
    const { isDark } = useTheme();
    const { data, isLoading } = useGetStatisticsQuery({});

    const statColor = (color: string, alpha = 0.1) => ({
        color,
        bgColor: `${color.replace(")", `, ${alpha})`).replace("rgb", "rgba")}`,
    });

    const statsData = [
        {
            title: "Total Posts",
            value: data?.totalPost || 0,
            icon: <FileTextOutlined />,
            ...statColor("#10b981"), // green
        },
        {
            title: "Today's Posts",
            value: data?.todayPost || 0,
            icon: <EditOutlined />,
            ...statColor("#8b5cf6"), // purple
        },
        {
            title: "Total Categories",
            value: data?.totalCategory || 0,
            icon: <AppstoreOutlined />,
            ...statColor("#3b82f6"), // blue
        },
        {
            title: "Writers",
            value:
                data?.userGroup?.find((u) => u.userType === "writer")?.count ||
                0,
            icon: <TeamOutlined />,
            ...statColor("#f59e0b"), // amber
        },
        {
            title: "Moderators",
            value:
                data?.userGroup?.find((u) => u.userType === "moderator")
                    ?.count || 0,
            icon: <TeamOutlined />,
            ...statColor("#ef4444"), // red
        },
        {
            title: "Admins",
            value:
                data?.userGroup?.find((u) => u.userType === "admin")?.count ||
                0,
            icon: <TeamOutlined />,
            ...statColor("#6366f1"), // indigo
        },
    ];

    return (
        <Row gutter={[16, 16]}>
            {statsData.map((stat, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                    <Card
                        className="dashboard-card"
                        bodyStyle={{
                            padding: "20px",
                            background: isDark ? "#1f2937" : "#ffffff",
                            borderRadius: "16px",
                            boxShadow: isDark
                                ? "0 4px 14px rgba(255, 255, 255, 0.05)"
                                : "0 4px 14px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        {isLoading ? (
                            <Skeleton active paragraph={{ rows: 1 }} />
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            color: isDark
                                                ? "rgba(255, 255, 255, 0.6)"
                                                : "rgba(0, 0, 0, 0.6)",
                                            fontSize: "14px",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        {stat.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "28px",
                                            fontWeight: "bold",
                                            color: isDark
                                                ? "#ffffff"
                                                : "#111827",
                                        }}
                                    >
                                        {stat.value.toLocaleString()}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "16px",
                                        // background: stat.bgColor,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "24px",
                                        color: stat.color,
                                        boxShadow: isDark
                                            ? "0 2px 6px rgba(255, 255, 255, 0.1)"
                                            : "0 2px 6px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    {stat.icon}
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>
            ))}
        </Row>
    );
}
