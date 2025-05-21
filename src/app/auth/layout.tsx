"use client";

import { useTheme } from "@/components/theme-context";
import { Typography } from "antd";
import { motion } from "framer-motion";
const { Title, Text } = Typography;

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isDark } = useTheme();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 },
        },
    };

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: isDark ? "#111827" : "#f9fafb",
                overflow: "hidden",
            }}
        >
            {/* Left side - Illustration */}
            <div
                style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: isDark
                        ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
                        : "linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)",
                    padding: "2rem",
                    position: "relative",
                    overflow: "hidden",
                }}
                className="hidden md:flex"
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                        zIndex: 1,
                        textAlign: "center",
                        maxWidth: "500px",
                    }}
                >
                    <div
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "24px",
                            background: "rgba(255, 255, 255, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 2rem",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <svg
                            width="60"
                            height="60"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ color: "white" }}
                        >
                            <path
                                d="M12 2L2 7L12 12L22 7L12 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M2 17L12 22L22 17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M2 12L12 17L22 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <Title
                        level={1}
                        style={{
                            color: "white",
                            fontSize: "2.5rem",
                            marginBottom: "1rem",
                            fontWeight: "bold",
                        }}
                    >
                        নিরপেক্ষ News
                    </Title>
                    <Text
                        style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontSize: "1.1rem",
                            display: "block",
                            marginBottom: "2rem",
                        }}
                    >
                        Welcome to the newspaper admin dashboard. Manage your
                        content, users, and analytics all in one place.
                    </Text>

                    <div
                        style={{
                            display: "flex",
                            gap: "1rem",
                            justifyContent: "center",
                            marginTop: "2rem",
                        }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                background: "white",
                            }}
                        />
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                background: "rgba(255, 255, 255, 0.5)",
                            }}
                        />
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                background: "rgba(255, 255, 255, 0.5)",
                            }}
                        />
                    </div>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                    animate={{
                        y: [0, 15, 0],
                        x: [0, 5, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                    style={{
                        position: "absolute",
                        top: "15%",
                        left: "15%",
                        width: "60px",
                        height: "60px",
                        borderRadius: "16px",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                    }}
                />
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        x: [0, -10, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                    style={{
                        position: "absolute",
                        bottom: "20%",
                        right: "15%",
                        width: "80px",
                        height: "80px",
                        borderRadius: "20px",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                    }}
                />
                <motion.div
                    animate={{
                        y: [0, 10, 0],
                        x: [0, -5, 0],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                    }}
                    style={{
                        position: "absolute",
                        top: "60%",
                        left: "25%",
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                    }}
                />
            </div>

            {/* Right side - Login form */}
            <div
                style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "2rem",
                    background: isDark ? "#1f2937" : "white",
                }}
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                    }}
                >
                    <motion.div variants={itemVariants}>{children}</motion.div>
                </motion.div>
            </div>
        </div>
    );
}
