"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Table, Tag } from "antd";
import { Card } from "../ant";
import { useTheme } from "../theme-context";

export default function RecentPosts() {
    const { isDark } = useTheme();
    // Recent posts data1
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
    return (
        <Card
            title="Recent Posts"
            className="dashboard-card"
            bodyStyle={{
                padding: "0",
                background: isDark ? "#1f2937" : "#ffffff",
            }}
            extra={<Input type="text" placeholder="Search here ..." />}
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
    );
}
