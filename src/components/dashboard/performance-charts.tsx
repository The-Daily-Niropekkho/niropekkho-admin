"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, Pie } from "@ant-design/charts";
import { Card, Col, Row } from "antd";
import { useTheme } from "../theme-context";

export default function PerformanceCharts() {
    const { isDark } = useTheme();
    const primaryColor = "#10b981"; // Green color for primary elements
    const secondaryColor = "#8b5cf6"; // Purple for secondary elements

    // Performance data for pie chart
    const pieData = [
        { type: "Posts", value: 9.7 },
        { type: "Read Hit", value: 90.3 },
    ];

    // Performance data for area chart
    const barData = [
        { month: "Jun-2024", value: 0 },
        { month: "Jul-2024", value: 39000 },
        { month: "Aug-2024", value: 50000 },
        { month: "Sep-2024", value: 0 },
        { month: "Oct-2024", value: 0 },
        { month: "Nov-2024", value: 0 },
        { month: "Dec-2024", value: 0 },
        { month: "Jan-2025", value: 18000 },
        { month: "Feb-2025", value: 32000 },
        { month: "Mar-2025", value: 92000 },
        { month: "Apr-2025", value: 38000 },
        { month: "May-2025", value: 15000 },
    ];

    const pieConfig = {
        appendPadding: 10,
        data: pieData,
        angleField: "value",
        colorField: "type",
        radius: 0.8,
        innerRadius: 0.5,
        // label: {
        //     type: "inner",
        //     offset: "-50%",
        //     content: "{value}",
        //     style: {
        //         textAlign: "center",
        //         fontSize: 14,
        //     },
        // },
        // label: {
        //     type: "inner",
        //     offset: "-50%",
        //     content: ({ percent } : {percent : number}) => `${(percent * 100).toFixed(0)}%`,
        //     style: {
        //         fontSize: 14,
        //         textAlign: "center",
        //     },
        // },
        interactions: [
            { type: "element-selected" },
            { type: "element-active" },
        ],
        legend: {
            position: "bottom",
        },
        color: [primaryColor, secondaryColor],
        statistic: {
            title: false as const,
            content: {
                style: {
                    whiteSpace: "pre-wrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                },
                formatter: function formatter() {
                    return `total\n134`;
                },
            },
        },
        theme: isDark ? "dark" : "light",
    };

    const barConfig = {
        data: barData,
        xField: "month",
        yField: "value",
        legend: false,
        columnStyle: {
            fill: primaryColor,
            radius: [4, 4, 0, 0],
        },
        widthRatio: 0.6,
        xAxis: {
            title: null,
            label: {
                autoRotate: false,
                rotate: -45,
                style: {
                    fill: isDark ? "rgba(255, 255, 255, 0.65)" : "#4B5563",
                    fontSize: 12,
                },
            },
            grid: {
                line: {
                    style: {
                        stroke: "#e5e7eb", // Tailwind gray-200
                        lineDash: [4, 4],
                    },
                },
            },
        },
        yAxis: {
            title: {
                text: "Performance",
                style: {
                    fill: isDark ? "#fff" : "#111827",
                    fontSize: 14,
                    fontWeight: 600,
                },
            },
            label: {
                formatter: (val: number) => val.toLocaleString(),
                style: {
                    fill: isDark ? "#d1d5db" : "#4B5563",
                    fontSize: 12,
                },
            },
            grid: {
                line: {
                    style: {
                        stroke: "#e5e7eb",
                    },
                },
            },
        },
        tooltip: {
            title: "Month",
            formatter: (datum: any) => ({
                name: "Value",
                value: datum.value.toLocaleString(),
            }),
        },
        theme: isDark ? "dark" : "light",
        interactions: [{ type: "active-region" }],
        animation: {
            appear: {
                animation: "scale-in-y",
                duration: 600,
            },
        },
        appendPadding: [20, 20, 20, 20],
    };

    return (
        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
            <Col xs={24} md={8}>
                <Card
                    title="Last Week Performance"
                    className="dashboard-card"
                    style={{
                        padding: "10px 5px",
                        background: isDark ? "#1f2937" : "#ffffff",
                        height: "580px",
                    }}
                >
                    <Pie {...pieConfig} />
                </Card>
            </Col>
            <Col xs={24} md={16}>
                <Card
                    title="Performance Overview"
                    className="dashboard-card"
                    style={{
                        padding: "10px 5px",
                        background: isDark ? "#1f2937" : "#ffffff",
                        height: "580px",
                    }}
                    extra={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 15,
                            }}
                        >
                            <div>
                                <h3
                                    style={{
                                        fontSize: "14px",
                                        color: isDark
                                            ? "rgba(255, 255, 255, 0.6)"
                                            : "rgba(0, 0, 0, 0.6)",
                                        textAlign: "right",
                                        marginBottom: 0,
                                    }}
                                >
                                    Posts
                                </h3>
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: 500,
                                        color: isDark ? "#ffffff" : "#111827",
                                    }}
                                >
                                    13902
                                </span>
                            </div>
                            <div>
                                <h3
                                    style={{
                                        fontSize: "14px",
                                        color: isDark
                                            ? "rgba(255, 255, 255, 0.6)"
                                            : "rgba(0, 0, 0, 0.6)",
                                        textAlign: "right",
                                        marginBottom: 0,
                                    }}
                                >
                                    Read Hit
                                </h3>
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: 500,
                                        color: isDark ? "#ffffff" : "#111827",
                                    }}
                                >
                                    168125
                                </span>
                            </div>
                        </div>
                    }
                >
                    <Column {...barConfig} />
                </Card>
            </Col>
        </Row>
    );
}
