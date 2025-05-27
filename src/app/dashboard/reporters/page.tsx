/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import { GenericReporter } from "@/types";
import { TError, TFileDocument } from "@/types/global";
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
    Tooltip,
} from "antd";
import { useState } from "react";

import ReporterCreateEditModal from "@/components/features/reporters/reporter-create-edit-modal";
import CustomImage from "@/components/ui/image";
import {
    useDeleteGenericReporterMutation,
    useGetAllGenericReportersQuery,
} from "@/redux/features/reporter/reporterApi"; // hypothetical

export default function ReportersPage() {
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingReporter, setEditingReporter] =
        useState<GenericReporter | null>(null);

    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    const [reporterImage, setReporterImage] = useState<
        TFileDocument | undefined
    >(undefined);

    const query = [
        { name: "searchTerm", value: searchText },
        { name: "limit", value: limit },
        { name: "page", value: page },
        { name: "sortBy", value: sortBy },
        { name: "sortOrder", value: sortOrder },
    ];

    const {
        data: reporters,
        isLoading,
        isFetching,
    } = useGetAllGenericReportersQuery(query);

    const [deleteReporter, { isLoading: isDeleting }] =
        useDeleteGenericReporterMutation();

    const handleEdit = (record: GenericReporter) => {
        setEditingReporter(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (record: GenericReporter) => {
        try {
            await deleteReporter(record?.id).unwrap();
            message.success(`${record.name} has been deleted`);
        } catch (error) {
            message.error((error as TError)?.data?.message || "Delete failed");
        }
    };

    const handleCreate = () => {
        setEditingReporter(null);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: "Photo",
            dataIndex: "photo",
            key: "photo",
            render: (photo: TFileDocument | null) => (
                <CustomImage
                    src={photo}
                    alt="Reporter"
                    width={50}
                    height={50}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: true,
        },
        {
            title: "Designation",
            dataIndex: "designation",
            key: "designation",
            sorter: true,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: GenericReporter) => (
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
                            title="Are you sure you want to delete this reporter?"
                            onConfirm={() => handleDelete(record)}
                            okText="Yes"
                            cancelText="No"
                            placement="left"
                        >
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
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
                    Reporters
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage your list of reporters
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
                                    placeholder="Search reporters"
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
                                    Add Reporter
                                </Button>
                            </Space>
                        </div>

                        <Table<GenericReporter>
                            data={reporters?.data || []}
                            meta={reporters?.meta ?? {}}
                            columns={columns}
                            isLoading={isLoading}
                            page={page}
                            limit={limit}
                            setLimit={setLimit}
                            setPage={setPage}
                            setSortBy={setSortBy}
                            setSortOrder={setSortOrder}
                            isFetching={isFetching}
                        />
                    </Card>
                </Col>
            </Row>

            <ReporterCreateEditModal
                editingReporter={editingReporter}
                open={isModalVisible}
                close={() => setIsModalVisible(false)}
                reporterImage={reporterImage}
                setReporterImage={setReporterImage}
            />
        </>
    );
}
