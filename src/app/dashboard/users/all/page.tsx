"use client";

import { useTheme } from "@/components/theme-context";
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
    message,
    Modal,
    Row,
    Space,
    Table,
    Tabs,
    Tag,
    Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

// Types based on the database schema
interface Department {
    id: string;
    title: string;
}

type UserType = "admin" | "editor" | "reporter" | "writer" | "contributor";
type Gender = "male" | "female" | "other";
type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
type VerificationType =
    | "national_id"
    | "passport"
    | "driving_license"
    | "other";

interface User {
    id: string;
    email: string;
    password?: string;
    department_id: string;
    user_type: UserType;
    departmentTitle?: string;
}

interface Reporter {
    id: string;
    user_id: string;
    created_by_id: string;
    first_name: string;
    last_name: string;
    nick_name?: string;
    profile_image_id?: string;
    profile_image_url?: string;
    mobile?: string;
    designation?: string;
    gender?: Gender;
    blood_group?: BloodGroup;
    date_of_birth?: string;
    address_line_one?: string;
    address_line_two?: string;
    country?: string;
    state?: string;
    city?: string;
    zip_code?: string;
    verification_type?: VerificationType;
    document_id_no?: string;
    about?: string;
    // Additional fields for UI
    email?: string;
    department?: string;
    articles_count?: number;
    created_at?: Date;
    status?: "active" | "inactive" | "pending";
}

