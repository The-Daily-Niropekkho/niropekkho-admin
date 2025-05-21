/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useForgetPasswordMutation,
  useGetTokenOTPforgetPasswordMutation,
  useResetPasswordMutation,
} from "@/redux/features/auth/authApi";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForgotPasswordAntd() {
    const router = useRouter();
    const [form] = Form.useForm();
    const [otpForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const [step, setStep] = useState(1);
    const [countdown, setCountdown] = useState(59);
    const [email, setEmail] = useState("");
    const [tokenID, setTokenID] = useState("");
    const [resetToken, setResetToken] = useState("");

    const [getOtp] = useForgetPasswordMutation();
    const [verifyOtp] = useGetTokenOTPforgetPasswordMutation();
    const [resetPassword] = useResetPasswordMutation();

    useEffect(() => {
        if (step === 2 && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step, countdown]);

    const handleEmailSubmit = async (values: { email: string }) => {
        try {
            const res: any = await getOtp({
                email: values.email,
                user_type: "admin",
            });
            if (res.data?.success) {
                setEmail(values.email);
                setTokenID(res.data.data.token_id);
                setStep(2);
                setCountdown(59);
                message.success("OTP sent to your email.");
            } else {
                message.error(
                    res?.error?.data?.message || "Failed to send OTP"
                );
            }
        } catch {
            message.error("Something went wrong");
        }
    };

    const handleOtpSubmit = async (values: { otp: string }) => {
        try {
            const res: any = await verifyOtp({
                token_id: tokenID,
                otp: values.otp,
            });
            if (res.data?.success) {
                setResetToken(res.data.data.resetPasswordToken);
                setTokenID(res.data.data.token_id);
                setStep(3);
                message.success("OTP verified. Please reset your password.");
            } else {
                message.error(res?.error?.data?.message || "Invalid OTP");
            }
        } catch {
            message.error("Verification failed");
        }
    };

    const handlePasswordSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
        if (values.newPassword !== values.confirmPassword) {
            return message.error("Passwords do not match");
        }
        try {
            const res: any = await resetPassword({
                resetPasswordToken: resetToken,
                newPassword: values.newPassword,
                token_id: tokenID,
            });
            if (res.data?.success) {
                message.success(
                    "Password changed successfully. Redirecting..."
                );
                router.push("/auth/signin");
            } else {
                message.error(
                    res?.error?.data?.message || "Failed to reset password"
                );
            }
        } catch {
            message.error("Error resetting password");
        }
    };

    const handleResendOtp = async () => {
        try {
            const res: any = await getOtp({ email, user_type: "b2b" });
            if (res.data?.success) {
                setCountdown(59);
                message.success("OTP resent");
            } else {
                message.error("Failed to resend OTP");
            }
        } catch {
            message.error("Error resending OTP");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto", padding: 24 }}>
            <h1 className="text-3xl font-bold text-center mb-6">
                {step === 1
                    ? "Forgot Password"
                    : step === 2
                    ? "Verify OTP"
                    : "Reset Password"}
            </h1>

            {step === 1 && (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEmailSubmit}
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Enter a valid email" },
                        ]}
                    >
                        <Input
                            prefix={
                                <MailOutlined
                                    style={{ color: "rgba(0, 0, 0, 0.25)" }}
                                />
                            }
                            placeholder="Email Address"
                            style={{
                                height: 50,
                                borderRadius: 10,
                                background: "#f9fafb",
                                border: "1px solid #e5e7eb",
                            }}
                        />
                    </Form.Item>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            style={{
                                height: 50,
                                borderRadius: 10,
                                background: "#10b981",
                                border: "none",
                                fontWeight: 500,
                                fontSize: "1rem",
                            }}
                        >
                            Send OTP
                        </Button>
                    </motion.div>
                </Form>
            )}

            {step === 2 && (
                <Form
                    form={otpForm}
                    layout="vertical"
                    onFinish={handleOtpSubmit}
                    size="large"
                >
                    <Form.Item
                        name="otp"
                        rules={[
                            { required: true, message: "OTP is required" },
                            { len: 6, message: "OTP must be 6 digits" },
                        ]}
                    >
                        <Input
                            maxLength={6}
                            placeholder="Enter OTP"
                            style={{
                                height: 50,
                                borderRadius: 10,
                                letterSpacing: 5,
                                background: "#f9fafb",
                                border: "1px solid #e5e7eb",
                            }}
                        />
                    </Form.Item>

                    <div style={{ textAlign: "right", marginBottom: 16 }}>
                        {countdown > 0 ? (
                            <span style={{ fontSize: 14, color: "#999" }}>
                                Resend OTP in {countdown}s
                            </span>
                        ) : (
                            <Button type="link" onClick={handleResendOtp}>
                                Resend OTP
                            </Button>
                        )}
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            style={{
                                height: 50,
                                borderRadius: 10,
                                background: "#10b981",
                                border: "none",
                                fontWeight: 500,
                                fontSize: "1rem",
                            }}
                        >
                            Verify OTP
                        </Button>
                    </motion.div>
                </Form>
            )}

            {step === 3 && (
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordSubmit}
                    size="large"
                >
                    <Form.Item
                        name="newPassword"
                        rules={[
                            { required: true, message: "Enter a new password" },
                        ]}
                    >
                        <Input.Password
                            placeholder="New Password"
                            iconRender={(visible) =>
                                visible ? (
                                    <EyeTwoTone />
                                ) : (
                                    <EyeInvisibleOutlined />
                                )
                            }
                            style={{
                                height: 50,
                                borderRadius: 10,
                                background: "#f9fafb",
                                border: "1px solid #e5e7eb",
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            {
                                required: true,
                                message: "Confirm your password",
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
                                        new Error("Passwords do not match")
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Confirm Password"
                            iconRender={(visible) =>
                                visible ? (
                                    <EyeTwoTone />
                                ) : (
                                    <EyeInvisibleOutlined />
                                )
                            }
                            style={{
                                height: 50,
                                borderRadius: 10,
                                background: "#f9fafb",
                                border: "1px solid #e5e7eb",
                            }}
                        />
                    </Form.Item>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            style={{
                                height: 50,
                                borderRadius: 10,
                                background: "#10b981",
                                border: "none",
                                fontWeight: 500,
                                fontSize: "1rem",
                            }}
                        >
                            Change Password
                        </Button>
                    </motion.div>
                </Form>
            )}
        </div>
    );
}
