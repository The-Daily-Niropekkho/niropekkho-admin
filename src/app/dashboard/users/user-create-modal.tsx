"use client";

import type React from "react";

import {
    GlobalOutlined,
    IdcardOutlined,
    InfoCircleOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    UploadOutlined,
    UserOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import {
    Avatar,
    Button,
    Checkbox,
    Divider,
    Form,
    Input,
    Modal,
    Select,
    Tabs,
    Upload,
    message,
} from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useEffect, useState } from "react";

// Define user types and roles
export type UserRole =
    | "admin"
    | "editor"
    | "author"
    | "contributor"
    | "moderator";
export type UserStatus = "active" | "inactive" | "pending" | "suspended";
export type UserPermission =
    | "create_post"
    | "edit_post"
    | "delete_post"
    | "publish_post"
    | "manage_users"
    | "manage_settings"
    | "manage_comments"
    | "manage_categories"
    | "manage_media";

export interface UserFormData {
    name: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    role: UserRole;
    status: UserStatus;
    department?: string;
    position?: string;
    phone?: string;
    avatar?: string | null;
    bio?: string;
    sendWelcomeEmail?: boolean;
    requirePasswordChange?: boolean;
    permissions?: UserPermission[];
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        facebook?: string;
    };
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
}

interface UserCreateModalProps {
    open: boolean;
    onCancel: () => void;
    onSave: (userData: UserFormData) => Promise<void>;
    initialValues?: Partial<UserFormData>;
    isEditing?: boolean;
}