export default function ReportersPage() {
    const [reporters, setReporters] = useState<Reporter[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentReporter, setCurrentReporter] = useState<Reporter | null>(
        null
    );

    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Mock data loading
    useEffect(() => {
        // Simulate API call to fetch departments
        const mockDepartments: Department[] = [
            { id: "d1", title: "News" },
            { id: "d2", title: "Sports" },
            { id: "d3", title: "Entertainment" },
            { id: "d4", title: "Politics" },
            { id: "d5", title: "Business" },
            { id: "d6", title: "Technology" },
        ];

        // Simulate API call to fetch reporters
        const mockReporters: Reporter[] = Array.from({ length: 20 }, (_, i) => {
            const id = `r${i + 1}`;
            const userId = `u${i + 1}`;
            const deptId =
                mockDepartments[
                    Math.floor(Math.random() * mockDepartments.length)
                ].id;
            const deptTitle =
                mockDepartments.find((d) => d.id === deptId)?.title ||
                "Unknown";
            const gender: Gender = ["male", "female", "other"][
                Math.floor(Math.random() * 3)
            ] as Gender;
            const bloodGroup: BloodGroup = [
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
            ][Math.floor(Math.random() * 8)] as BloodGroup;
            const verificationType: VerificationType = [
                "national_id",
                "passport",
                "driving_license",
                "other",
            ][Math.floor(Math.random() * 4)] as VerificationType;
            const status = ["active", "inactive", "pending"][
                Math.floor(Math.random() * 3)
            ] as "active" | "inactive" | "pending";

            const createdDate = new Date();
            createdDate.setDate(
                createdDate.getDate() - Math.floor(Math.random() * 365)
            );

            const birthYear = 1970 + Math.floor(Math.random() * 30);
            const birthMonth = 1 + Math.floor(Math.random() * 12);
            const birthDay = 1 + Math.floor(Math.random() * 28);

            return {
                id,
                user_id: userId,
                created_by_id: "admin1",
                first_name: `First${i + 1}`,
                last_name: `Last${i + 1}`,
                nick_name: Math.random() > 0.3 ? `Nick${i + 1}` : undefined,
                profile_image_id:
                    Math.random() > 0.3 ? `img${i + 1}` : undefined,
                profile_image_url:
                    Math.random() > 0.3
                        ? `/placeholder.svg?height=100&width=100&query=person`
                        : undefined,
                mobile: `+1 ${Math.floor(Math.random() * 1000)}-${Math.floor(
                    Math.random() * 1000
                )}-${Math.floor(Math.random() * 10000)}`,
                designation: [
                    "Senior Reporter",
                    "Junior Reporter",
                    "Staff Writer",
                    "Contributor",
                    "Editor",
                ][Math.floor(Math.random() * 5)],
                gender,
                blood_group: bloodGroup,
                date_of_birth: `${birthYear}-${birthMonth
                    .toString()
                    .padStart(2, "0")}-${birthDay.toString().padStart(2, "0")}`,
                address_line_one: `${Math.floor(Math.random() * 1000)} Main St`,
                address_line_two:
                    Math.random() > 0.5
                        ? `Apt ${Math.floor(Math.random() * 100)}`
                        : undefined,
                country: "United States",
                state: [
                    "California",
                    "New York",
                    "Texas",
                    "Florida",
                    "Illinois",
                ][Math.floor(Math.random() * 5)],
                city: [
                    "Los Angeles",
                    "New York",
                    "Houston",
                    "Miami",
                    "Chicago",
                ][Math.floor(Math.random() * 5)],
                zip_code: `${Math.floor(Math.random() * 90000) + 10000}`,
                verification_type: verificationType,
                document_id_no: `DOC${Math.floor(Math.random() * 1000000)}`,
                about:
                    Math.random() > 0.3
                        ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies."
                        : undefined,
                // Additional fields for UI
                email: `reporter${i + 1}@example.com`,
                department: deptTitle,
                articles_count: Math.floor(Math.random() * 100),
                created_at: createdDate,
                status,
            };
        });

        setDepartments(mockDepartments);
        setReporters(mockReporters);
        setLoading(false);
    }, []);

    // Handle reporter deletion
    const handleDeleteReporter = () => {
        if (currentReporter) {
            setLoading(true);

            // Filter out the deleted reporter
            const updatedReporters = reporters.filter(
                (reporter) => reporter.id !== currentReporter.id
            );
            setReporters(updatedReporters);

            message.success("Reporter deleted successfully");
            setLoading(false);
            setIsDeleteModalVisible(false);
            setCurrentReporter(null);
        }
    };

    // Open view modal
    const showViewModal = (reporter: Reporter) => {
        setCurrentReporter(reporter);
        setIsViewModalVisible(true);
    };

    // Open delete confirmation modal
    const showDeleteModal = (reporter: Reporter) => {
        setCurrentReporter(reporter);
        setIsDeleteModalVisible(true);
    };

    // Get status tag
    const getStatusTag = (status: string) => {
        switch (status) {
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
    const columns: ColumnsType<Reporter> = [
        {
            title: "Reporter",
            key: "reporter",
            render: (_, reporter) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                        src={reporter.profile_image_url}
                        icon={!reporter.profile_image_url && <UserOutlined />}
                        style={{ marginRight: 12 }}
                        size={40}
                    />
                    <div>
                        <div
                            style={{ fontWeight: 500 }}
                        >{`${reporter.first_name} ${reporter.last_name}`}</div>
                        <div
                            style={{
                                fontSize: "0.85rem",
                                color: "rgba(0, 0, 0, 0.45)",
                            }}
                        >
                            {reporter.email}
                        </div>
                    </div>
                </div>
            ),
            sorter: (a, b) =>
                `${a.first_name} ${a.last_name}`.localeCompare(
                    `${b.first_name} ${b.last_name}`
                ),
        },
        {
            title: "Designation",
            dataIndex: "designation",
            key: "designation",
            render: (designation: string) => <span>{designation || "-"}</span>,
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
            render: (department: string) => <span>{department}</span>,
            filters: departments.map((dept) => ({
                text: dept.title,
                value: dept.title,
            })),
            onFilter: (value, record) => record.department === value,
        },
        {
            title: "Contact",
            key: "contact",
            render: (_, reporter) => (
                <div>
                    <div style={{ marginBottom: 4 }}>
                        <PhoneOutlined
                            style={{
                                marginRight: 8,
                                color: "rgba(0, 0, 0, 0.45)",
                            }}
                        />
                        <span>{reporter.mobile || "-"}</span>
                    </div>
                    <div>
                        <EnvironmentOutlined
                            style={{
                                marginRight: 8,
                                color: "rgba(0, 0, 0, 0.45)",
                            }}
                        />
                        <span>{reporter.city || "-"}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Articles",
            dataIndex: "articles_count",
            key: "articles_count",
            render: (count: number) => <span>{count}</span>,
            sorter: (a, b) => (a.articles_count || 0) - (b.articles_count || 0),
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
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, reporter) => (
                <Space>
                    <Tooltip title="View">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => showViewModal(reporter)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Link href={`/dashboard/reporters/edit/${reporter.id}`}>
                            <Button icon={<EditOutlined />} size="small" />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => showDeleteModal(reporter)}
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
                            <Link href="/dashboard/users/add">
                                <Button type="primary" icon={<PlusOutlined />}>
                                    Add User
                                </Button>
                            </Link>
                        </Space>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={reporters}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,

                        }}
                        scroll={{ x: "max-content" }}
                    />
                </Card>

                {/* View Reporter Modal */}
                <Modal
                    title="Reporter Details"
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
                                currentReporter
                                    ? `/dashboard/users/edit/${currentReporter.id}`
                                    : "#"
                            }
                        >
                            <Button type="primary">Edit</Button>
                        </Link>,
                    ]}
                    width={700}
                >
                    {currentReporter && (
                        <div>
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                                <Avatar
                                    src={currentReporter.profile_image_url}
                                    icon={
                                        !currentReporter.profile_image_url && (
                                            <UserOutlined />
                                        )
                                    }
                                    size={100}
                                />
                                <div>
                                    <h2 className="text-xl font-semibold mb-1">{`${currentReporter.first_name} ${currentReporter.last_name}`}</h2>
                                    {currentReporter.nick_name && (
                                        <p className="text-gray-500 mb-1">
                                            &quot;{currentReporter.nick_name}
                                            &quot;
                                        </p>
                                    )}
                                    <p className="mb-1">
                                        {currentReporter.designation ||
                                            "No designation"}
                                    </p>
                                    <p className="text-gray-500 mb-2">
                                        {currentReporter.department}
                                    </p>
                                    {getStatusTag(
                                        currentReporter.status || "active"
                                    )}
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
                                                    {currentReporter.email ||
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
                                                    {currentReporter.mobile ||
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
                                                    {currentReporter.gender
                                                        ? currentReporter.gender
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          currentReporter.gender.slice(
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
                                                    {currentReporter.date_of_birth
                                                        ? format(
                                                              new Date(
                                                                  currentReporter.date_of_birth
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
                                                    {currentReporter.blood_group ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Articles
                                                </p>
                                                <p className="font-medium">
                                                    {currentReporter.articles_count ||
                                                        0}
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>

                                    {currentReporter.about && (
                                        <div className="mt-4">
                                            <p className="text-gray-500 mb-1">
                                                About
                                            </p>
                                            <p>{currentReporter.about}</p>
                                        </div>
                                    )}
                                </Tabs.TabPane>

                                <Tabs.TabPane tab="Address" key="2">
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Address Line 1
                                                </p>
                                                <p className="font-medium">
                                                    {currentReporter.address_line_one ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        {currentReporter.address_line_two && (
                                            <Col span={24}>
                                                <div className="mb-4">
                                                    <p className="text-gray-500 mb-1">
                                                        Address Line 2
                                                    </p>
                                                    <p className="font-medium">
                                                        {
                                                            currentReporter.address_line_two
                                                        }
                                                    </p>
                                                </div>
                                            </Col>
                                        )}
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    City
                                                </p>
                                                <p className="font-medium">
                                                    {currentReporter.city ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    State
                                                </p>
                                                <p className="font-medium">
                                                    {currentReporter.state ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    Country
                                                </p>
                                                <p className="font-medium">
                                                    {currentReporter.country ||
                                                        "Not provided"}
                                                </p>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="mb-4">
                                                <p className="text-gray-500 mb-1">
                                                    ZIP Code
                                                </p>
                                                <p className="font-medium">
                                                    {currentReporter.zip_code ||
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
                                                    {currentReporter.verification_type
                                                        ? currentReporter.verification_type
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
                                                    {currentReporter.document_id_no ||
                                                        "Not provided"}
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
                <Modal
                    title="Delete Reporter"
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
                            onClick={handleDeleteReporter}
                        >
                            Delete
                        </Button>,
                    ]}
                >
                    <p>
                        Are you sure you want to delete reporter{" "}
                        <strong>
                            {currentReporter
                                ? `${currentReporter.first_name} ${currentReporter.last_name}`
                                : ""}
                        </strong>
                        ?
                    </p>
                    <p>This action cannot be undone.</p>
                </Modal>
            </div>
        </>
    );
}
