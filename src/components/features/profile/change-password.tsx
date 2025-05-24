import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { TError } from "@/types";
import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useState } from "react";

export default function ChangePassword() {
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [changePassword] = useChangePasswordMutation();

    const handlePasswordChange = async (values: any) => {
        if (values.newPassword !== values.confirmPassword) {
            return message.error("Confirm Password not matched");
        }
        try {
            setLoading(true);

            await changePassword({
                oldPassword: values.currentPassword,
                newPassword: values.newPassword,
            }).unwrap();
            message.success("Password changed successfully!");
            passwordForm.resetFields();
        } catch (error) {
            const errorResponse = error as TError;
            message.error(
                errorResponse.data?.message ||
                    "Failed to update profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (

         <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handlePasswordChange}
            >
                <Form.Item
                    label="Current Password"
                    name="currentPassword"
                    rules={[
                        {
                            required: true,
                            message: "Please input your current password!",
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Current Password"
                    />
                </Form.Item>
                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            message: "Please input your new password!",
                        },
                        {
                            min: 8,
                            message: "Password must be at least 8 characters!",
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
                    dependencies={["newPassword"]}
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your new password!",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("newPassword") === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("The two passwords do not match!")
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
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
    );
}
