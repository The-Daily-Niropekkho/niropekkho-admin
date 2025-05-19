"use client";

import type React from "react";

import { Table } from "@/components/ant/table";
import { useTheme } from "@/components/theme-context";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    ExportOutlined,
    FilterOutlined,
    LockOutlined,
    MailOutlined,
    PlusOutlined,
    SearchOutlined,
    StopOutlined,
    UnlockOutlined,
    UserOutlined
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Dropdown,
    Input,
    Modal,
    Space,
    Tag,
    Tooltip,
    message
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { useState } from "react";
import type { UserFormData, UserRole, UserStatus } from "./user-create-modal";
import UserCreateModal from "./user-create-modal";

// Define user types
interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    lastLogin: Date | null;
    createdAt: Date;
    avatar?: string;
    articles?: number;
    department?: string;
    position?: string;
    phone?: string;
    bio?: string;
}

// Sample data
const generateUsers = (): User[] => {
    const roles: UserRole[] = [
        "admin",
        "editor",
        "author",
        "contributor",
        "moderator",
    ];
    const statuses: UserStatus[] = [
        "active",
        "inactive",
        "pending",
        "suspended",
    ];
    const departments = [
        "News",
        "Sports",
        "Entertainment",
        "Politics",
        "Business",
        "Technology",
        "Health",
    ];

    return Array.from({ length: 50 }, (_, i) => {
        const id = (i + 1).toString().padStart(3, "0");
        const role = roles[Math.floor(Math.random() * roles.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const createdDate = new Date();
        createdDate.setDate(
            createdDate.getDate() - Math.floor(Math.random() * 365)
        );

        const lastLoginDate = status === "active" ? new Date() : null;
        if (lastLoginDate) {
            lastLoginDate.setDate(
                lastLoginDate.getDate() - Math.floor(Math.random() * 30)
            );
        }

        return {
            id: `USR-${id}`,
            name: `User ${id}`,
            email: `user${id}@example.com`,
            role,
            status,
            lastLogin: lastLoginDate,
            createdAt: createdDate,
            articles: Math.floor(Math.random() * 100),
            department:
                departments[Math.floor(Math.random() * departments.length)],
            avatar:
                Math.random() > 0.3
                    ? `/placeholder.svg?height=40&width=40&query=person`
                    : undefined,
            position:
                Math.random() > 0.5
                    ? `${role.charAt(0).toUpperCase() + role.slice(1)}`
                    : undefined,
            phone:
                Math.random() > 0.7
                    ? `+1 ${Math.floor(Math.random() * 1000)}-${Math.floor(
                          Math.random() * 1000
                      )}-${Math.floor(Math.random() * 10000)}`
                    : undefined,
            bio:
                Math.random() > 0.8
                    ? `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies.`
                    : undefined,
        };
    });
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(generateUsers());
    const [searchText, setSearchText] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [filterRole, setFilterRole] = useState<UserRole | "all">("all");
    const [filterStatus, setFilterStatus] = useState<UserStatus | "all">("all");
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Filter users based on search and filters
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.id.toLowerCase().includes(searchText.toLowerCase());

        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesStatus =
            filterStatus === "all" || user.status === filterStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Handle user creation/editing
    const handleSaveUser = async (userData: UserFormData) => {
        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

            if (isEditing && selectedUser) {
                // Update existing user
                const updatedUsers = users.map((user) =>
                    user.id === selectedUser.id
                        ? {
                              ...user,
                              name: userData.name,
                              email: userData.email,
                              role: userData.role,
                              status: userData.status,
                              department: userData.department,
                              position: userData.position,
                              phone: userData.phone,
                              avatar: userData.avatar || user.avatar,
                              bio: userData.bio,
                          }
                        : user
                );
                setUsers(updatedUsers);
                message.success("User updated successfully");
            } else {
                // Create new user
                const newUser: User = {
                    id: `USR-${(users.length + 1).toString().padStart(3, "0")}`,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    status: userData.status,
                    lastLogin: null,
                    createdAt: new Date(),
                    department: userData.department,
                    position: userData.position,
                    phone: userData.phone,
                    avatar: userData.avatar || undefined,
                    articles: 0,
                    bio: userData.bio,
                };
                setUsers([newUser, ...users]);
                message.success("User created successfully");
            }
        } catch (error) {
            console.error("Error saving user:", error);
            message.error("Failed to save user");
        } finally {
            setLoading(false);
            setIsUserModalVisible(false);
            setSelectedUser(null);
            setIsEditing(false);
        }
    };

    // Handle user deletion
    const handleDeleteUser = () => {
        setLoading(true);

        setTimeout(() => {
            if (selectedUser) {
                const updatedUsers = users.filter(
                    (user) => user.id !== selectedUser.id
                );
                setUsers(updatedUsers);
                message.success("User deleted successfully");
            }

            setLoading(false);
            setIsDeleteModalVisible(false);
            setSelectedUser(null);
        }, 500);
    };
    // Open edit modal
    const showEditModal = (user: User) => {
        setSelectedUser(user);
        setIsEditing(true);
        setIsUserModalVisible(true);
    };

    // Open create modal
    const showCreateModal = () => {
        setSelectedUser(null);
        setIsEditing(false);
        setIsUserModalVisible(true);
    };

    // Open delete confirmation modal
    const showDeleteModal = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalVisible(true);
    };

    // Table columns
    const columns: ColumnsType<User> = [
        {
            title: "User",
            key: "user",
            render: (_, user) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                        src={user.avatar}
                        icon={!user.avatar && <UserOutlined />}
                        style={{ marginRight: 12 }}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{user.name}</div>
                        <div
                            style={{
                                fontSize: "0.85rem",
                                color: "rgba(0, 0, 0, 0.45)",
                            }}
                        >
                            {user.email}
                        </div>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role: UserRole) => {
                const roleColors: Record<UserRole, string> = {
                    admin: "red",
                    editor: "blue",
                    author: "green",
                    contributor: "orange",
                    moderator: "purple",
                };

                return (
                    <Tag
                        color={roleColors[role]}
                        style={{ textTransform: "capitalize" }}
                    >
                        {role}
                    </Tag>
                );
            },
            filters: [
                { text: "Admin", value: "admin" },
                { text: "Editor", value: "editor" },
                { text: "Author", value: "author" },
                { text: "Contributor", value: "contributor" },
                { text: "Moderator", value: "moderator" },
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
            render: (department: string) => <span>{department}</span>,
            responsive: ["md"],
        },
        {
            title: "Articles",
            dataIndex: "articles",
            key: "articles",
            render: (articles: number) => <span>{articles}</span>,
            sorter: (a, b) => (a.articles || 0) - (b.articles || 0),
            responsive: ["lg"],
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: UserStatus) => {
                const statusConfig: Record<
                    UserStatus,
                    { color: string; icon: React.ReactNode }
                > = {
                    active: { color: "green", icon: <CheckCircleOutlined /> },
                    inactive: {
                        color: "default",
                        icon: <CloseCircleOutlined />,
                    },
                    pending: { color: "gold", icon: <ClockCircleOutlined /> },
                    suspended: { color: "red", icon: <StopOutlined /> },
                };

                return (
                    <Tag
                        color={statusConfig[status].color}
                        icon={statusConfig[status].icon}
                        style={{ textTransform: "capitalize" }}
                    >
                        {status}
                    </Tag>
                );
            },
            filters: [
                { text: "Active", value: "active" },
                { text: "Inactive", value: "inactive" },
                { text: "Pending", value: "pending" },
                { text: "Suspended", value: "suspended" },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Last Login",
            dataIndex: "lastLogin",
            key: "lastLogin",
            render: (lastLogin: Date | null) =>
                lastLogin ? format(lastLogin, "MMM dd, yyyy") : "Never",
            sorter: (a, b) => {
                if (!a.lastLogin) return 1;
                if (!b.lastLogin) return -1;
                return a.lastLogin.getTime() - b.lastLogin.getTime();
            },
            responsive: ["md"],
        },
        {
            title: "Created",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: Date) => format(date, "MMM dd, yyyy"),
            sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
            responsive: ["lg"],
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, user) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => showEditModal(user)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => showDeleteModal(user)}
                        />
                    </Tooltip>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: "1",
                                    label: "Reset Password",
                                    icon: <LockOutlined />,
                                    onClick: () =>
                                        message.info(
                                            `Password reset email sent to ${user.email}`
                                        ),
                                },
                                {
                                    key: "2",
                                    label:
                                        user.status === "active"
                                            ? "Deactivate"
                                            : "Activate",
                                    icon:
                                        user.status === "active" ? (
                                            <UnlockOutlined />
                                        ) : (
                                            <LockOutlined />
                                        ),
                                    onClick: () => {
                                        const newStatus =
                                            user.status === "active"
                                                ? "inactive"
                                                : "active";
                                        const updatedUsers = users.map((u) =>
                                            u.id === user.id
                                                ? { ...u, status: newStatus }
                                                : u
                                        );
                                        setUsers(updatedUsers);
                                        message.success(
                                            `User ${
                                                newStatus === "active"
                                                    ? "activated"
                                                    : "deactivated"
                                            } successfully`
                                        );
                                    },
                                },
                                {
                                    key: "3",
                                    label: "Send Email",
                                    icon: <MailOutlined />,
                                    onClick: () =>
                                        message.info(
                                            `Compose email to ${user.email}`
                                        ),
                                },
                            ],
                        }}
                        trigger={["click"]}
                    >
                        <Button size="small" icon={<EllipsisOutlined />} />
                    </Dropdown>
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
                    All Users
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage and organize all Users with advanced filtering and
                    sorting options.
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
                                placeholder="Search users by name, email or ID"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: 250 }}
                            />
                            <Button icon={<FilterOutlined />}>Filter</Button>
                        </Space>
                        <Space wrap>
                            <Button icon={<ExportOutlined />}>Export</Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={showCreateModal}
                            >
                                Add User
                            </Button>
                        </Space>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredUsers}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} users`,
                        }}
                        loading={loading}
                        scroll={{ x: 800 }}
                        variant="bordered"
                        highlightOnHover
                        headerBackground
                    />
                </Card>

                {/* User Create/Edit Modal */}
                <UserCreateModal
                    open={isUserModalVisible}
                    onCancel={() => {
                        setIsUserModalVisible(false);
                        setSelectedUser(null);
                        setIsEditing(false);
                    }}
                    onSave={handleSaveUser}
                    initialValues={selectedUser || undefined}
                    isEditing={isEditing}
                />

                {/* Delete Confirmation Modal */}
                <Modal
                    title="Delete User"
                    open={isDeleteModalVisible}
                    onCancel={() => setIsDeleteModalVisible(false)}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={() => setIsDeleteModalVisible(false)}
                        >
                            Cancel
                        </Button>,
                        <Button
                            key="delete"
                            danger
                            type="primary"
                            loading={loading}
                            onClick={handleDeleteUser}
                        >
                            Delete
                        </Button>,
                    ]}
                >
                    <p>
                        Are you sure you want to delete user{" "}
                        <strong>{selectedUser?.name}</strong>?
                    </p>
                    <p>This action cannot be undone.</p>
                </Modal>
            </div>
        </>
    );
}
