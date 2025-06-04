"use client";

import {
    CommentOutlined,
    EditOutlined,
    TeamOutlined,
    UserAddOutlined,
} from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import { useTheme } from "../theme-context";

export default function TodayStats() {
    const { isDark } = useTheme();
    const secondaryColor = "#8b5cf6"; // Purple for secondary elements

    const todayStatsData = [
        {
            title: "Today's Posts",
            value: 41,
            icon: <EditOutlined />,
            color: secondaryColor,
            bgColor: "rgba(139, 92, 246, 0.1)",
        },
        {
            title: "Today's Comments",
            value: 0,
            icon: <CommentOutlined />,
            color: "#3b82f6", // Blue
            bgColor: "rgba(59, 130, 246, 0.1)",
        },
        {
            title: "Today's Subscribers",
            value: 0,
            icon: <UserAddOutlined />,
            color: "#f59e0b", // Amber
            bgColor: "rgba(245, 158, 11, 0.1)",
        },
        {
            title: "Total Reporters",
            value: 178,
            icon: <TeamOutlined />,
            color: "#ef4444", // Red
            bgColor: "rgba(239, 68, 68, 0.1)",
        },
    ];

    return (
        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            {todayStatsData.map((stat, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                    <Card
                        className="dashboard-card"
                        styles={{
                            body: {
                                padding: "20px",
                                background: isDark ? "#1f2937" : "#ffffff",
                            },
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
