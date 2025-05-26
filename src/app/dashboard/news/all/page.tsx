/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import CustomImage from "@/components/ui/image";
import {
    useDeleteNewsMutation,
    useGetAllNewsQuery,
} from "@/redux/features/news/newsApi";
import { Category, News, TFileDocument, User } from "@/types";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Input,
    Popconfirm,
    Space,
    Tag,
    Tooltip,
    message,
} from "antd";
import Link from "next/link";
import { useState } from "react";

const STATUS_OPTIONS = ["draft", "scheduled", "published", "archived"];
const MEDIA_TYPE_OPTIONS = ["online", "print", "both"];

export default function AllNewsPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [mediaType, setMediaType] = useState<string | undefined>(undefined);

    const query = [
        { name: "searchTerm", value: searchText },
        { name: "status", value: status },
        { name: "media_type", value: mediaType },
        { name: "limit", value: limit },
        { name: "page", value: page },
        { name: "sortBy", value: sortBy },
        { name: "sortOrder", value: sortOrder },
    ];

    const { data: news, isLoading: isNewsLoading , isFetching: isNewsFetching } = useGetAllNewsQuery(query);

    const [deleteNews, { isLoading: isDeleting }] = useDeleteNewsMutation();

    const handleDelete = async (record: News) => {
        try {
            await deleteNews(record?.id).unwrap();
            message.success(`${record.headline} has been deleted`);
        } catch (error) {
            message.error("Failed to delete category");
            console.error("Delete failed:", error);
        }
    };

    const columns = [
        {
            title: "Thumbnail",
            dataIndex: "banner_image",
            key: "banner_image",
            render: (image: TFileDocument) => (
                <CustomImage src={image} width={80} height={80} />
            ),
        },
        {
            title: "Headline",
            dataIndex: "headline",
            key: "headline",
            render: (text: string, record: News) => (
                <Link href={`/news/${record.slug}`} target="_blank">
                    {text}
                </Link>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (category: Category) => <Tag>{category.title}</Tag>,
            onFilter: (value: any, record: News) =>
                record.category.title === value,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: STATUS_OPTIONS.map((status) => ({
                text: status[0].toUpperCase() + status.slice(1),
                value: status,
            })),
            filteredValue: status ? [status] : undefined,
            render: (status: string) => {
                const colorMap: Record<string, string> = {
                    published: "green",
                    draft: "orange",
                    scheduled: "purple",
                    archived: "gray",
                };
                return (
                    <Tag
                        color={colorMap[status] || "default"}
                        style={{ textTransform: "capitalize" }}
                    >
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: "Breaking",
            dataIndex: "is_breaking",
            key: "is_breaking",
            render: (val: boolean) => (
                <Tag color={val ? "red" : "default"}>
                    {val ? "Breaking" : "No"}
                </Tag>
            ),
        },
        {
            title: "Featured",
            dataIndex: "is_featured",
            key: "is_featured",
            render: (val: boolean) => (
                <Tag color={val ? "gold" : "default"}>
                    {val ? "Featured" : "No"}
                </Tag>
            ),
        },
        {
            title: "Media Type",
            dataIndex: "media_type",
            key: "media_type",
            filters: MEDIA_TYPE_OPTIONS.map((type) => ({
                text: type[0].toUpperCase() + type.slice(1),
                value: type,
            })),
            filteredValue: mediaType ? [mediaType] : undefined,
            render: (type: string) => (
                <Tag color="cyan" style={{ textTransform: "capitalize" }}>
                    {type}
                </Tag>
            ),
        },
        {
            title: "Publish Date",
            dataIndex: "publish_date",
            key: "publish_date",
            render: (date: string) => new Date(date).toLocaleString(),
            sorter: (a: News, b: News) =>
                new Date(a.publish_date).getTime() -
                new Date(b.publish_date).getTime(),
        },
        {
            title: "Reporter",
            dataIndex: "reporter",
            key: "reporter",
            render: (reporter: User) => {
                const user = Object.values(reporter).filter(Boolean)[0];
                return `${user?.first_name || ""} ${user?.last_name || ""}`;
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: News) => (
                <Space>
                    <Tooltip title="Edit">
                        <Link href={`/dashboard/news/edit/${record.id}`}>
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                size="small"
                            />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure you want to delete this news?"
                            onConfirm={() => handleDelete(record)}
                            okText="Yes"
                            cancelText="No"
                            placement="left"
                            disabled={record.is_deleted || isDeleting}
                        >
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                                disabled={record.is_deleted || isDeleting}
                                loading={isDeleting}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
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
                    </Space>
                    <Space wrap>
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

                <Table<News>
                    data={news?.data || []}
                    meta={news?.meta ?? {}}
                    columns={columns}
                    isLoading={isNewsLoading}
                    page={page}
                    limit={limit}
                    setLimit={setLimit}
                    setPage={setPage}
                    setSortBy={setSortBy}
                    setSortOrder={setSortOrder}
                    setStatus={setStatus}
                    setMediaType={setMediaType}
                    isFetching={isNewsFetching}
                />
            </Card>
        </>
    );
}
