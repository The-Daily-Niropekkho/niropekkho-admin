/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CountryEditCreateModal from "@/components/features/countries/countries-edit-create-modal";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import { useDebounced } from "@/hooks/use-debounce";
import {
  useDeleteCountryMutation,
  useGetAllCountriesQuery,
} from "@/redux/features/zone/countryApi";
import { Country, TArgsParam } from "@/types";
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
import Image from "next/image";
import { useState } from "react";

export default function CountrysPage() {
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);

    const { isDark } = useTheme();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
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
        data: Countrys,
        isLoading: isCountryLoading,
        isFetching: isCountryFetching,
    } = useGetAllCountriesQuery(query);

    const [deleteCountry, { isLoading: isDeleting }] =
        useDeleteCountryMutation();

    const handleEdit = (record: Country) => {
        setEditingCountry(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (record: Country) => {
        try {
            await deleteCountry(record?.id).unwrap();
            message.success(`${record?.name} has been deleted`);
        } catch (error) {
            message.error("Failed to delete Country");
            console.error("Delete failed:", error);
        }
    };

    const handleCreate = () => {
        setEditingCountry(null);
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
            title: "Country Code",
            dataIndex: "country_code",
            key: "url",
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
            onFilter: (value: any, record: Country) => record.status === value,
        },

        {
            title: "Country ID",
            dataIndex: "id",
            key: "country_id",
            sorter: true,
        },

        {
            title: "Flag",
            dataIndex: "flag_url",
            key: "flag_url",
            sorter: true,
            render: (flag_url: string) => (
                <Image width={50} height={50} src={flag_url} alt="Flag" />
            ),
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
            render: (_: any, record: Country) => (
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
                            title="Are you sure you want to delete this Country?"
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
                    Countrys
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage Countrys for organizing your content
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
                                    placeholder="Search Countrys"
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) => {
                                        setSearchText(e.target.value);
                                        setPage(1)
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
                                    Add Country
                                </Button>
                            </Space>
                        </div>

                        <Table<Country>
                            data={Countrys?.data || []}
                            meta={Countrys?.meta ?? {}}
                            columns={columns}
                            isLoading={isCountryLoading}
                            page={page}
                            limit={limit}
                            setLimit={setLimit}
                            setPage={setPage}
                            setSortBy={setSortBy}
                            setStatus={setStatus}
                            setSortOrder={setSortOrder}
                            isFetching={isCountryFetching}
                        />
                    </Card>
                </Col>
            </Row>
            <CountryEditCreateModal
                editingCountry={editingCountry}
                open={isModalVisible}
                close={() => setIsModalVisible(false)}
            />
        </>
    );
}
