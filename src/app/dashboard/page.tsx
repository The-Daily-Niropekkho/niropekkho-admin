/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTheme } from "@/components/theme-context";
import { Area, Pie } from "@ant-design/charts";
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    BarChartOutlined,
    CommentOutlined,
    EditOutlined,
    EyeOutlined,
    FileTextOutlined,
    LineChartOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserAddOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    List,
    Progress,
    Row,
    Table,
    Tag,
    Tooltip,
} from "antd";

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
    const areaData = [
        { month: "Jun 2024", value: 0 },
        { month: "Jul 2024", value: 0 },
        { month: "Aug 2024", value: 0 },
        { month: "Sep 2024", value: 0 },
        { month: "Oct 2024", value: 0 },
        { month: "Nov 2024", value: 0 },
        { month: "Dec 2024", value: 0 },
        { month: "Jan 2025", value: 18000 },
        { month: "Feb 2025", value: 32000 },
        { month: "Mar 2025", value: 52000 },
        { month: "Apr 2025", value: 38000 },
        { month: "May 2025", value: 15000 },
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
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <Tooltip title="View">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    const pieConfig = {
        data: pieData,
        angleField: "value",
        colorField: "type",
        radius: 0.8,
        innerRadius: 0.6,
        label: {
            type: "outer",
            content: "{name} {percentage}",
        },
        interactions: [{ type: "element-active" }],
        legend: {
            position: "bottom",
        },
        color: [primaryColor, secondaryColor],
        statistic: {
            title: {
                style: {
                    color: isDark ? "#ffffff" : "#000000",
                },
                content: "Performance",
            },
            content: {
                style: {
                    color: isDark ? "#ffffff" : "#000000",
                },
            },
        },
    };

    const areaConfig = {
        data: areaData,
        xField: "month",
        yField: "value",
        smooth: true,
        areaStyle: {
            fill: `l(270) 0:${
                isDark ? "rgba(16, 185, 129, 0.01)" : "rgba(16, 185, 129, 0.01)"
            } 1:${
                isDark ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.3)"
            }`,
        },
        line: {
            color: primaryColor,
        },
        xAxis: {
            label: {
                style: {
                    fill: isDark
                        ? "rgba(255, 255, 255, 0.65)"
                        : "rgba(0, 0, 0, 0.65)",
                },
            },
        },
        yAxis: {
            label: {
                style: {
                    fill: isDark
                        ? "rgba(255, 255, 255, 0.65)"
                        : "rgba(0, 0, 0, 0.65)",
                },
            },
        },
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
                                    {stat.change > 0 && (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                color: "#10b981",
                                                fontSize: "13px",
                                                marginTop: "4px",
                                            }}
                                        >
                                            <ArrowUpOutlined /> {stat.change}%
                                            from last month
                                        </div>
                                    )}
                                    {stat.change < 0 && (
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                color: "#ef4444",
                                                fontSize: "13px",
                                                marginTop: "4px",
                                            }}
                                        >
                                            <ArrowDownOutlined />{" "}
                                            {Math.abs(stat.change)}% from last
                                            month
                                        </div>
                                    )}
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
                <Col xs={24} md={12}>
                    <Card
                        title="Last Week Performance"
                        className="dashboard-card"
                        bodyStyle={{
                            padding: "20px",
                            background: isDark ? "#1f2937" : "#ffffff",
                            height: "380px",
                        }}
                    >
                        <Pie {...pieConfig} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title="Performance Overview"
                        className="dashboard-card"
                        bodyStyle={{
                            padding: "20px",
                            background: isDark ? "#1f2937" : "#ffffff",
                            height: "380px",
                        }}
                        extra={
                            <div style={{ display: "flex", gap: "8px" }}>
                                <Button
                                    type="text"
                                    icon={<BarChartOutlined />}
                                    size="small"
                                />
                                <Button
                                    type="text"
                                    icon={<LineChartOutlined />}
                                    size="small"
                                />
                                <Button
                                    type="text"
                                    icon={<PieChartOutlined />}
                                    size="small"
                                />
                            </div>
                        }
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "16px",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: "14px",
                                        color: isDark
                                            ? "rgba(255, 255, 255, 0.6)"
                                            : "rgba(0, 0, 0, 0.6)",
                                    }}
                                >
                                    Posts
                                </div>
                                <div
                                    style={{
                                        fontSize: "24px",
                                        fontWeight: "bold",
                                        color: isDark ? "#ffffff" : "#111827",
                                    }}
                                >
                                    13902
                                </div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: "14px",
                                        color: isDark
                                            ? "rgba(255, 255, 255, 0.6)"
                                            : "rgba(0, 0, 0, 0.6)",
                                    }}
                                >
                                    Read Hit
                                </div>
                                <div
                                    style={{
                                        fontSize: "24px",
                                        fontWeight: "bold",
                                        color: isDark ? "#ffffff" : "#111827",
                                    }}
                                >
                                    168125
                                </div>
                            </div>
                        </div>
                        <Area {...areaConfig} />
                    </Card>
                </Col>
            </Row>

            {/* Recent Posts Table */}
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col span={24}>
                    <Card
                        title="Recent Posts"
                        className="dashboard-card"
                        bodyStyle={{
                            padding: "0",
                            background: isDark ? "#1f2937" : "#ffffff",
                        }}
                        extra={
                            <Button type="primary" icon={<EditOutlined />}>
                                Create New Post
                            </Button>
                        }
                    >
                        <Table
                            columns={columns}
                            dataSource={recentPosts}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Top Reporters */}
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col span={24}>
                    <Card
                        title="Top Reporters"
                        className="dashboard-card"
                        bodyStyle={{
                            padding: "20px",
                            background: isDark ? "#1f2937" : "#ffffff",
                        }}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={topReporters}
                            renderItem={(item, index) => (
                                <List.Item
                                    actions={[
                                        <Button key="view" type="link">
                                            View Profile
                                        </Button>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                src={item.avatar}
                                                size={48}
                                            />
                                        }
                                        title={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        marginRight: "8px",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {item.name}
                                                </span>
                                                <Tag
                                                    color={
                                                        index === 0
                                                            ? "gold"
                                                            : index === 1
                                                            ? "silver"
                                                            : index === 2
                                                            ? "bronze"
                                                            : "default"
                                                    }
                                                >
                                                    {index === 0
                                                        ? "Top"
                                                        : `#${index + 1}`}
                                                </Tag>
                                            </div>
                                        }
                                        description={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "4px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "16px",
                                                    }}
                                                >
                                                    <span>
                                                        <FileTextOutlined
                                                            style={{
                                                                marginRight:
                                                                    "4px",
                                                            }}
                                                        />
                                                        {item.articles} Articles
                                                    </span>
                                                    <span>
                                                        <EyeOutlined
                                                            style={{
                                                                marginRight:
                                                                    "4px",
                                                            }}
                                                        />
                                                        {item.views.toLocaleString()}{" "}
                                                        Views
                                                    </span>
                                                    <span>
                                                        <span
                                                            style={{
                                                                color: "#f59e0b",
                                                            }}
                                                        >
                                                            ★
                                                        </span>{" "}
                                                        {item.rating} Rating
                                                    </span>
                                                </div>
                                                <Progress
                                                    percent={Math.round(
                                                        (item.articles / 200) *
                                                            100
                                                    )}
                                                    showInfo={false}
                                                    strokeColor={primaryColor}
                                                    size="small"
                                                />
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
