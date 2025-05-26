/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DeleteUserModal from "@/components/features/users/delete-user-modal";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import { useGetAllModeratorUserQuery } from "@/redux/features/user/userApi";
import { Admin, Moderator, User, Writer } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import {
    DeleteOutlined,
    EditOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    PhoneOutlined,
    PlusOutlined,
    SearchOutlined,
    UserOutlined
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

export default function ModeratorsPage() {
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [status, setStatus] = useState<string | undefined>(undefined);

    const { theme } = useTheme();
    const isDark = theme === "dark";

    const query = [
        { name: "searchTerm", value: searchText },
        { name: "status", value: status },
        { name: "limit", value: limit },
        { name: "page", value: page },
        { name: "sortBy", value: sortBy },
        { name: "sortOrder", value: sortOrder },
    ];

    const { data: moderatorUsers, isLoading, isFetching } =
        useGetAllModeratorUserQuery(query);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentModerator, setCurrentModerator] = useState<User | null>(null);

    // Open view modal
    const showViewModal = (moderator: User) => {
        setCurrentModerator(moderator);
        setIsViewModalVisible(true);
    };

    // Open delete confirmation modal
    const showDeleteModal = (moderator: User) => {
        setCurrentModerator(moderator);
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
            title: "Moderator",
            key: "moderator",
            render: (moderator: User) => {
                const user_type = moderator.user_type as keyof User;
                const user = moderator[user_type] as Admin | Writer | Moderator;

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
                                {moderator.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Designation",
            dataIndex: ["moderator", "designation"],
            key: "designation",
            render: (designation: string) => <span>{designation || "-"}</span>,
        },
        {
            title: "Contact",
            key: "contact",
            render: (_, moderator) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <PhoneOutlined
                            style={{
                                marginRight: 8,
                                color: "rgba(0, 0, 0, 0.45)",
                            }}
                        />
                        <span>{moderator.moderator.mobile || "-"}</span>
                    </div>
                    <div>
                        <EnvironmentOutlined
                            style={{
                                marginRight: 8,
                                color: "rgba(0, 0, 0, 0.45)",
                            }}
                        />
                        <span>
                            {moderator.moderator.address_line_one || "-"}
                        </span>
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
            render: (_, moderator) => (
                <Space>
                    <Tooltip title="View">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => showViewModal(moderator)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Link href={`/dashboard/users/edit/${moderator.id}`}>
                            <Button icon={<EditOutlined />} size="small" />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => showDeleteModal(moderator)}
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
                    All Moderators
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage and organize all Moderator users with advanced
                    filtering and sorting options.
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
                                placeholder="Search moderators by name, email, or ID"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                            />
                        </Space>
                        <Space wrap>
                            <Link href="/dashboard/users/add">
                                <Button type="primary" icon={<PlusOutlined />}>
                                    Add Moderator
                                </Button>
                            </Link>
                        </Space>
                    </div>
                    <Table<User>
                        data={moderatorUsers?.data || []}
                        meta={moderatorUsers?.meta ?? {}}
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

                {/* View Moderator Modal */}
                <Modal
                    title="Moderator Details"
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
                                currentModerator
                                    ? `/dashboard/users/edit/${currentModerator.id}`
                                    : "#"
                            }
                        >
                            <Button type="primary">Edit</Button>
                        </Link>,
                    ]}
                    width={700}
                >
                    {currentModerator && (
                        <div>
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                                <Avatar
                                    src={fileObjectToLink(
                                        currentModerator.moderator
                                            ?.profile_image
                                    )}
                                    icon={
                                        !currentModerator.moderator
                                            ?.profile_image && <UserOutlined />
                                    }
                                    size={100}
                                />
                                <div>
                                    <h2 className="text-xl font-semibold mb-1">
                                        {`${
                                            currentModerator?.moderator
                                                ?.first_name || ""
                                        } ${
                                            currentModerator?.moderator
                                                ?.last_name || ""
                                        }`}
                                    </h2>
                                    {currentModerator.moderator.nick_name && (
                                        <p className="text-gray-500 mb-1">
                                            &quot;
                                            {
                                                currentModerator.moderator
                                                    .nick_name
                                            }
                                            &quot;
                                        </p>
                                    )}
                                    <p className="mb-1">
                                        {currentModerator.user_type}
                                    </p>
                                    {getStatusTag(currentModerator.status)}
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
                                                    {currentModerator.email ||
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
                                                    {currentModerator.moderator
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
                                                    {currentModerator.moderator
                                                        .gender
                                                        ? currentModerator.moderator.gender
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          currentModerator.moderator.gender.slice(
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
                                                    {currentModerator.moderator
                                                        .date_of_birth
                                                        ? format(
                                                              new Date(
                                                                  currentModerator.moderator.date_of_birth
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
                                                    Blood Group
                                                </p>
                                                <p className="font-medium">
                                                    {currentModerator.moderator
                                                        .blood_group ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Last Login
                                                </p>
                                                <p className="font-medium">
                                                    {currentModerator.last_login
                                                        ? format(
                                                              new Date(
                                                                  currentModerator.last_login
                                                              ),
                                                              "MMMM dd, yyyy HH:mm"
                                                          )
                                                        : "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        {currentModerator.moderator.about && (
                                            <Col span={24}>
                                                <div className="mb-4">
                                                    <p className="text-gray-500 mb-1">
                                                        About
                                                    </p>
                                                    <p>
                                                        {
                                                            currentModerator
                                                                .moderator.about
                                                        }
                                                    </p>
                                                </div>
                                            </Col>
                                        )}
                                    </Row>
                                </Tabs.TabPane>

                                <Tabs.TabPane tab="Address" key="2">
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Address Line 1
                                                </p>
                                                <p className="font-medium">
                                                    {currentModerator.moderator
                                                        .address_line_one ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        {currentModerator.moderator
                                            .address_line_two && (
                                            <Col span={24}>
                                                <div className="mb-4">
                                                    <p className="text-gray-500 mb-1">
                                                        Address Line 2
                                                    </p>
                                                    <p className="font-medium">
                                                        {
                                                            currentModerator
                                                                .moderator
                                                                .address_line_two
                                                        }
                                                    </p>
                                                </div>
                                            </Col>
                                        )}
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    ZIP Code
                                                </p>
                                                <p className="font-medium">
                                                    {currentModerator.moderator
                                                        .zip_code ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Tabs.TabPane>

                                <Tabs.TabPane tab="Verification" key="3">
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Verification Type
                                                </p>
                                                <p className="font-medium">
                                                    {currentModerator.moderator
                                                        .document_type
                                                        ? currentModerator.moderator.document_type
                                                              .split("_")
                                                              .map(
                                                                  (word) =>
                                                                      word
                                                                          .charAt(
                                                                              0
                                                                          )
                                                                          .toUpperCase() +
                                                                      word.slice(
                                                                          1
                                                                      )
                                                              )
                                                              .join(" ")
                                                        : "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Document ID
                                                </p>
                                                <p className="font-medium">
                                                    {currentModerator.moderator
                                                        .document_id_no ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Email Verified
                                                </p>
                                                <p className="font-medium">
                                                    {currentModerator.is_email_verified
                                                        ? "Yes"
                                                        : "No"}
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Tabs.TabPane>

                                <Tabs.TabPane tab="Account Details" key="4">
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    User ID
                                                </p>
                                                <p className="font-medium">
                                                    {currentModerator.userUniqueId ||
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
                                                    {currentModerator.account_type ||
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
                                                    {currentModerator.createdAt
                                                        ? format(
                                                              new Date(
                                                                  currentModerator.createdAt
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
                                                    {currentModerator.updatedAt
                                                        ? format(
                                                              new Date(
                                                                  currentModerator.updatedAt
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
                    user={currentModerator as User}
                />
            </div>
        </>
    );
}
