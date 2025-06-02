/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import SubcategoryEditCreateModal from "@/components/features/sub-categories/sub-category-edit-create-modal";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import { useDebounced } from "@/hooks/use-debounce";
import {
    useGetAllCategoriesQuery,
} from "@/redux/features/categories/categoriesApi";
import {
    useDeleteSubcategoryMutation,
    useGetAllSubcategoriesQuery,
} from "@/redux/features/categories/subcategoriesApi";
import { Category, Subcategory, TArgsParam, TFileDocument } from "@/types";
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

export default function SubcategoriesPage() {
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
    const [subcategoryImage, setSubcategoryImage] = useState<TFileDocument | undefined>(undefined);

    const { isDark } = useTheme();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [status, setStatus] = useState<string | undefined>(undefined);

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
        data: subcategories,
        isLoading: isLoadingSubcategories,
        isFetching: isFetchingSubcategories,
    } = useGetAllSubcategoriesQuery(query);

    const { data: categories } = useGetAllCategoriesQuery({ limit: 9999 });

    const [deleteSubcategory, { isLoading: isDeleting }] = useDeleteSubcategoryMutation();

    const handleEdit = (record: Subcategory) => {
        setEditingSubcategory(record);
        setSubcategoryImage(record.image ?? undefined);
        setIsModalVisible(true);
    };

    const handleDelete = async (record: Subcategory) => {
        try {
            await deleteSubcategory(record?.id).unwrap();
            message.success(`${record?.title} has been deleted`);
        } catch (error) {
            message.error("Failed to delete subcategory");
            console.error("Delete failed:", error);
        }
    };

    const handleCreate = () => {
        setEditingSubcategory(null);
        setSubcategoryImage(undefined);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: true,
            render: (text: string) => <div style={{ fontWeight: 500 }}>{text}</div>,
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
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "active" ? "success" : "default"}>
                    {status?.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: "Active", value: "active" },
                { text: "Inactive", value: "inactive" },
            ],
            onFilter: (value: any, record: Subcategory) => record.status === value,
        },
        {
            title: "Parent Category",
            dataIndex: "category_id",
            key: "category_id",
            render: (categoryId: string) => {
                const category = categories?.data?.find((cat: Category) => cat.id === categoryId);
                return category?.title || "N/A";
            },
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
            render: (_: any, record: Subcategory) => (
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
                            title="Are you sure you want to delete this subcategory?"
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
                    Subcategories
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage subcategories and link them to parent categories
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
                                    placeholder="Search subcategories"
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => {
                                        setSearchText(e.target.value);
                                        setPage(1);
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
                                    Add Subcategory
                                </Button>
                            </Space>
                        </div>

                        <Table<Subcategory>
                            data={subcategories?.data || []}
                            meta={subcategories?.meta ?? {}}
                            columns={columns}
                            isLoading={isLoadingSubcategories}
                            page={page}
                            limit={limit}
                            setLimit={setLimit}
                            setPage={setPage}
                            setSortBy={setSortBy}
                            setStatus={setStatus}
                            setSortOrder={setSortOrder}
                            isFetching={isFetchingSubcategories}
                        />
                    </Card>
                </Col>
            </Row>

            <SubcategoryEditCreateModal
                editingSubcategory={editingSubcategory}
                open={isModalVisible}
                subcategoryImage={subcategoryImage}
                setSubcategoryImage={setSubcategoryImage}
                close={() => setIsModalVisible(false)}
            />
        </>
    );
}
