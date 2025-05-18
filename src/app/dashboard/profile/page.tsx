"use client";
import { useTheme } from "@/components/theme-context";
import {
  EditOutlined,
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  List,
  Row,
  Tabs,
  Tag,
  Upload,
  message,
} from "antd";
import { useState } from "react";

const { TabPane } = Tabs;

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            message.success("Profile updated successfully!");
        }, 1500);
    };

    const handlePasswordChange = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            message.success("Password changed successfully!");
        }, 1500);
    };

    const activities = [
        {
            title: "Updated product inventory",
            time: "2 hours ago",
            type: "update",
        },
        {
            title: "Added new product: Wireless Headphones",
            time: "Yesterday",
            type: "add",
        },
        {
            title: "Processed order #1234",
            time: "2 days ago",
            type: "process",
        },
        {
            title: "Updated account settings",
            time: "3 days ago",
            type: "update",
        },
        {
            title: "Added new user: John Smith",
            time: "1 week ago",
            type: "add",
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
                    User Profile
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage your personal information and account settings.
                </p>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: "8px",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            background: isDark ? "#1f2937" : "#ffffff",
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <Avatar size={100} icon={<UserOutlined />} />
                            <Upload
                                showUploadList={false}
                                beforeUpload={() => {
                                    message.info(
                                        "Profile picture upload functionality would be implemented here"
                                    );
                                    return false;
                                }}
                            >
                                <Button
                                    icon={<EditOutlined />}
                                    size="small"
                                    style={{ marginTop: 8 }}
                                >
                                    Change
                                </Button>
                            </Upload>
                            <h2
                                style={{
                                    marginTop: 16,
                                    marginBottom: 4,
                                    color: isDark ? "#fff" : "#000",
                                }}
                            >
                                Admin User
                            </h2>
                            <p
                                style={{
                                    color: isDark
                                        ? "rgba(255, 255, 255, 0.45)"
                                        : "rgba(0, 0, 0, 0.45)",
                                    marginBottom: 16,
                                }}
                            >
                                Administrator
                            </p>
                            <Divider
                                style={{
                                    borderColor: isDark ? "#303030" : "#f0f0f0",
                                }}
                            />
                            <Row gutter={[8, 16]}>
                                <Col span={24}>
                                    <p
                                        style={{
                                            color: isDark
                                                ? "rgba(255, 255, 255, 0.85)"
                                                : "rgba(0, 0, 0, 0.85)",
                                        }}
                                    >
                                        <MailOutlined
                                            style={{ marginRight: 8 }}
                                        />
                                        admin@example.com
                                    </p>
                                </Col>
                                <Col span={24}>
                                    <p
                                        style={{
                                            color: isDark
                                                ? "rgba(255, 255, 255, 0.85)"
                                                : "rgba(0, 0, 0, 0.85)",
                                        }}
                                    >
                                        <PhoneOutlined
                                            style={{ marginRight: 8 }}
                                        />
                                        (123) 456-7890
                                    </p>
                                </Col>
                                <Col span={24}>
                                    <p
                                        style={{
                                            color: isDark
                                                ? "rgba(255, 255, 255, 0.85)"
                                                : "rgba(0, 0, 0, 0.85)",
                                        }}
                                    >
                                        <HomeOutlined
                                            style={{ marginRight: 8 }}
                                        />
                                        New York, USA
                                    </p>
                                </Col>
                            </Row>
                            <Divider
                                style={{
                                    borderColor: isDark ? "#303030" : "#f0f0f0",
                                }}
                            />
                            <div>
                                <h4 style={{ color: isDark ? "#fff" : "#000" }}>
                                    Skills
                                </h4>
                                <div style={{ marginTop: 8 }}>
                                    <Tag color="#1677ff">Management</Tag>
                                    <Tag color="#52c41a">Marketing</Tag>
                                    <Tag color="#faad14">Sales</Tag>
                                    <Tag color="#722ed1">Analytics</Tag>
                                    <Tag color="#13c2c2">Design</Tag>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={16}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: "8px",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            background: isDark ? "#1f2937" : "#ffffff",
                        }}
                    >
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Profile Information" key="1">
                                <Form layout="vertical" onFinish={handleSubmit}>
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="First Name"
                                                name="firstName"
                                                initialValue="Admin"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please input your first name!",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    prefix={<UserOutlined />}
                                                    placeholder="First Name"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Last Name"
                                                name="lastName"
                                                initialValue="User"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please input your last name!",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    prefix={<UserOutlined />}
                                                    placeholder="Last Name"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Email"
                                                name="email"
                                                initialValue="admin@example.com"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please input your email!",
                                                    },
                                                    {
                                                        type: "email",
                                                        message:
                                                            "Please enter a valid email!",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    prefix={<MailOutlined />}
                                                    placeholder="Email"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Phone"
                                                name="phone"
                                                initialValue="(123) 456-7890"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please input your phone number!",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    prefix={<PhoneOutlined />}
                                                    placeholder="Phone"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Address"
                                                name="address"
                                                initialValue="New York, USA"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please input your address!",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    prefix={<HomeOutlined />}
                                                    placeholder="Address"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                        >
                                            Save Changes
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                            <TabPane tab="Change Password" key="2">
                                <Form
                                    layout="vertical"
                                    onFinish={handlePasswordChange}
                                >
                                    <Form.Item
                                        label="Old Password"
                                        name="oldPassword"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your old password!",
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="Old Password"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="New Password"
                                        name="newPassword"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your new password!",
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="New Password"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please confirm your new password!",
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (
                                                        !value ||
                                                        getFieldValue(
                                                            "newPassword"
                                                        ) === value
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        new Error(
                                                            "The two passwords that you entered do not match!"
                                                        )
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="Confirm New Password"
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                        >
                                            Change Password
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                            <TabPane tab="Activity Log" key="3">
                                <List
                                    itemLayout="horizontal"
                                    dataSource={activities}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={item.title}
                                                description={item.time}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
