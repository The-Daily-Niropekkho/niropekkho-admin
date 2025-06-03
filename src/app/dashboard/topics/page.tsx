/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import TopicEditCreateModal from "@/components/features/topic/create-edit-modal";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import { useDebounced } from "@/hooks/use-debounce";
import { useGetAllCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import {
    useDeleteTopicMutation,
    useGetAllTopicsQuery,
} from "@/redux/features/topic/topicApi";
import { Category, TArgsParam, TError, Topic } from "@/types";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Input,
    message,
    Popconfirm,
    Row,
    Space,
    Tag,
    Tooltip,
} from "antd";
import { useState } from "react";

export default function TopicsPage() {
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [status, setStatus] = useState<string | undefined>(undefined);

    const { data: categories } = useGetAllCategoriesQuery({ limit: 9999 });

    const query: TArgsParam = {};
    query["page"] = page;
    query["limit"] = limit;
    query["sortBy"] = sortBy;
    query["sortOrder"] = sortOrder;
    query["status"] = status;

    const debouncedSearchTerm = useDebounced({
        searchQuery: searchText,
        delay: 600,
    });
    if (!!debouncedSearchTerm) {
        query["searchTerm"] = debouncedSearchTerm;
    }

    const {
        data: topics,
        isLoading: isTopicLoading,
        isFetching: isTopicFetching,
    } = useGetAllTopicsQuery(query);

    const [deleteTopic, { isLoading: isDeleting }] = useDeleteTopicMutation();

    const handleEdit = (record: Topic) => {
        setEditingTopic(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (record: Topic) => {
        try {
            await deleteTopic(record?.id).unwrap();
            message.success(`${record?.title} has been deleted`);
        } catch (error) {
            message.error((error as TError)?.data?.message);
        }
    };

    const handleCreate = () => {
        setEditingTopic(null);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: true,
            render: (text: string) => (
                <div style={{ fontWeight: 500 }}>{text}</div>
            ),
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
            sorter: true,
        },
        {
            title: "Parent Category",
            dataIndex: "category_id",
            key: "category_id",
            render: (categoryId: string) => {
                const category = categories?.data?.find(
                    (cat: Category) => cat.id === categoryId
                );
                return category?.title || "N/A";
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "active" ? "success" : "default"}>
                    {status.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: "Active", value: "active" },
                { text: "Inactive", value: "inactive" },
            ],
            onFilter: (value: any, record: Topic) => record.status === value,
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
            render: (createdAt: string) =>
                new Date(createdAt).toLocaleDateString() || "-",
        },
        {
            title: "Updated At",
            dataIndex: "updatedAt",
            key: "updatedAt",
            sorter: true,
            render: (updatedAt: string) =>
                new Date(updatedAt).toLocaleDateString() || "-",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Topic) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure you want to delete this topic?"
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
                    Topics
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage topics for organizing your content
                </p>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24}>
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
                                    placeholder="Search topics"
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => {
                                        setSearchText(e.target.value);
                                        setPage(1); // Reset to first page on search
                                    }}
                                    style={{ width: 250 }}
                                />
                            </Space>
                            <Space wrap>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleCreate}
                                >
                                    Add Topic
                                </Button>
                            </Space>
                        </div>

                        <Table<Topic>
                            data={topics?.data || []}
                            meta={topics?.meta ?? {}}
                            columns={columns}
                            isLoading={isTopicLoading}
                            page={page}
                            limit={limit}
                            setLimit={setLimit}
                            setPage={setPage}
                            setSortBy={setSortBy}
                            setStatus={setStatus}
                            setSortOrder={setSortOrder}
                            isFetching={isTopicFetching}
                        />
                    </Card>
                </Col>
            </Row>
            <TopicEditCreateModal
                editingTopic={editingTopic}
                open={isModalVisible}
                close={() => setIsModalVisible(false)}
            />
        </>
    );
}
