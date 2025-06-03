/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import UpazillaEditCreateModal from "@/components/features/upazillas/upazilla-edit-create-modal";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import { useDebounced } from "@/hooks/use-debounce";
import {
    useDeleteUpazillaMutation,
    useGetAllUpazillasQuery,
} from "@/redux/features/zone/upazillaApi";
import { TArgsParam, Upazilla } from "@/types";
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
import Link from "next/link";
import React, { useState } from "react";

export default function UpazillasPage() {
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUpazilla, setEditingUpazilla] = useState<Upazilla | null>(
        null
    );

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
        data: upazillas,
        isLoading: isUpazillaLoading,
        isFetching: isUpazillaFetching,
    } = useGetAllUpazillasQuery(query);

    const [deleteUpazilla, { isLoading: isDeleting }] =
        useDeleteUpazillaMutation();

    const handleEdit = (record: Upazilla) => {
        setEditingUpazilla(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (record: Upazilla) => {
        try {
            await deleteUpazilla(record?.id).unwrap();
            message.success(`${record?.name} has been deleted`);
        } catch (error) {
            message.error("Failed to delete upazilla");
            console.error("Delete failed:", error);
        }
    };

    const handleCreate = () => {
        setEditingUpazilla(null);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: true,
            render: (text: string) => (
                <div style={{ fontWeight: 500 }}>{text}</div>
            ),
        },
        {
            title: "Bangla Name",
            dataIndex: "bn_name",
            key: "bn_name",
            sorter: true,
        },
        {
            title: "URL",
            dataIndex: "url",
            key: "url",
            render: (text: string) =>
                text ? (
                    <Link
                        href={text}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: isDark ? "#40a9ff" : "#1890ff",
                            textDecoration: "none",
                            transition: "color 0.3s",
                        }}
                        onMouseEnter={(
                            e: React.MouseEvent<HTMLAnchorElement>
                        ) =>
                            (e.currentTarget.style.color = isDark
                                ? "#69b1ff"
                                : "#40a9ff")
                        }
                        onMouseLeave={(
                            e: React.MouseEvent<HTMLAnchorElement>
                        ) =>
                            (e.currentTarget.style.color = isDark
                                ? "#40a9ff"
                                : "#1890ff")
                        }
                    >
                        {text}
                    </Link>
                ) : (
                    <div style={{ color: isDark ? "#b3b3b3" : "#8c8c8c" }}>
                        -
                    </div>
                ),
        },
        {
            title: "District ID",
            dataIndex: "district_id",
            key: "district_id",
            sorter: true,
            hidden: true,
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
            onFilter: (value: any, record: Upazilla) => record.status === value,
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
            render: (createdAt: string) =>
                new Date(createdAt).toLocaleDateString() || "-",
            hidden: true,
        },
        {
            title: "Updated At",
            dataIndex: "updatedAt",
            key: "updatedAt",
            sorter: true,
            render: (updatedAt: string) =>
                new Date(updatedAt).toLocaleDateString() || "-",
            hidden: true,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Upazilla) => (
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
                            title="Are you sure you want to delete this upazilla?"
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
                    Upazillas
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage upazillas for organizing your content
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
                                    placeholder="Search upazillas"
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
                                    Add Upazilla
                                </Button>
                            </Space>
                        </div>

                        <Table<Upazilla>
                            data={upazillas?.data || []}
                            meta={upazillas?.meta ?? {}}
                            columns={columns}
                            isLoading={isUpazillaLoading}
                            page={page}
                            limit={limit}
                            setLimit={setLimit}
                            setPage={setPage}
                            setSortBy={setSortBy}
                            setStatus={setStatus}
                            setSortOrder={setSortOrder}
                            isFetching={isUpazillaFetching}
                        />
                    </Card>
                </Col>
            </Row>
            <UpazillaEditCreateModal
                editingUpazilla={editingUpazilla}
                open={isModalVisible}
                close={() => setIsModalVisible(false)}
            />
        </>
    );
}
