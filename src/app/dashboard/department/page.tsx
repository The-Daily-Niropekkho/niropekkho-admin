/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DepartmentEditCreateModal from "@/components/features/department/department-edit-create-modal";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import { useDebounced } from "@/hooks/use-debounce";
import {
    useDeleteDepartmentMutation,
    useGetAllDepartmentsQuery,
} from "@/redux/features/department/departmentApi";
import { Department, TArgsParam } from "@/types";
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

export default function DepartmentsPage() {
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

    const { isDark } = useTheme();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [status, setStatus] = useState<string | undefined>(undefined);

    const query: TArgsParam = {
        page,
        limit,
        sortBy,
        sortOrder,
        status,
    };

    const debouncedSearchTerm = useDebounced({
        searchQuery: searchText,
        delay: 600,
    });

    if (debouncedSearchTerm) {
        query["searchTerm"] = debouncedSearchTerm;
    }

    const {
        data: departments,
        isLoading,
        isFetching,
    } = useGetAllDepartmentsQuery(query);

    const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation();

    const handleEdit = (record: Department) => {
        setEditingDepartment(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (record: Department) => {
        try {
            await deleteDepartment(record?.id).unwrap();
            message.success(`${record?.title} has been deleted`);
        } catch (error) {
            message.error("Failed to delete department");
            console.error("Delete failed:", error);
        }
    };

    const handleCreate = () => {
        setEditingDepartment(null);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: true,
            render: (text: string) => <strong>{text}</strong>,
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
            onFilter: (value: any, record: Department) => record.status === value,
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Updated At",
            dataIndex: "updatedAt",
            key: "updatedAt",
            sorter: true,
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Department) => (
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
                            title="Are you sure you want to delete this department?"
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
                    Departments
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage your organization&apos;s departments
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
                                    placeholder="Search departments"
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
                                    Add Department
                                </Button>
                            </Space>
                        </div>

                        <Table<Department>
                            data={departments?.data || []}
                            meta={departments?.meta ?? {}}
                            columns={columns}
                            isLoading={isLoading}
                            isFetching={isFetching}
                            page={page}
                            limit={limit}
                            setPage={setPage}
                            setLimit={setLimit}
                            setSortBy={setSortBy}
                            setSortOrder={setSortOrder}
                            setStatus={setStatus}
                        />
                    </Card>
                </Col>
            </Row>

            <DepartmentEditCreateModal
                editingDepartment={editingDepartment}
                open={isModalVisible}
                close={() => setIsModalVisible(false)}
            />
        </>
    );
}
