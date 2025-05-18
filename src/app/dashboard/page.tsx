/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTheme } from "@/components/theme-context";
import { Column, Pie } from "@ant-design/charts";
import {
    CommentOutlined,
    EditOutlined,
    FileTextOutlined,
    TeamOutlined,
    UserAddOutlined,
} from "@ant-design/icons";
import { Card, Col, Input, Row, Table, Tag } from "antd";

export default function DashboardPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const primaryColor = "#10b981"; // Green color for primary elements
    const secondaryColor = "#8b5cf6"; // Purple for secondary elements

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

    // Recent posts data
    const recentPosts = [
        {
            id: 1,
            title: "Breaking News: Major Political Development",
            category: "Politics",
            status: "Published",
            views: 1245,
            date: "2 hours ago",
            author: "John Doe",
        },
        {
            id: 2,
            title: "Economic Forecast for the Coming Quarter",
            category: "Business",
            status: "Published",
            views: 890,
            date: "5 hours ago",
            author: "Jane Smith",
        },
        {
            id: 3,
            title: "New Scientific Discovery Announced",
            category: "Science",
            status: "Draft",
            views: 0,
            date: "Yesterday",
            author: "Robert Johnson",
        },
        {
            id: 4,
            title: "Local Sports Team Wins Championship",
            category: "Sports",
            status: "Published",
            views: 2100,
            date: "2 days ago",
            author: "Michael Brown",
        },
        {
            id: 5,
            title: "Celebrity Interview: Behind the Scenes",
            category: "Entertainment",
            status: "Review",
            views: 0,
            date: "2 days ago",
            author: "Sarah Wilson",
        },
    ];

    // Popular posts data
    const popularPosts = [
        {
            id: 101,
            title: "10 Tips for Healthy Living That Actually Work",
            category: "Health",
            views: 15245,
            date: "1 week ago",
            author: "Dr. Emily Chen",
            image: "/healthy-living-tips.png",
            comments: 187,
            likes: 2453,
            shares: 892,
        },
        {
            id: 102,
            title: "The Future of Artificial Intelligence in Healthcare",
            category: "Technology",
            views: 12890,
            date: "2 weeks ago",
            author: "Prof. David Miller",
            image: "/placeholder.svg?height=100&width=150&query=ai healthcare",
            comments: 156,
            likes: 1987,
            shares: 745,
        },
        {
            id: 103,
            title: "Global Climate Change: What You Need to Know",
            category: "Environment",
            views: 10567,
            date: "3 weeks ago",
            author: "Dr. Sarah Johnson",
            image: "/placeholder.svg?height=100&width=150&query=climate change",
            comments: 234,
            likes: 1876,
            shares: 1023,
        },
        {
            id: 104,
            title: "Financial Planning for Millennials: A Complete Guide",
            category: "Finance",
            views: 9876,
            date: "1 month ago",
            author: "James Wilson",
            image: "/placeholder.svg?height=100&width=150&query=financial planning",
            comments: 145,
            likes: 1543,
            shares: 687,
        },
        {
            id: 105,
            title: "The Most Anticipated Movies of the Year",
            category: "Entertainment",
            views: 8765,
            date: "1 month ago",
            author: "Lisa Thompson",
            image: "/placeholder.svg?height=100&width=150&query=upcoming movies",
            comments: 198,
            likes: 1432,
            shares: 576,
        },
    ];

    // Top reporters data
    const topReporters = [
        {
            name: "John Doe",
            avatar: "/diverse-person-portrait.png",
            articles: 156,
            views: 45600,
            rating: 4.8,
        },
        {
            name: "Jane Smith",
            avatar: "/diverse-group-conversation.png",
            articles: 132,
            views: 38900,
            rating: 4.7,
        },
        {
            name: "Robert Johnson",
            avatar: "/diverse-group-meeting.png",
            articles: 98,
            views: 29400,
            rating: 4.5,
        },
        {
            name: "Sarah Wilson",
            avatar: "/diverse-group-meeting.png",
            articles: 87,
            views: 25800,
            rating: 4.6,
        },
    ];

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text: string) => <a href="#">{text}</a>,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (category: string) => {
                let color = "";
                switch (category) {
                    case "Politics":
                        color = "blue";
                        break;
                    case "Business":
                        color = "green";
                        break;
                    case "Science":
                        color = "purple";
                        break;
                    case "Sports":
                        color = "orange";
                        break;
                    case "Entertainment":
                        color = "red";
                        break;
                    default:
                        color = "default";
                }
                return <Tag color={color}>{category}</Tag>;
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "";
                switch (status) {
                    case "Published":
                        color = "green";
                        break;
                    case "Draft":
                        color = "orange";
                        break;
                    case "Review":
                        color = "blue";
                        break;
                    default:
                        color = "default";
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: "Views",
            dataIndex: "views",
            key: "views",
            sorter: (a: any, b: any) => a.views - b.views,
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Author",
            dataIndex: "author",
            key: "author",
        },
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
        <div>
            {/* Stats Cards */}
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

            {/* Today's Stats */}
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                {todayStatsData.map((stat, index) => (
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

            {/* Performance Charts */}
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
                                            color: isDark
                                                ? "#ffffff"
                                                : "#111827",
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
                                            color: isDark
                                                ? "#ffffff"
                                                : "#111827",
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

            {/* Recent and Popular Posts Table */}
            <Row gutter={[16, 16]} style={{ margin: "16px 0px" }}>
                <Col xs={24} md={12}>
                    <Card
                        title="Recent Posts"
                        className="dashboard-card"
                        bodyStyle={{
                            padding: "0",
                            background: isDark ? "#1f2937" : "#ffffff",
                        }}
                        extra={
                            <Input type="text" placeholder="Search here ..." />
                        }
                        style={{
                            paddingLeft: 0,
                            paddingRight: 0,
                        }}
                    >
                        <Table
                            columns={columns}
                            dataSource={recentPosts}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title="Popular Posts"
                        className="dashboard-card"
                        bodyStyle={{
                            padding: "0",
                            background: isDark ? "#1f2937" : "#ffffff",
                        }}
                        extra={
                            <Input type="text" placeholder="Search here ..." />
                        }
                        style={{
                            paddingLeft: 0,
                            paddingRight: 0,
                        }}
                    >
                        <Table
                            columns={columns}
                            dataSource={popularPosts}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
