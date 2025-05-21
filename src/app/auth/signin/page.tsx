/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useAuth from "@/hooks/useAuth";
import { useSendLoginRequestMutation } from "@/redux/features/auth/authApi";
import { signin } from "@/service/auth";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Spin } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [tokenID, setTokenID] = useState("");
    const [countdown, setCountdown] = useState(59);

    const [loginForm] = Form.useForm();
    const [otpForm] = Form.useForm();

    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const [getLoginOTP] = useSendLoginRequestMutation();

    useEffect(() => {
        setMounted(true);

        const urlToken = searchParams.get("token_id");
        if (urlToken) {
            setTokenID(urlToken);
            setShowOtpForm(true);
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

        try {
            console.log("Login values: ", {
                ...values,
                user_type: "admin",
            });
            
            const response: any = await getLoginOTP({
                ...values,
                user_type: "admin",
            }).unwrap();
            console.log("Login response: ", response);

            if (response?.success) {
                const tokenId = response.data.token_id;
                setTokenID(tokenId);
                setShowOtpForm(true);
                router.replace(`/auth/signin?token_id=${tokenId}`);
                message.success("OTP sent to your email.");
                setCountdown(59);
            } else {
                message.error(response?.error?.data?.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error("Login error: ", error);

            message.error("Something went wrong.");
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
                router.replace(decodeURIComponent(searchParams.get("redirect") || "/dashboard"));
            } else {
                message.error(response.message || "OTP verification failed");
            }
        } catch {
            message.error("Something went wrong");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOtp = async () => {
        const values = loginForm.getFieldsValue();
        const response = await getLoginOTP({
            ...values,
            user_type: "b2b",
        });

        if (response?.data?.success) {
            const tokenId = response.data.data.token_id;
            setTokenID(tokenId);
            router.replace(`/auth/signin?token_id=${tokenId}`);
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
                    background: "#f9fafb",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 400, margin: "0 auto", padding: 24 }}>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {showOtpForm ? "Verify OTP" : "Welcome Back"}
                </h1>
                <p className="mt-2 text-gray-600">
                    {showOtpForm
                        ? `Enter the 6-digit OTP sent to ${loginForm.getFieldValue("email") || ""}`
                        : "Welcome to Naria! Sign in to continue"}
                </p>
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
                            prefix={<MailOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
                            placeholder="Email Address"
                            style={{
                                height: "50px",
                                borderRadius: "10px",
                                background: "#f9fafb",
                                border: "1px solid #e5e7eb",
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: "Password is required" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />}
                            placeholder="Password"
                            style={{
                                height: "50px",
                                borderRadius: "10px",
                                background: "#f9fafb",
                                border: "1px solid #e5e7eb",
                            }}
                        />
                    </Form.Item>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div />
                        <Link
                            href="/auth/forgot-password"
                            style={{ color: "#10b981", fontWeight: 500 }}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                borderRadius: "10px",
                                background: "#10b981",
                                border: "none",
                                fontWeight: "500",
                                fontSize: "1rem",
                                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                                marginTop: 24,
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
                        <Input
                            placeholder="Enter OTP"
                            maxLength={6}
                            style={{
                                height: "50px",
                                borderRadius: "10px",
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

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                            }}
                        >
                            Verify OTP
                        </Button>
                    </motion.div>
                </Form>
            )}
        </div>
    );
}
