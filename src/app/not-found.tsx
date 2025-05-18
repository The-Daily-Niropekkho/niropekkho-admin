"use client";
import { useTheme } from "@/components/theme-context";
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Result, Space } from "antd";
import Link from "next/link";

export default function NotFound() {
    const { isDark } = useTheme();

    const styles = {
        pageContainer: {
            display: "flex",
            minHeight: "100vh",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            backgroundColor: isDark ? "#111827" : "#f9fafb",
        },
        card: {
            maxWidth: "480px",
            width: "100%",
            textAlign: "center" as const,
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
        },
        cardContent: {
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: "24px",
            padding: "32px 24px",
        },
        iconContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: isDark ? "rgba(220, 38, 38, 0.1)" : "#fee2e2",
        },
        buttonContainer: {
            display: "flex",
            flexDirection: "column" as const,
            gap: "12px",
            width: "100%",
            marginTop: "8px",
            "@media (min-width: 640px)": {
                flexDirection: "row",
            },
        },
        primaryButton: {
            backgroundColor: "#10b981",
            borderColor: "#10b981",
            width: "100%",
        },
        secondaryButton: {
            width: "100%",
        },
    };

    // Media query for button container
    const buttonContainerStyle = {
        ...styles.buttonContainer,
        flexDirection:
            window.innerWidth >= 640 ? ("row" as const) : ("column" as const),
    };

    return (
        <div style={styles.pageContainer}>
            <Card style={styles.card} bordered>
                <div style={styles.cardContent}>
                    <Result
                        status="404"
                        title="404"
                        subTitle="Sorry, the page you visited does not exist."
                        icon={
                            <div style={styles.iconContainer}>
                                <svg
                                    viewBox="0 0 24 24"
                                    width="48"
                                    height="48"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ color: "#dc2626" }}
                                >
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line
                                        x1="9.5"
                                        y1="12.5"
                                        x2="14.5"
                                        y2="17.5"
                                    ></line>
                                    <line
                                        x1="14.5"
                                        y1="12.5"
                                        x2="9.5"
                                        y2="17.5"
                                    ></line>
                                </svg>
                            </div>
                        }
                    />

                    <Divider style={{ margin: "0" }} />

                    <Space direction="vertical" style={{ width: "100%" }}>
                        <div style={buttonContainerStyle}>
                            <Link href="/" style={{ width: "100%" }}>
                                <Button
                                    type="primary"
                                    icon={<HomeOutlined />}
                                    size="large"
                                    style={styles.primaryButton}
                                >
                                    Back to Home
                                </Button>
                            </Link>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                size="large"
                                onClick={() => window.history.back()}
                                style={styles.secondaryButton}
                            >
                                Go Back
                            </Button>
                        </div>
                    </Space>
                </div>
            </Card>
        </div>
    );
}
