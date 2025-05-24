"use client";

import DeleteUserModal from "@/components/features/users/delete-user-modal";
import { useTheme } from "@/components/theme-context";
import { useGetAllWriterUserQuery } from "@/redux/features/user/userApi";
import { User, UserTableData } from "@/types";
import {
    DeleteOutlined,
    EditOutlined,
    EnvironmentOutlined,
    ExportOutlined,
    EyeOutlined,
    FilterOutlined,
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
    Table,
    Tabs,
    Tag,
    Tooltip
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
 
export default function WritersPage() {
    const { data: writerUsers, isLoading } =
        useGetAllWriterUserQuery(undefined);
    const [searchText, setSearchText] = useState("");
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentWriter, setCurrentWriter] = useState<UserTableData | null>(
        null
    );

    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Transform data for table
    const writers: UserTableData[] =
        writerUsers?.data?.map((user: User) => ({
            ...user,
            full_name: `${user.writer.first_name} ${user.writer.last_name}`,
            profile_image_url: user.writer.profile_image?.url,
        })) || [];

    // Open view modal
    const showViewModal = (writer: UserTableData) => {
        setCurrentWriter(writer);
        setIsViewModalVisible(true);
    };

    // Open delete confirmation modal
    const showDeleteModal = (writer: UserTableData) => {
        setCurrentWriter(writer);
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
    const columns: ColumnsType<UserTableData> = [
        {
            title: "Writer",
            key: "writer",
            render: (_, writer) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                        src={writer.profile_image_url}
                        icon={!writer.profile_image_url && <UserOutlined />}
                        style={{ marginRight: 12 }}
                        size={40}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>
                            {writer.full_name}
                        </div>
                        <div
                            style={{
                                fontSize: "0.85rem",
                                color: "rgba(0, 0, 0, 0.45)",
                            }}
                        >
                            {writer.email}
                        </div>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.full_name.localeCompare(b.full_name),
        },
        {
            title: "Designation",
            dataIndex: ["writer", "designation"],
            key: "designation",
            render: (designation: string) => <span>{designation || "-"}</span>,
        },
        {
            title: "Contact",
            key: "contact",
            render: (_, writer) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <PhoneOutlined
                            style={{
                                marginRight: 8,
                                color: "rgba(0, 0, 0, 0.45)",
                            }}
                        />
                        <span>{writer.writer.mobile || "-"}</span>
                    </div>
                    <div>
                        <EnvironmentOutlined
                            style={{
                                marginRight: 8,
                                color: "rgba(0, 0, 0, 0.45)",
                            }}
                        />
                        <span>{writer.writer.address_line_one || "-"}</span>
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
            render: (_, writer) => (
                <Space>
                    <Tooltip title="View">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => showViewModal(writer)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Link href={`/dashboard/users/edit/${writer.id}`}>
                            <Button icon={<EditOutlined />} size="small" />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => showDeleteModal(writer)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];
    
    // Filter writers based on search text
    const filteredWriters = writers.filter(
        (writer) =>
            writer.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
            writer.email.toLowerCase().includes(searchText.toLowerCase()) ||
            writer.userUniqueId.toLowerCase().includes(searchText.toLowerCase())
    );
    
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
                    All Writers
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage and organize all Writer users with advanced filtering
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
                                placeholder="Search writers by name, email, or ID"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                            />
                            <Button icon={<FilterOutlined />}>Filter</Button>
                        </Space>
                        <Space wrap>
                            <Button icon={<ExportOutlined />}>Export</Button>
                            <Link href="/dashboard/users/add">
                                <Button type="primary" icon={<PlusOutlined />}>
                                    Add Writer
                                </Button>
                            </Link>
                        </Space>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredWriters}
                        rowKey="id"
                        loading={isLoading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,
                        }}
                        scroll={{ x: "max-content" }}
                    />
                </Card>

                {/* View Writer Modal */}
                <Modal
                    title="Writer Details"
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
                                currentWriter
                                    ? `/dashboard/writers/edit/${currentWriter.id}`
                                    : "#"
                            }
                        >
                            <Button type="primary">Edit</Button>
                        </Link>,
                    ]}
                    width={700}
                >
                    {currentWriter && (
                        <div>
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                                <Avatar
                                    src={currentWriter.profile_image_url}
                                    icon={
                                        !currentWriter.profile_image_url && (
                                            <UserOutlined />
                                        )
                                    }
                                    size={100}
                                />
                                <div>
                                    <h2 className="text-xl font-semibold mb-1">
                                        {currentWriter.full_name}
                                    </h2>
                                    {currentWriter.writer.nick_name && (
                                        <p className="text-gray-500 mb-1">
                                            &quot;
                                            {currentWriter.writer.nick_name}
                                            &quot;
                                        </p>
                                    )}
                                    <p className="mb-1">
                                        {currentWriter.writer.designation ||
                                            "No designation"}
                                    </p>
                                    {getStatusTag(currentWriter.status)}
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
                                                    {currentWriter.email ||
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
                                                    {currentWriter.writer
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
                                                    {currentWriter.writer.gender
                                                        ? currentWriter.writer.gender
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          currentWriter.writer.gender.slice(
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
                                                    {currentWriter.writer
                                                        .date_of_birth
                                                        ? format(
                                                              new Date(
                                                                  currentWriter.writer.date_of_birth
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
                                                    {currentWriter.writer
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
                                                    {currentWriter.last_login
                                                        ? format(
                                                              new Date(
                                                                  currentWriter.last_login
                                                              ),
                                                              "MMMM dd, yyyy HH:mm"
                                                          )
                                                        : "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        {currentWriter.writer.about && (
                                            <Col span={24}>
                                                <div className="mb-4">
                                                    <p className="text-gray-500 mb-1">
                                                        About
                                                    </p>
                                                    <p>
                                                        {
                                                            currentWriter.writer
                                                                .about
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
                                                    {currentWriter.writer
                                                        .address_line_one ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={24}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    ZIP Code
                                                </p>
                                                <p className="font-medium">
                                                    {currentWriter.writer
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
                                                    {currentWriter.writer
                                                        .document_type
                                                        ? currentWriter.writer.document_type
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
                                                    {currentWriter.writer
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
                                                    {currentWriter.is_email_verified
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
                                                    {currentWriter.userUniqueId ||
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
                                                    {currentWriter.account_type ||
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
                                                    {currentWriter.createdAt
                                                        ? format(
                                                              new Date(
                                                                  currentWriter.createdAt
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
                                                    {currentWriter.updatedAt
                                                        ? format(
                                                              new Date(
                                                                  currentWriter.updatedAt
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
                    user={currentWriter as UserTableData}
                />
            </div>
        </>
    );
}