const UserCreateModal: React.FC<UserCreateModalProps> = ({
    open,
    onCancel,
    onSave,
    initialValues,
    isEditing = false,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("1");
    const [generatePassword, setGeneratePassword] = useState(!isEditing);

    // Set initial values when the modal opens or when editing a user
    useEffect(() => {
        if (open && initialValues) {
            form.setFieldsValue({
                ...initialValues,
                password: undefined,
                confirmPassword: undefined,
            });

            if (initialValues.avatar) {
                setPreviewImage(initialValues.avatar);
            } else {
                setPreviewImage(null);
            }
        } else if (open) {
            form.resetFields();
            setPreviewImage(null);
            setGeneratePassword(true);
        }
    }, [open, initialValues, form]);

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // If generate password is checked, remove password fields
            if (generatePassword) {
                delete values.password;
                delete values.confirmPassword;
            }

            // Add avatar from preview if available
            if (previewImage) {
                values.avatar = previewImage;
            }

            await onSave(values);
            message.success(
                `User ${isEditing ? "updated" : "created"} successfully`
            );
            form.resetFields();
            setPreviewImage(null);
            onCancel();
        } catch (error) {
            console.error("Form validation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle avatar upload
    const handleAvatarChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList);

        if (newFileList.length > 0 && newFileList[0].originFileObj) {
            // For demo purposes, we'll use a placeholder image
            // In a real app, you would upload the image to your server
            setPreviewImage(
                `/placeholder.svg?height=200&width=200&query=person`
            );
        } else {
            setPreviewImage(null);
        }
    };

    // Generate a random password
    const generateRandomPassword = () => {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        form.setFieldsValue({ password, confirmPassword: password });
    };

    // Tab items configuration
    const tabItems: TabsProps["items"] = [
        {
            key: "1",
            label: "Basic Info",
            children: (
                <div className="space-y-4">
                    <div className="flex flex-col items-center mb-6">
                        <Avatar
                            size={100}
                            icon={<UserOutlined />}
                            src={previewImage}
                            className="mb-4"
                        />
                        <Upload
                            fileList={fileList}
                            onChange={handleAvatarChange}
                            beforeUpload={() => false}
                            maxCount={1}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>
                                {previewImage
                                    ? "Change Avatar"
                                    : "Upload Avatar"}
                            </Button>
                        </Upload>
                    </div>

                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter full name",
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Full Name"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter email address",
                            },
                            {
                                type: "email",
                                message: "Please enter a valid email",
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email Address"
                        />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name="phone">
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="Phone Number"
                            />
                        </Form.Item>

                        <Form.Item name="position">
                            <Input
                                prefix={<IdcardOutlined />}
                                placeholder="Position/Title"
                            />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="role"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a role",
                                },
                            ]}
                        >
                            <Select placeholder="Select Role">
                                <Select.Option value="admin">
                                    Admin
                                </Select.Option>
                                <Select.Option value="editor">
                                    Editor
                                </Select.Option>
                                <Select.Option value="author">
                                    Author
                                </Select.Option>
                                <Select.Option value="contributor">
                                    Contributor
                                </Select.Option>
                                <Select.Option value="moderator">
                                    Moderator
                                </Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="status"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a status",
                                },
                            ]}
                        >
                            <Select placeholder="Select Status">
                                <Select.Option value="active">
                                    Active
                                </Select.Option>
                                <Select.Option value="inactive">
                                    Inactive
                                </Select.Option>
                                <Select.Option value="pending">
                                    Pending
                                </Select.Option>
                                <Select.Option value="suspended">
                                    Suspended
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item name="department">
                        <Select placeholder="Select Department">
                            <Select.Option value="News">News</Select.Option>
                            <Select.Option value="Sports">Sports</Select.Option>
                            <Select.Option value="Entertainment">
                                Entertainment
                            </Select.Option>
                            <Select.Option value="Politics">
                                Politics
                            </Select.Option>
                            <Select.Option value="Business">
                                Business
                            </Select.Option>
                            <Select.Option value="Technology">
                                Technology
                            </Select.Option>
                            <Select.Option value="Health">Health</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="bio">
                        <Input.TextArea
                            placeholder="Short biography or description"
                            rows={4}
                        />
                    </Form.Item>
                </div>
            ),
        },
        {
            key: "2",
            label: "Password & Security",
            children: (
                <div className="space-y-4">
                    {!isEditing && (
                        <div className="mb-4">
                            <Form.Item
                                name="generatePassword"
                                valuePropName="checked"
                                noStyle
                            >
                                <Checkbox
                                    checked={generatePassword}
                                    onChange={(e) =>
                                        setGeneratePassword(e.target.checked)
                                    }
                                >
                                    Generate random password and send to user
                                </Checkbox>
                            </Form.Item>
                        </div>
                    )}

                    {(!generatePassword || isEditing) && (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="text-base font-medium mb-2">
                                    Set Password
                                </div>
                                {!isEditing && (
                                    <Button
                                        type="link"
                                        onClick={generateRandomPassword}
                                        size="small"
                                    >
                                        Generate Random
                                    </Button>
                                )}
                            </div>

                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: !generatePassword,
                                        message: "Please enter password",
                                    },
                                    {
                                        min: 8,
                                        message:
                                            "Password must be at least 8 characters",
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Password"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                dependencies={["password"]}
                                rules={[
                                    {
                                        required: !generatePassword,
                                        message: "Please confirm password",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue("password") ===
                                                    value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    "The two passwords do not match"
                                                )
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Confirm Password"
                                />
                            </Form.Item>
                        </>
                    )}

                    <Divider />

                    <div className="space-y-3">
                        <Form.Item
                            name="sendWelcomeEmail"
                            valuePropName="checked"
                        >
                            <Checkbox>Send welcome email</Checkbox>
                        </Form.Item>

                        <Form.Item
                            name="requirePasswordChange"
                            valuePropName="checked"
                        >
                            <Checkbox>
                                Require password change on first login
                            </Checkbox>
                        </Form.Item>
                    </div>
                </div>
            ),
        },
        {
            key: "3",
            label: "Permissions",
            children: (
                <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                        <div className="flex items-start">
                            <InfoCircleOutlined className="text-blue-500 mt-1 mr-2" />
                            <p className="text-sm text-blue-800 mb-0">
                                Permissions are based on roles but can be
                                customized for each user. The role selected will
                                pre-select the default permissions.
                            </p>
                        </div>
                    </div>

                    <Divider orientation="left">Content Permissions</Divider>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Form.Item
                            name={["permissions", "create_post"]}
                            valuePropName="checked"
                        >
                            <Checkbox>Create Posts</Checkbox>
                        </Form.Item>

                        <Form.Item
                            name={["permissions", "edit_post"]}
                            valuePropName="checked"
                        >
                            <Checkbox>Edit Posts</Checkbox>
                        </Form.Item>

                        <Form.Item
                            name={["permissions", "delete_post"]}
                            valuePropName="checked"
                        >
                            <Checkbox>Delete Posts</Checkbox>
                        </Form.Item>

                        <Form.Item
                            name={["permissions", "publish_post"]}
                            valuePropName="checked"
                        >
                            <Checkbox>Publish Posts</Checkbox>
                        </Form.Item>
                    </div>

                    <Divider orientation="left">
                        Administrative Permissions
                    </Divider>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Form.Item
                            name={["permissions", "manage_users"]}
                            valuePropName="checked"
                        >
                            <Checkbox>Manage Users</Checkbox>
                        </Form.Item>

                        <Form.Item
                            name={["permissions", "manage_settings"]}
                            valuePropName="checked"
                        >
                            <Checkbox>Manage Settings</Checkbox>
                        </Form.Item>

                        <Form.Item
                            name={["permissions", "manage_comments"]}
                            valuePropName="checked"
                        >
                            <Checkbox>Manage Comments</Checkbox>
                        </Form.Item>

                        <Form.Item
                            name={["permissions", "manage_categories"]}
                            valuePropName="checked"
                        >
                            <Checkbox>Manage Categories</Checkbox>
                        </Form.Item>

                        <Form.Item
                            name={["permissions", "manage_media"]}
                            valuePropName="checked"
                        >
                            <Checkbox>Manage Media</Checkbox>
                        </Form.Item>
                    </div>
                </div>
            ),
        },
        {
            key: "4",
            label: "Additional Info",
            children: (
                <div className="space-y-4">
                    <Divider orientation="left">Social Media</Divider>

                    <Form.Item name={["socialLinks", "twitter"]}>
                        <Input
                            addonBefore="Twitter"
                            prefix={<GlobalOutlined />}
                            placeholder="Username or URL"
                        />
                    </Form.Item>

                    <Form.Item name={["socialLinks", "linkedin"]}>
                        <Input
                            addonBefore="LinkedIn"
                            prefix={<GlobalOutlined />}
                            placeholder="Profile URL"
                        />
                    </Form.Item>

                    <Form.Item name={["socialLinks", "facebook"]}>
                        <Input
                            addonBefore="Facebook"
                            prefix={<GlobalOutlined />}
                            placeholder="Profile URL"
                        />
                    </Form.Item>

                    <Divider orientation="left">Address Information</Divider>

                    <Form.Item name={["address", "street"]}>
                        <Input placeholder="Street Address" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name={["address", "city"]}>
                            <Input placeholder="City" />
                        </Form.Item>

                        <Form.Item name={["address", "state"]}>
                            <Input placeholder="State/Province" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name={["address", "zipCode"]}>
                            <Input placeholder="ZIP/Postal Code" />
                        </Form.Item>

                        <Form.Item name={["address", "country"]}>
                            <Select placeholder="Select Country">
                                <Select.Option value="US">
                                    United States
                                </Select.Option>
                                <Select.Option value="CA">Canada</Select.Option>
                                <Select.Option value="UK">
                                    United Kingdom
                                </Select.Option>
                                <Select.Option value="AU">
                                    Australia
                                </Select.Option>
                                <Select.Option value="IN">India</Select.Option>
                                {/* Add more countries as needed */}
                            </Select>
                        </Form.Item>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Modal
            title={
                <div className="flex items-center">
                    {isEditing ? (
                        <EditUserIcon className="mr-2" />
                    ) : (
                        <CreateUserIcon className="mr-2" />
                    )}
                    <span>{isEditing ? "Edit User" : "Create New User"}</span>
                </div>
            }
            open={open}
            width={700}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                >
                    {isEditing ? "Update User" : "Create User"}
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: "active",
                    role: "editor",
                    sendWelcomeEmail: true,
                    requirePasswordChange: true,
                }}
                className="user-create-form"
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    className="user-form-tabs"
                />
            </Form>
        </Modal>
    );
};

// Custom icons for the modal title
const CreateUserIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="16" y1="11" x2="22" y2="11" />
    </svg>
);

const EditUserIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 12l-4 4-1.5-1.5" />
    </svg>
);

export default UserCreateModal;
