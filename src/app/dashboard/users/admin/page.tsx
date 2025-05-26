/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DeleteUserModal from "@/components/features/users/delete-user-modal";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import { useGetAllAdminUserQuery } from "@/redux/features/user/userApi"; // Adjust the import path as needed
import { Admin, Moderator, User, Writer } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PhoneOutlined,
    PlusOutlined,
    SearchOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Input,
    Modal,
    Row,
    Space,
    Tabs,
    Tag,
    Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";

export default function AdminsPage() {
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [status, setStatus] = useState<string | undefined>(undefined);

    const query = [
        { name: "searchTerm", value: searchText },
        { name: "status", value: status },
        { name: "limit", value: limit },
        { name: "page", value: page },
        { name: "sortBy", value: sortBy },
        { name: "sortOrder", value: sortOrder },
    ];

    const {
        data: adminUsers,
        isLoading,
        isFetching,
    } = useGetAllAdminUserQuery(query);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState<User | null>(null);

    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Open view modal
    const showViewModal = (admin: User) => {
        setCurrentAdmin(admin);
        setIsViewModalVisible(true);
    };

    // Open delete confirmation modal
    const showDeleteModal = (admin: User) => {
        setCurrentAdmin(admin);
        setIsDeleteModalVisible(true);
    };

    // Get status tag
    const getStatusTag = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return <Tag color="green">Active</Tag>;
            case "inactive":
                return <Tag color="default">Inactive</Tag>;
            case "pending":
                return <Tag color="orange">Pending</Tag>;
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    // Table columns
    const columns: ColumnsType<User> = [
        {
            title: "Admin",
            key: "admin",
            render: (admin: User) => {
                const user_type = admin.user_type as keyof User;
                const user = admin[user_type] as Admin | Writer | Moderator;

                return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                            src={fileObjectToLink(user?.profile_image ?? null)}
                            icon={!user?.profile_image && <UserOutlined />}
                            style={{ marginRight: 12 }}
                            size={40}
                        />
                        <div>
                            <div style={{ fontWeight: 500 }}>{`${
                                user?.first_name || ""
                            } ${user?.last_name || ""}`}</div>
                            <div
                                style={{
                                    fontSize: "0.85rem",
                                    color: "rgba(0, 0, 0, 0.45)",
                                }}
                            >
                                {admin.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Contact",
            key: "contact",
            render: (_, admin) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <PhoneOutlined
                            style={{
                                marginRight: 8,
                                color: "rgba(0, 0, 0, 0.45)",
                                rotate: "180deg",
                            }}
                        />
                        <span>{admin.admin.mobile || "-"}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => getStatusTag(status),
            filters: [
                { text: "Active", value: "active" },
                { text: "Inactive", value: "inactive" },
                { text: "Pending", value: "pending" },
            ],
            onFilter: (value, record) => record.status.toLowerCase() === value,
        },
        {
            title: "Verification",
            dataIndex: "is_email_verified",
            key: "is_email_verified",
            render: (is_verified: boolean) => (
                <Tag color={is_verified ? "green" : "red"}>
                    {is_verified ? "Verified" : "Not Verified"}
                </Tag>
            ),
            filters: [
                { text: "Verified", value: true },
                { text: "Not Verified", value: false },
            ],
            onFilter: (value, record) => record.is_email_verified === value,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, admin) => (
                <Space>
                    <Tooltip title="View">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => showViewModal(admin)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Link href={`/dashboard/users/edit/${admin.id}`}>
                            <Button icon={<EditOutlined />} size="small" />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => showDeleteModal(admin)}
                        />
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
                    All Admins
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage and organize all Admin users with advanced filtering
                    and sorting options.
                </p>
            </div>
            <div className="space-y-6">
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
                                placeholder="Search admins by name, email, or ID"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                            />
                        </Space>
                        <Space wrap>
                            <Link href="/dashboard/users/add">
                                <Button type="primary" icon={<PlusOutlined />}>
                                    Add Admin
                                </Button>
                            </Link>
                        </Space>
                    </div>
                    <Table<User>
                        data={adminUsers?.data || []}
                        meta={adminUsers?.meta ?? {}}
                        columns={columns}
                        isLoading={isLoading}
                        page={page}
                        limit={limit}
                        setLimit={setLimit}
                        setPage={setPage}
                        setSortBy={setSortBy}
                        setSortOrder={setSortOrder}
                        setStatus={setStatus}
                        isFetching={isFetching}
                    />
                </Card>

                {/* View Admin Modal */}
                <Modal
                    title="Admin Details"
                    open={isViewModalVisible}
                    onCancel={() => setIsViewModalVisible(false)}
                    footer={[
                        <Button
                            key="close"
                            onClick={() => setIsViewModalVisible(false)}
                        >
                            Close
                        </Button>,
                        <Link
                            key="edit"
                            href={
                                currentAdmin
                                    ? `/dashboard/users/edit/${currentAdmin.id}`
                                    : "#"
                            }
                        >
                            <Button type="primary">Edit</Button>
                        </Link>,
                    ]}
                    width={700}
                >
                    {currentAdmin && (
                        <div>
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                                <Avatar
                                    src={fileObjectToLink(
                                        currentAdmin.admin?.profile_image
                                    )}
                                    icon={
                                        !currentAdmin.admin?.profile_image && (
                                            <UserOutlined />
                                        )
                                    }
                                    size={100}
                                />
                                <div>
                                    <h2 className="text-xl font-semibold mb-1">
                                        {`${
                                            currentAdmin?.admin?.first_name ||
                                            ""
                                        } ${
                                            currentAdmin?.admin?.last_name || ""
                                        }`}
                                    </h2>
                                    {currentAdmin.admin.nick_name && (
                                        <p className="text-gray-500 mb-1">
                                            &quot;{currentAdmin.admin.nick_name}
                                            &quot;
                                        </p>
                                    )}
                                    <p className="mb-1">
                                        {currentAdmin.user_type}
                                    </p>
                                    {getStatusTag(currentAdmin.status)}
                                </div>
                            </div>

                            <Divider />

                            <Tabs defaultActiveKey="1">
                                <Tabs.TabPane tab="Basic Info" key="1">
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Email
                                                </p>
                                                <p className="font-medium">
                                                    {currentAdmin.email ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Mobile
                                                </p>
                                                <p className="font-medium">
                                                    {currentAdmin.admin
                                                        .mobile ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Gender
                                                </p>
                                                <p className="font-medium">
                                                    {currentAdmin.admin.gender
                                                        ? currentAdmin.admin.gender
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          currentAdmin.admin.gender.slice(
                                                              1
                                                          )
                                                        : "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Date of Birth
                                                </p>
                                                <p className="font-medium">
                                                    {currentAdmin.admin
                                                        .date_of_birth
                                                        ? format(
                                                              new Date(
                                                                  currentAdmin.admin.date_of_birth
                                                              ),
                                                              "MMMM dd, yyyy"
                                                          )
                                                        : "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Last Login
                                                </p>
                                                <p className="font-medium">
                                                    {currentAdmin.last_login
                                                        ? format(
                                                              new Date(
                                                                  currentAdmin.last_login
                                                              ),
                                                              "MMMM dd, yyyy HH:mm"
                                                          )
                                                        : "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Email Verified
                                                </p>
                                                <p className="font-medium">
                                                    {currentAdmin.is_email_verified
                                                        ? "Yes"
                                                        : "No"}
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Tabs.TabPane>

                                <Tabs.TabPane tab="Account Details" key="2">
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    User ID
                                                </p>
                                                <p className="font-medium">
                                                    {currentAdmin.userUniqueId ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Account Type
                                                </p>
                                                <p className="font-medium">
                                                    {currentAdmin.account_type ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Created At
                                                </p>
                                                <p className="font-medium">
                                                    {currentAdmin.createdAt
                                                        ? format(
                                                              new Date(
                                                                  currentAdmin.createdAt
                                                              ),
                                                              "MMMM dd, yyyy"
                                                          )
                                                        : "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Updated At
                                                </p>
                                                <p className="font-medium">
                                                    {currentAdmin.updatedAt
                                                        ? format(
                                                              new Date(
                                                                  currentAdmin.updatedAt
                                                              ),
                                                              "MMMM dd, yyyy"
                                                          )
                                                        : "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Tabs.TabPane>
                            </Tabs>
                        </div>
                    )}
                </Modal>

                {/* Delete Confirmation Modal */}
                <DeleteUserModal
                    open={isDeleteModalVisible}
                    close={() => setIsDeleteModalVisible(false)}
                    user={currentAdmin as User}
                />
            </div>
        </>
    );
}
