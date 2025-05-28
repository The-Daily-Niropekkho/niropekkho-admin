/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import CustomImage from "@/components/ui/image";
import config from "@/config";
import { useDebounced } from "@/hooks/use-debounce";
import {
    useDeleteBreakingNewsMutation,
    useGetAllBreakingNewsQuery,
    useUpdateBreakingNewsMutation,
} from "@/redux/features/news/breakingNewsApi";
import { BreakingNews, TArgsParam, TError } from "@/types";
import {
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Input,
    message,
    Popconfirm,
    Space,
    Switch,
    Tag,
    Tooltip,
} from "antd";
import Link from "next/link";
import { useState } from "react";

export default function AllNewsPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("is_top_breaking_news");
    const [sortOrder, setSortOrder] = useState("desc");

    const query: TArgsParam = {};
    query["page"] = page;
    query["limit"] = limit;
    query["fields"] =
        "id,news(headline,category_id,slug,banner_image,media_type,category(title,)),is_top_breaking_news,status,createdAt,updatedAt";
    query["sortBy"] = sortBy;
    query["sortOrder"] = sortOrder;

    const [deleteNews, { isLoading: isDeleting }] =
        useDeleteBreakingNewsMutation();
    const [updateNews, { isLoading: isUpdating }] =
        useUpdateBreakingNewsMutation();

    const handleDelete = async (record: BreakingNews) => {
        try {
            await deleteNews(record?.id).unwrap();
            message.success(`${record?.news?.headline} has been deleted`);
        } catch (error) {
            message.error((error as TError)?.data?.message);
            console.error("Delete failed:", error);
        }
    };

    const handleStatusChange = async (record: BreakingNews) => {
        try {
            await updateNews({
                id: record.id,
                data: {
                    status: record.status === "active" ? "inactive" : "active",
                },
            }).unwrap();
            message.success("Status updated successfully");
        } catch (error) {
            message.error((error as TError)?.data?.message);
        }
    };

    const handleTopBreakingChange = async (record: BreakingNews) => {
        try {
            await updateNews({
                id: record.id,
                data: {
                    is_top_breaking_news: !record.is_top_breaking_news,
                },
            }).unwrap();
            message.success("Top breaking status updated");
        } catch (error) {
            message.error((error as TError)?.data?.message);
        }
    };
    const debouncedSearchTerm = useDebounced({
        searchQuery: searchText,
        delay: 600,
    });
    if (!!debouncedSearchTerm) {
        query["searchTerm"] = debouncedSearchTerm;
    }

    const {
        data: news,
        isLoading: isNewsLoading,
        isFetching: isNewsFetching,
    } = useGetAllBreakingNewsQuery(query);

    const columns: {
        title: string;
        dataIndex: string;
        key: string;
        render?: (text: any, record: BreakingNews) => JSX.Element | string;
        sorter?: (a: BreakingNews, b: BreakingNews) => number;
    }[] = [
        {
            title: "Thumbnail",
            dataIndex: "banner_image",
            key: "banner_image",
            render: (_text, record) => (
                <CustomImage
                    src={record?.news?.banner_image}
                    width={80}
                    height={80}
                />
            ),
        },
        {
            title: "Headline",
            dataIndex: "headline",
            key: "headline",
            render: (_text, record) => (
                <Link
                    href={`${config?.host_front}/${record?.news?.category?.slug}/${record?.id}/${record?.news?.slug}`}
                    target="_blank"
                    style={{ maxWidth: "300px", display: "block" }}
                >
                    {record?.news?.headline}
                </Link>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (_text, record) => (
                <Tag>{record?.news?.category?.title}</Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_text, record) => (
                <Popconfirm
                    title={`Are you sure you want to mark as ${
                        record.status === "active" ? "inactive" : "active"
                    }?`}
                    onConfirm={() => handleStatusChange(record)}
                    okText="Yes"
                    cancelText="No"
                    disabled={isUpdating}
                >
                    <Switch
                        checked={record.status === "active"}
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        loading={isUpdating}
                    />
                </Popconfirm>
            ),
        },
        {
            title: "Top Breaking",
            dataIndex: "is_top_breaking_news",
            key: "is_top_breaking_news",
            render: (_text, record) => (
                <Popconfirm
                    title={`Mark as ${
                        record.is_top_breaking_news ? "not top" : "top"
                    } breaking?`}
                    onConfirm={() => handleTopBreakingChange(record)}
                    okText="Yes"
                    cancelText="No"
                    disabled={isUpdating}
                >
                    <Switch
                        checked={record.is_top_breaking_news}
                        checkedChildren="Yes"
                        unCheckedChildren="No"
                        loading={isUpdating}
                    />
                </Popconfirm>
            ),
        },
        {
            title: "Publish Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => new Date(createdAt).toLocaleString(),
            sorter: (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
        },
        {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_: any, record) => (
                <Space>
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
                    All Breaking News
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage and organize all breaking news with advanced
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

                <Table<BreakingNews>
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
                    isFetching={isNewsFetching}
                />
            </Card>
        </>
    );
}
