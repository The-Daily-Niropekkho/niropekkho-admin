"use client";
import { useTheme } from "@/components/theme-context";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import useAuth from "@/hooks/useAuth";
import {
    useResendOtpMutation,
    useSendLoginRequestMutation,
} from "@/redux/features/auth/authApi";
import { signin } from "@/service/auth";
import { TError } from "@/types";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Spin, Typography } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [tokenID, setTokenID] = useState("");
    const [countdown, setCountdown] = useState(59);
    const [redirect, setRedirect] = useState("/dashboard");
    const { isDark } = useTheme();

    const [loginForm] = Form.useForm();
    const [otpForm] = Form.useForm();

    const router = useRouter();
    const { login } = useAuth();

    const [getLoginOTP] = useSendLoginRequestMutation();
    const [resendOtp] = useResendOtpMutation();

    useEffect(() => {
        setMounted(true);

        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token_id");
        const redirectParam = params.get("redirect");

        if (urlToken) {
            setTokenID(urlToken);
            setShowOtpForm(true);
        }
        if (redirectParam) {
            setRedirect(decodeURIComponent(redirectParam));
        }
    }, []);

    useEffect(() => {
        if (showOtpForm && countdown > 0) {
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
    }, [showOtpForm, countdown]);

    const handleLogin = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response: any = await getLoginOTP({
                ...values,
                user_type: "admin",
            }).unwrap();

            if (response?.success) {
                const tokenId = response?.data?.token_id;
                setTokenID(tokenId);
                setShowOtpForm(true);
                router.replace(
                    `/auth/signin?token_id=${tokenId}&redirect=${encodeURIComponent(
                        redirect
                    )}`
                );
                message.success("OTP sent to your email.");
                setCountdown(59);
            } else {
                message.error(response?.data?.message || "Failed to send OTP");
            }
        } catch (error) {
            const errorResponse = error as TError;
            message.error(
                errorResponse?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async (values: { otp: string }) => {
        setOtpLoading(true);
        try {
            const response = await signin({
                token_id: tokenID,
                otp: values.otp,
            });

            if (response.success) {
                localStorage.setItem("token", response.data.accessToken);
                login(response.data.userData);
                message.success("Logged In Successfully");
                router.replace(redirect);
            } else {
                message.error(response.message || "OTP verification failed");
            }
        } catch (error) {
            const errorResponse = error as TError;
            message.error(
                errorResponse?.data?.message || "Something went wrong"
            );
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!tokenID) {
            message.error("No token ID found");
            return;
        }
        const response: any = await resendOtp({
            token_id: tokenID,
        });

        if (response?.data?.success) {
            const tokenId = response?.data?.data.token_id;
            setTokenID(tokenId);
            setCountdown(59);
            message.success("OTP resent.");
        } else {
            message.error("Failed to resend OTP.");
        }
    };

    if (!mounted) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    background: isDark ? "#1A2231" : "#ffffff",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
                width: "100%",
                maxWidth: "420px",
                padding: "32px",
                background: isDark ? "#1A2231" : "#ffffff",
                borderRadius: "16px",
                boxShadow:
                    "0 10px 30px rgba(0, 0, 0, 0.06), 0 6px 10px rgba(0, 0, 0, 0.04)",
            }}
        >
            <div className="text-center mb-8">
                <Typography.Title level={3} style={{ marginBottom: 4 }}>
                    {showOtpForm ? "Verify OTP" : "Welcome Back"}
                </Typography.Title>
                <Typography.Text type="secondary">
                    {showOtpForm
                        ? `Enter the 6-digit OTP sent to ${
                              loginForm.getFieldValue("email") || ""
                          }`
                        : "Welcome to Naria! Sign in to continue"}
                </Typography.Text>
            </div>

            {!showOtpForm ? (
                <Form
                    form={loginForm}
                    layout="vertical"
                    onFinish={handleLogin}
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Invalid email address" },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email Address"
                            style={{
                                height: "50px",
                                borderRadius: "10px",
                                background: isDark ? "transparent" : "#f9fafb",
                                border: "1px solid #e5e7eb",
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: "Password is required" },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            style={{
                                height: "50px",
                                borderRadius: "10px",
                                background: isDark ? "transparent" : "#f9fafb",
                                border: "1px solid #e5e7eb",
                            }}
                        />
                    </Form.Item>

                    <div style={{ textAlign: "right", marginBottom: 16 }}>
                        <Link
                            href="/auth/forgot-password"
                            style={{ color: "#10b981", fontWeight: 500 }}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                height: "50px",
                                borderRadius: "10px",
                                background: "#10b981",
                                border: "none",
                                fontWeight: "500",
                                fontSize: "1rem",
                            }}
                        >
                            Sign In
                        </Button>
                    </motion.div>
                </Form>
            ) : (
                <Form
                    form={otpForm}
                    layout="vertical"
                    onFinish={handleOtpVerify}
                    size="large"
                >
                    <Form.Item
                        name="otp"
                        rules={[
                            { required: true, message: "OTP is required" },
                            { len: 6, message: "OTP must be 6 digits" },
                        ]}
                    >
                        <Input.OTP size="large" length={6} />
                    </Form.Item>

                    <div style={{ textAlign: "right", marginBottom: 12 }}>
                        {countdown > 0 ? (
                            <span style={{ fontSize: 14, color: "#999" }}>
                                Resend OTP in {countdown}s
                            </span>
                        ) : (
                            <Button
                                type="link"
                                style={{ color: "#10b981", padding: 0 }}
                                onClick={handleResendOtp}
                            >
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
                            loading={otpLoading}
                            block
                            style={{
                                height: "50px",
                                borderRadius: "10px",
                                background: "#10b981",
                                border: "none",
                                fontWeight: "500",
                                fontSize: "1rem",
                            }}
                        >
                            Verify OTP
                        </Button>
                    </motion.div>
                </Form>
            )}
        </motion.div>
    );
}
