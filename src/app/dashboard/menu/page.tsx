/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTheme } from "@/components/theme-context";
import {
    AppstoreOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    LinkOutlined,
    MenuOutlined,
    MoreOutlined,
    PlusOutlined,
    SearchOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Dropdown,
    Flex,
    Form,
    Input,
    Modal,
    Select,
    Switch,
    Table,
    Tag,
    message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import Link from "next/link";
import type React from "react";
import { useState } from "react";

// Define Menu type
interface Menu {
    id: string;
    name: string;
    location: "header" | "footer" | "sidebar" | "mobile" | "dashboard";
    type: "main" | "footer" | "mobile" | "category" | "user";
    itemCount: number;
    status: "active" | "inactive";
    lastUpdated: string;
    description?: string;
}

// Initial menu data
const initialMenus: Menu[] = [
    {
        id: "1",
        name: "Main Navigation",
        location: "header",
        type: "main",
        itemCount: 8,
        status: "active",
        lastUpdated: "2023-05-15T10:30:00Z",
    },
    {
        id: "2",
        name: "Footer Links",
        location: "footer",
        type: "footer",
        itemCount: 12,
        status: "active",
        lastUpdated: "2023-05-10T14:20:00Z",
    },
    {
        id: "3",
        name: "Mobile Navigation",
        location: "mobile",
        type: "mobile",
        itemCount: 6,
        status: "active",
        lastUpdated: "2023-05-12T09:15:00Z",
    },
    {
        id: "4",
        name: "Sidebar Categories",
        location: "sidebar",
        type: "category",
        itemCount: 10,
        status: "inactive",
        lastUpdated: "2023-05-08T16:45:00Z",
    },
];

const MenusPage = () => {
    const [menus, setMenus] = useState<Menu[]>(initialMenus);
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

    const { isDark } = useTheme();

    const filteredMenus = menus.filter(
        (menu) =>
            menu.name.toLowerCase().includes(searchText.toLowerCase()) ||
            menu.type.toLowerCase().includes(searchText.toLowerCase()) ||
            menu.location.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleOk = () => {
        form.validateFields().then((values) => {
            const updatedStatus = values.status ? "active" : "inactive";
            const newValues = { ...values, status: updatedStatus };

            if (editingMenu) {
                const updatedMenus = menus.map((menu) =>
                    menu.id === editingMenu.id
                        ? { ...menu, ...newValues }
                        : menu
                );
                setMenus(updatedMenus);
                message.success("Menu updated successfully");
            } else {
                const newMenu: Menu = {
                    id: Date.now().toString(),
                    ...newValues,
                    itemCount: 0,
                    lastUpdated: new Date().toISOString(),
                };
                setMenus([...menus, newMenu]);
                message.success("Menu created successfully");
            }
            setIsModalVisible(false);
            form.resetFields();
            setEditingMenu(null);
        });
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Are you sure you want to delete this menu?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => {
                setMenus(menus.filter((menu) => menu.id !== id));
                message.success("Menu deleted successfully");
            },
        });
    };

    const handleDuplicate = (menu: Menu) => {
        const newMenu: Menu = {
            ...menu,
            id: Date.now().toString(),
            name: `${menu.name} (Copy)`,
            lastUpdated: new Date().toISOString(),
        };
        setMenus([...menus, newMenu]);
        message.success("Menu duplicated successfully");
    };

    const handleEdit = (menu: Menu) => {
        setEditingMenu(menu);
        form.setFieldsValue({
            ...menu,
            status: menu.status === "active",
        });
        setIsModalVisible(true);
    };

    const columns: ColumnsType<Menu> = [
        {
            title: "Menu Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Link
                    href={`/dashboard/menu/${record.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    {text}
                </Link>
            ),
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
            render: (location) => {
                const locationColors: Record<string, string> = {
                    header: "blue",
                    footer: "purple",
                    sidebar: "orange",
                    mobile: "green",
                    dashboard: "cyan",
                };
                return (
                    <Tag color={locationColors[location] || "default"}>
                        {location.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => {
                const typeIcons: Record<string, React.ReactNode> = {
                    main: <MenuOutlined />,
                    footer: <AppstoreOutlined />,
                    mobile: <AppstoreOutlined />,
                    category: <AppstoreOutlined />,
                    user: <SettingOutlined />,
                };
                return (
                    <span className="flex items-center">
                        {typeIcons[type] || <LinkOutlined />}{" "}
                        <span className="ml-1">{type}</span>
                    </span>
                );
            },
        },
        {
            title: "Items",
            dataIndex: "itemCount",
            key: "itemCount",
            render: (count: number) => (
                <span className="font-medium">{count}</span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "active" ? "success" : "default"}>
                    {status === "active" ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Last Updated",
            dataIndex: "lastUpdated",
            key: "lastUpdated",
            render: (date: string) => format(new Date(date), "yyyy-MM-dd"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Menu) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "1",
                                icon: <EditOutlined />,
                                label: "Edit Menu",
                                onClick: () => handleEdit(record),
                            },
                            {
                                key: "2",
                                icon: <EyeOutlined />,
                                label: "Edit Menu Items",
                                onClick: () =>
                                    (window.location.href = `/dashboard/menu/${record.id}`),
                            },
                            {
                                key: "3",
                                icon: <CopyOutlined />,
                                label: "Duplicate",
                                onClick: () => handleDuplicate(record),
                            },
                            {
                                key: "4",
                                icon: <DeleteOutlined />,
                                label: "Delete",
                                danger: true,
                                onClick: () => handleDelete(record.id),
                            },
                        ],
                    }}
                    trigger={["click"]}
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1
                        style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: isDark ? "#fff" : "#000",
                        }}
                    >
                        Menus
                    </h1>
                    <p
                        style={{
                            color: isDark
                                ? "rgba(255, 255, 255, 0.65)"
                                : "rgba(0, 0, 0, 0.45)",
                        }}
                    >
                        Manage and organize all menus with advanced filtering
                        and sorting options.
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingMenu(null);
                        form.resetFields();
                        setIsModalVisible(true);
                    }}
                >
                    Create Menu
                </Button>
            </div>

            <Card style={{ marginBottom: 24 }}>
                <div className="flex items-center justify-between mb-4">
                    <div className="w-64">
                        <Input
                            placeholder="Search menus..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    <Flex gap={5} align="center">
                        <Select
                            placeholder="Filter by Location"
                            style={{ width: 150 }}
                            allowClear
                            options={[
                                { value: "header", label: "Header" },
                                { value: "footer", label: "Footer" },
                                { value: "sidebar", label: "Sidebar" },
                                { value: "mobile", label: "Mobile" },
                                { value: "dashboard", label: "Dashboard" },
                            ]}
                        />
                        <Select
                            placeholder="Filter by Status"
                            style={{ width: 150 }}
                            allowClear
                            options={[
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                            ]}
                        />
                    </Flex>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredMenus}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingMenu ? "Edit Menu" : "Create New Menu"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingMenu(null);
                    form.resetFields();
                }}
                width={600}
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <Form.Item
                        name="name"
                        label="Menu Name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter a menu name",
                            },
                        ]}
                    >
                        <Input placeholder="e.g., Main Navigation" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="location"
                            label="Menu Location"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a location",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select location"
                                options={[
                                    { value: "header", label: "Header" },
                                    { value: "footer", label: "Footer" },
                                    { value: "sidebar", label: "Sidebar" },
                                    { value: "mobile", label: "Mobile" },
                                    { value: "dashboard", label: "Dashboard" },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            name="type"
                            label="Menu Type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a type",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select type"
                                options={[
                                    { value: "main", label: "Main Menu" },
                                    { value: "footer", label: "Footer Menu" },
                                    { value: "mobile", label: "Mobile Menu" },
                                    {
                                        value: "category",
                                        label: "Category Menu",
                                    },
                                    { value: "user", label: "User Menu" },
                                ]}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item name="status" label="Status">
                        <Switch
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                            checked={form.getFieldValue("status")}
                            onChange={(checked) =>
                                form.setFieldsValue({
                                    status: checked,
                                })
                            }
                        />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea
                            placeholder="Brief description of this menu's purpose"
                            rows={3}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MenusPage;
