/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CategoryEditCreateModal from "@/components/features/categories/category-edit-create-modal";
import { useTheme } from "@/components/theme-context";
import {
    useDeleteCategoryMutation,
    useGetAllCategoriesQuery
} from "@/redux/features/categories/categoriesApi";
import { Category, TFileDocument } from "@/types";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined
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
    Table,
    Tag,
    Tooltip
} from "antd";
import { useState } from "react";

export default function CategoriesPage() {
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );

    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    
    const [categoryImage, setCategoryImage] = useState<TFileDocument | undefined>(
        undefined
    );

    const query = [
        { name: "searchTerm", value: searchText },
        { name: "limit", value: limit },
        { name: "page", value: page },
        { name: "sortBy", value: sortBy },
        { name: "sortOrder", value: sortOrder },
    ];

    const { data: categories, isLoading: isCategoryLoading } =
        useGetAllCategoriesQuery(query);

    const [deleteCategory, { isLoading: isDeleting }] =
        useDeleteCategoryMutation();

    const handleEdit = (record: Category) => {
        setEditingCategory(record);
        setCategoryImage(record.image ?? undefined);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(id).unwrap();
            message.success(`Category with ID ${id} has been deleted`);
        } catch (error) {
            message.error("Failed to delete category");
            console.error("Delete failed:", error);
        }
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setCategoryImage(undefined);
        setIsModalVisible(true);
    };

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setPage(pagination.current);
        setLimit(pagination.pageSize);
        if (sorter.field && sorter.order) {
            setSortBy(sorter.field);
            setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
        } else {
            setSortBy("createdAt");
            setSortOrder("desc");
        }
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
            title: "Position",
            dataIndex: "position",
            key: "position",
            sorter: true,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text: string) => text || "-",
        },
        {
            title: "Meta Title",
            dataIndex: "meta_title",
            key: "meta_title",
            render: (text: string) => text || "-",
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
            onFilter: (value: any, record: Category) => record.status === value,
        },
        {
            title: "News Count",
            dataIndex: "news",
            key: "news",
            sorter: true,
            render: (news: any[]) => news?.length || 0,
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
            render: (_: any, record: Category) => (
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
                            title="Are you sure you want to delete this category?"
                            onConfirm={() => handleDelete(record.id)}
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
                    Categories
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage categories for organizing your content
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
                                    placeholder="Search categories"
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
                                    Add Category
                                </Button>
                            </Space>
                        </div>
                        <Table
                            dataSource={categories?.data}
                            columns={columns}
                            loading={isCategoryLoading}
                            rowKey="title"
                            pagination={{
                                current: page,
                                pageSize: limit,
                                total: categories?.meta?.total || 0,
                                showSizeChanger: true,
                                pageSizeOptions: ["10", "20", "50"],
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} items`,
                            }}
                            onChange={handleTableChange}
                            scroll={{ x: "max-content" }}
                        />
                    </Card>
                </Col>
            </Row>
            <CategoryEditCreateModal
                editingCategory={editingCategory}
                open={isModalVisible}
                categoryImage={categoryImage}
                setCategoryImage={setCategoryImage}
                close={() => setIsModalVisible(false)}

            />
        </>
    );
}
