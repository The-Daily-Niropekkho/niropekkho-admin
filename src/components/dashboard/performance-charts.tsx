"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetChartDataQuery } from "@/redux/features/dashboard/dashboardApi";
import { Column, Pie } from "@ant-design/charts";
import { Card, Col, Row } from "antd";
import { useTheme } from "../theme-context";

export default function PerformanceCharts() {
    const { isDark } = useTheme();
    const primaryColor = "#10b981"; // Green
    const secondaryColor = "#8b5cf6"; // Purple

    const { data, isLoading } = useGetChartDataQuery({});

    // Dynamic month name labels
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Bar chart data from API
    const barData = data?.monthlyViewer?.map((item: { month_num: number; view_count: number }) => {
        const monthLabel = `${monthNames[item.month_num - 1]}`;
        return {
            month: monthLabel,
            value: item.view_count,
        };
    }) ?? [];

    // Pie chart data from API
    const pieData = data?.lastWeek
        ? [
            { type: "Views", value: data.lastWeek.view },
            { type: "Shares", value: data.lastWeek.share },
        ]
        : [];

    const pieConfig = {
        appendPadding: 10,
        data: pieData,
        angleField: "value",
        colorField: "type",
        radius: 0.8,
        innerRadius: 0.5,
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
                formatter: () => `total\n${(data?.lastWeek?.view ?? 0) + (data?.lastWeek?.share ?? 0)}`,
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
                        stroke: "#e5e7eb",
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
                name: "Views",
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
        !isLoading && (
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
                    >
                        <Column {...barConfig} />
                    </Card>
                </Col>
            </Row>
        )
    );
}
