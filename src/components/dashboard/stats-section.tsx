"use client";

import { CommentOutlined, FileTextOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import { useTheme } from "../theme-context";

export default function StatsSection() {
    const { isDark } = useTheme();
    const primaryColor = "#10b981"; // Green color for primary elements
    
    // Stats data
    const statsData = [
        {
            title: "Total Posts",
            value: 13943,
            icon: <FileTextOutlined />,
            color: primaryColor,
            bgColor: "rgba(16, 185, 129, 0.1)",
            change: 5.2,
            changeType: "increase",
        },
        {
            title: "Total Comments",
            value: 5,
            icon: <CommentOutlined />,
            color: "#3b82f6", // Blue
            bgColor: "rgba(59, 130, 246, 0.1)",
            change: 2.1,
            changeType: "increase",
        },
        {
            title: "Total Subscribers",
            value: 0,
            icon: <UserAddOutlined />,
            color: "#f59e0b", // Amber
            bgColor: "rgba(245, 158, 11, 0.1)",
            change: 0,
            changeType: "neutral",
        },
        {
            title: "Total Users",
            value: 2,
            icon: <TeamOutlined />,
            color: "#ef4444", // Red
            bgColor: "rgba(239, 68, 68, 0.1)",
            change: 0,
            changeType: "neutral",
        },
    ];

    return (
        <Row gutter={[16, 16]}>
            {statsData.map((stat, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                    <Card
                        className="dashboard-card"
                        bodyStyle={{
                            padding: "20px",
                            background: isDark ? "#1f2937" : "#ffffff",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
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
                                        color: isDark ? "#ffffff" : "#111827",
                                    }}
                                >
                                    {stat.value.toLocaleString()}
                                </div>
                            </div>
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "12px",
                                    background: stat.bgColor,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "24px",
                                    color: stat.color,
                                }}
                            >
                                {stat.icon}
                            </div>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}
