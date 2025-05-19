"use client";
import { Card as EnhancedCard } from "@/components/ant";
import { useTheme } from "@/components/theme-context";
import {
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    EyeOutlined,
    FileExcelOutlined,
    ImportOutlined,
    PlusOutlined,
    SearchOutlined,
    SortAscendingOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tag,
    Tooltip,
} from "antd";
import { useState } from "react";

const { Option } = Select;

export default function CategoriesPage() {
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [form] = Form.useForm();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Sample data
    const categoriesData = [
        {
            id: 1,
            name: "Politics",
            slug: "politics",
            description: "Political news and updates",
            parent: null,
            posts: 145,
            status: "active",
            featured: true,
            created: "2023-05-15",
        },
        {
            id: 2,
            name: "Business",
            slug: "business",
            description: "Business and economic news",
            parent: null,
            posts: 98,
            status: "active",
            featured: true,
            created: "2023-05-15",
        },
        {
            id: 3,
            name: "Technology",
            slug: "technology",
            description: "Technology news and updates",
            parent: null,
            posts: 112,
            status: "active",
            featured: false,
            created: "2023-05-16",
        },
        {
            id: 4,
            name: "Sports",
            slug: "sports",
            description: "Sports news and updates",
            parent: null,
            posts: 87,
            status: "active",
            featured: true,
            created: "2023-05-16",
        },
        {
            id: 5,
            name: "Entertainment",
            slug: "entertainment",
            description: "Entertainment news and updates",
            parent: null,
            posts: 76,
            status: "active",
            featured: false,
            created: "2023-05-17",
        },
        {
            id: 6,
            name: "Health",
            slug: "health",
            description: "Health news and updates",
            parent: null,
            posts: 54,
            status: "active",
            featured: false,
            created: "2023-05-17",
        },
        {
            id: 7,
            name: "Science",
            slug: "science",
            description: "Science news and discoveries",
            parent: null,
            posts: 43,
            status: "active",
            featured: false,
            created: "2023-05-18",
        },
        {
            id: 8,
            name: "World",
            slug: "world",
            description: "International news",
            parent: null,
            posts: 132,
            status: "active",
            featured: true,
            created: "2023-05-18",
        },
        {
            id: 9,
            name: "Lifestyle",
            slug: "lifestyle",
            description: "Lifestyle news and tips",
            parent: null,
            posts: 65,
            status: "active",
            featured: false,
            created: "2023-05-19",
        },
        {
            id: 10,
            name: "Opinion",
            slug: "opinion",
            description: "Opinion pieces and editorials",
            parent: null,
            posts: 48,
            status: "active",
            featured: false,
            created: "2023-05-19",
        },
        {
            id: 11,
            name: "Football",
            slug: "football",
            description: "Football news and updates",
            parent: "Sports",
            posts: 45,
            status: "active",
            featured: false,
            created: "2023-05-20",
        },
        {
            id: 12,
            name: "Cricket",
            slug: "cricket",
            description: "Cricket news and updates",
            parent: "Sports",
            posts: 32,
            status: "active",
            featured: false,
            created: "2023-05-20",
        },
        {
            id: 13,
            name: "Mobile",
            slug: "mobile",
            description: "Mobile technology news",
            parent: "Technology",
            posts: 28,
            status: "active",
            featured: false,
            created: "2023-05-21",
        },
        {
            id: 14,
            name: "AI",
            slug: "ai",
            description: "Artificial Intelligence news",
            parent: "Technology",
            posts: 36,
            status: "active",
            featured: false,
            created: "2023-05-21",
        },
        {
            id: 15,
            name: "Movies",
            slug: "movies",
            description: "Movie news and reviews",
            parent: "Entertainment",
            posts: 41,
            status: "active",
            featured: false,
            created: "2023-05-22",
        },
    ];

    const filteredData = categoriesData.filter(
        (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.slug.toLowerCase().includes(searchText.toLowerCase()) ||
            (item.description &&
                item.description
                    .toLowerCase()
                    .includes(searchText.toLowerCase())) ||
            (item.parent &&
                item.parent.toLowerCase().includes(searchText.toLowerCase()))
    );

    const handleEdit = (record: any) => {
        setEditingCategory(record);
        form.setFieldsValue({
            name: record.name,
            slug: record.slug,
            description: record.description,
            parent: record.parent,
            status: record.status,
            featured: record.featured,
        });
        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        message.success(`Category with ID ${id} has been deleted`);
    };

    const handleCreate = () => {
        setEditingCategory(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields()
            .then((values) => {
                if (editingCategory) {
                    message.success(
                        `Category "${values.name}" has been updated`
                    );
                } else {
                    message.success(
                        `Category "${values.name}" has been created`
                    );
                }
                setIsModalVisible(false);
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
            render: (text: string, record: any) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    {record.parent && (
                        <div
                            style={{
                                fontSize: "12px",
                                color: isDark
                                    ? "rgba(255, 255, 255, 0.45)"
                                    : "rgba(0, 0, 0, 0.45)",
                            }}
                        >
                            Parent: {record.parent}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
            sorter: (a: any, b: any) => a.slug.localeCompare(b.slug),
        },
        {
            title: "Posts",
            dataIndex: "posts",
            key: "posts",
            sorter: (a: any, b: any) => a.posts - b.posts,
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
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: "Featured",
            dataIndex: "featured",
            key: "featured",
            render: (featured: boolean) =>
                featured ? <Tag color="blue">FEATURED</Tag> : "-",
            filters: [
                { text: "Featured", value: true },
                { text: "Not Featured", value: false },
            ],
            onFilter: (value: any, record: any) => record.featured === value,
        },
        {
            title: "Created",
            dataIndex: "created",
            key: "created",
            sorter: (a: any, b: any) =>
                new Date(a.created).getTime() - new Date(b.created).getTime(),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="View">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            size="small"
                        />
                    </Tooltip>
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
                            title="Are you sure you want to delete this category?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                            placement="left"
                        >
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
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
                    Categories
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage categories for organizing your content
                </p>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={18}>
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
                                    placeholder="Search categories"
                                    prefix={<SearchOutlined />}
                                    value={searchText}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                    style={{ width: 250 }}
                                />
                                <Button icon={<SortAscendingOutlined />}>
                                    Sort
                                </Button>
                            </Space>
                            <Space wrap>
                                <Button icon={<ImportOutlined />}>
                                    Import
                                </Button>
                                <Button icon={<ExportOutlined />}>
                                    Export
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleCreate}
                                >
                                    Add Category
                                </Button>
                            </Space>
                        </div>
                        <Table
                            dataSource={filteredData}
                            columns={columns}
                            rowKey="id"
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} items`,
                            }}
                            scroll={{ x: "max-content" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={6}>
                    <EnhancedCard
                        title="Category Stats"
                        variant="default"
                        style={{
                            marginBottom: "16px",
                        }}
                    >
                        <div style={{ marginBottom: "12px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "8px",
                                }}
                            >
                                <span>Total Categories:</span>
                                <strong>{categoriesData.length}</strong>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "8px",
                                }}
                            >
                                <span>Parent Categories:</span>
                                <strong>
                                    {
                                        categoriesData.filter(
                                            (cat) => cat.parent === null
                                        ).length
                                    }
                                </strong>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "8px",
                                }}
                            >
                                <span>Sub Categories:</span>
                                <strong>
                                    {
                                        categoriesData.filter(
                                            (cat) => cat.parent !== null
                                        ).length
                                    }
                                </strong>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span>Featured Categories:</span>
                                <strong>
                                    {
                                        categoriesData.filter(
                                            (cat) => cat.featured
                                        ).length
                                    }
                                </strong>
                            </div>
                        </div>
                    </EnhancedCard>

                    <EnhancedCard
                        title="Quick Tips"
                        variant="filled"
                        style={{
                            marginBottom: "16px",
                        }}
                    >
                        <ul style={{ paddingLeft: "20px", margin: "0" }}>
                            <li style={{ marginBottom: "8px" }}>
                                Categories help organize your content for better
                                navigation
                            </li>
                            <li style={{ marginBottom: "8px" }}>
                                Use clear, concise names for your categories
                            </li>
                            <li style={{ marginBottom: "8px" }}>
                                Featured categories appear prominently on your
                                site
                            </li>
                            <li>
                                You can create a hierarchy with parent and child
                                categories
                            </li>
                        </ul>
                    </EnhancedCard>

                    <EnhancedCard
                        title="Bulk Actions"
                        variant="default"
                        style={{
                            marginBottom: "16px",
                        }}
                    >
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Button icon={<FileExcelOutlined />} block>
                                Export to Excel
                            </Button>
                            <Button icon={<ImportOutlined />} block>
                                Import Categories
                            </Button>
                            <Button danger icon={<DeleteOutlined />} block>
                                Delete Selected
                            </Button>
                        </Space>
                    </EnhancedCard>
                </Col>
            </Row>

            <Modal
                title={editingCategory ? "Edit Category" : "Add New Category"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Category Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter category name",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter category name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="slug"
                                label="Slug"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter slug",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter slug" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea
                            rows={4}
                            placeholder="Enter description"
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="parent" label="Parent Category">
                                <Select
                                    placeholder="Select parent category"
                                    allowClear
                                >
                                    {categoriesData
                                        .filter((cat) => cat.parent === null)
                                        .map((cat) => (
                                            <Option
                                                key={cat.id}
                                                value={cat.name}
                                            >
                                                {cat.name}
                                            </Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                initialValue="active"
                            >
                                <Select>
                                    <Option value="active">Active</Option>
                                    <Option value="inactive">Inactive</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="featured"
                        label="Featured"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
