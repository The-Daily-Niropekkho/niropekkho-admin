"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Input, Table, Tag } from "antd";
import { useTheme } from "../theme-context";

export default function PopularPosts() {
    const { isDark } = useTheme();

    // Popular posts data
    const popularPosts = [
        {
            id: 101,
            title: "10 Tips for Healthy Living That Actually Work",
            category: "Health",
            views: 15245,
            date: "1 week ago",
            author: "Dr. Emily Chen",
            image: "/placeholder.png",
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
            image: "/placeholder.png?height=100&width=150&query=ai healthcare",
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
            image: "/placeholder.png?height=100&width=150&query=climate change",
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
            image: "/placeholder.png?height=100&width=150&query=financial planning",
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
            image: "/placeholder.png?height=100&width=150&query=upcoming movies",
            comments: 198,
            likes: 1432,
            shares: 576,
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
            title="Popular Posts"
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
                dataSource={popularPosts}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />
        </Card>
    );
}
