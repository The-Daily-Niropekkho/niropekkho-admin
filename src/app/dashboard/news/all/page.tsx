"use client";
import { useTheme } from "@/components/theme-context";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  FilterOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import Link from "next/link";
import { useState } from "react";

export default function AllNewsPage() {
    const [searchText, setSearchText] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Sample data
    const dataSource = Array.from({ length: 50 }, (_, i) => ({
        key: i.toString(),
        id: `NEWS-${1000 + i}`,
        title: [
            "Breaking News: Major Political Development",
            "Economic Forecast for the Coming Quarter",
            "New Scientific Discovery Announced",
            "Local Sports Team Wins Championship",
            "Celebrity Interview: Behind the Scenes",
            "Weather Alert: Storm Warning Issued",
            "Technology Giant Releases New Product",
            "Health Study Reveals Surprising Findings",
            "Education Reform Bill Passes Senate",
            "International Summit Concludes with Agreement",
        ][i % 10],
        category: [
            "Politics",
            "Business",
            "Science",
            "Sports",
            "Entertainment",
            "Weather",
            "Technology",
            "Health",
            "Education",
            "World",
        ][i % 10],
        status: ["Published", "Draft", "Review", "Scheduled", "Archived"][
            Math.floor(Math.random() * 5)
        ],
        views: Math.floor(Math.random() * 10000),
        date: new Date(
            Date.now() - Math.floor(Math.random() * 10000000000)
        ).toLocaleDateString(),
        author: [
            "John Doe",
            "Jane Smith",
            "Robert Johnson",
            "Sarah Wilson",
            "Michael Brown",
        ][Math.floor(Math.random() * 5)],
    }));

    const filteredData = dataSource.filter(
        (item) =>
            item.title.toLowerCase().includes(searchText.toLowerCase()) ||
            item.id.toLowerCase().includes(searchText.toLowerCase()) ||
            item.category.toLowerCase().includes(searchText.toLowerCase()) ||
            item.author.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleEdit = (record: any) => {
        message.info(`Editing ${record.title}`);
    };

    const handleDelete = (record: any) => {
        setSelectedRecord(record);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        message.success(`${selectedRecord.title} has been deleted`);
        setIsDeleteModalOpen(false);
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: (a: any, b: any) => a.id.localeCompare(b.id),
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text: string) => <a href="#">{text}</a>,
            sorter: (a: any, b: any) => a.title.localeCompare(b.title),
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
                    case "Weather":
                        color = "cyan";
                        break;
                    case "Technology":
                        color = "geekblue";
                        break;
                    case "Health":
                        color = "lime";
                        break;
                    case "Education":
                        color = "gold";
                        break;
                    case "World":
                        color = "magenta";
                        break;
                    default:
                        color = "default";
                }
                return <Tag color={color}>{category}</Tag>;
            },
            filters: [
                { text: "Politics", value: "Politics" },
                { text: "Business", value: "Business" },
                { text: "Science", value: "Science" },
                { text: "Sports", value: "Sports" },
                { text: "Entertainment", value: "Entertainment" },
                { text: "Weather", value: "Weather" },
                { text: "Technology", value: "Technology" },
                { text: "Health", value: "Health" },
                { text: "Education", value: "Education" },
                { text: "World", value: "World" },
            ],
            onFilter: (value: any, record: any) =>
                record.category.indexOf(value) === 0,
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
                    case "Scheduled":
                        color = "purple";
                        break;
                    case "Archived":
                        color = "gray";
                        break;
                    default:
                        color = "default";
                }
                return <Tag color={color}>{status}</Tag>;
            },
            filters: [
                { text: "Published", value: "Published" },
                { text: "Draft", value: "Draft" },
                { text: "Review", value: "Review" },
                { text: "Scheduled", value: "Scheduled" },
                { text: "Archived", value: "Archived" },
            ],
            onFilter: (value: any, record: any) =>
                record.status.indexOf(value) === 0,
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
            sorter: (a: any, b: any) =>
                new Date(a.date).getTime() - new Date(b.date).getTime(),
        },
        {
            title: "Author",
            dataIndex: "author",
            key: "author",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "1",
                                icon: <EditOutlined />,
                                label: "Edit",
                                onClick: () => handleEdit(record),
                            },
                            {
                                key: "2",
                                icon: <DeleteOutlined />,
                                label: "Delete",
                                danger: true,
                                onClick: () => handleDelete(record),
                            },
                        ],
                    }}
                    placement="bottomRight"
                    arrow
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

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
                    All News
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage and organize all news articles with advanced
                    filtering and sorting options.
                </p>
            </div>

            <Card
                variant="borderless"
                style={{
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    background: isDark ? "#1f1f1f" : "#fff",
                }}
            >
                <div
                    style={{
                        marginBottom: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 8,
                    }}
                >
                    <Space wrap>
                        <Input
                            placeholder="Search news"
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                        />
                        <Button icon={<FilterOutlined />}>Filter</Button>
                    </Space>
                    <Space wrap>
                        <Button icon={<ExportOutlined />}>Export</Button>
                        <Button type="primary" icon={<PlusOutlined />}>
                            <Link
                                href="/dashboard/news/create"
                                style={{ color: "inherit" }}
                            >
                                Create News
                            </Link>
                        </Button>
                    </Space>
                </div>
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    scroll={{ x: "max-content" }}
                />
            </Card>

            <Modal
                title="Confirm Delete"
                open={isDeleteModalOpen}
                onOk={confirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Delete"
                okButtonProps={{ danger: true }}
            >
                {selectedRecord && (
                    <p>
                        Are you sure you want to delete{" "}
                        <strong>{selectedRecord.title}</strong>? This action
                        cannot be undone.
                    </p>
                )}
            </Modal>
        </>
    );
}
