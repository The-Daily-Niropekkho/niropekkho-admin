/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ActivityLogs from "@/components/features/profile/activity-logs";
import ChangePassword from "@/components/features/profile/change-password";
import ProfileInformation from "@/components/features/profile/profile-information";
import Loader from "@/components/shared/loader";
import { useTheme } from "@/components/theme-context";
import { useGetUserProfileQuery } from "@/redux/features/auth/authApi";
import type { Admin, Moderator, Writer } from "@/types/user";
import fileObjectToLink from "@/utils/fileObjectToLink";
import {
    HomeOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Col, Divider, Row, Tabs, Tag } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { isDark } = useTheme();
    const { data: user, isLoading } = useGetUserProfileQuery(undefined);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("1");

    // Get specific profile data
    const getProfileData = (): Admin | Writer | Moderator | null => {
        if (!user) return null;

        switch (user.user_type) {
            case "admin":
                return user.admin;
            case "writer":
                return user.writer;
            case "moderator":
                return user.moderator;
            default:
                return null;
        }
    };

    const profileData = getProfileData();

    // Parse query param manually
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        if (tab && ["1", "2", "3"].includes(tab)) {
            setActiveTab(tab);
        }
    }, []);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        router.push(`/dashboard/profile?tab=${key}`, { scroll: false });
    };

    if (isLoading) {
        return <Loader/>
    }

    if (!user || !profileData) {
        return <div>No user data available</div>;
    }

    const tabItems = [
        {
            key: "1",
            label: "Profile Information",
            children: (
                <ProfileInformation user={user} profileData={profileData} />
            ),
        },
        {
            key: "2",
            label: "Change Password",
            children: <ChangePassword />,
        },
        {
            key: "3",
            label: "Activity Log",
            children: <ActivityLogs />,
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
                    {user.user_type.charAt(0).toUpperCase() +
                        user.user_type.slice(1)}{" "}
                    Profile
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
                        style={{
                            borderRadius: "8px",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            background: isDark ? "#1f2937" : "#ffffff",
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <Avatar
                                size={100}
                                src={fileObjectToLink(
                                    profileData.profile_image
                                )}
                                icon={<UserOutlined />}
                            />
                            <h2
                                style={{
                                    marginTop: 16,
                                    marginBottom: 4,
                                    color: isDark ? "#fff" : "#000",
                                }}
                            >
                                {profileData.first_name}{" "}
                                {profileData.last_name}
                            </h2>
                            <p
                                style={{
                                    color: isDark
                                        ? "rgba(255, 255, 255, 0.45)"
                                        : "rgba(0, 0, 0, 0.45)",
                                    marginBottom: 16,
                                }}
                            >
                                {user.user_type.charAt(0).toUpperCase() +
                                    user.user_type.slice(1)}
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
                                        {user.email}
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
                                        {profileData.mobile || "Not provided"}
                                    </p>
                                </Col>
                                {(user.user_type === "writer" ||
                                    user.user_type === "moderator") && (
                                    <>
                                        {(profileData as Writer | Moderator)
                                            .address_line_one && (
                                            <Col span={24}>
                                                <p
                                                    style={{
                                                        color: isDark
                                                            ? "rgba(255, 255, 255, 0.85)"
                                                            : "rgba(0, 0, 0, 0.85)",
                                                    }}
                                                >
                                                    <HomeOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    {
                                                        (
                                                            profileData as
                                                                | Writer
                                                                | Moderator
                                                        ).address_line_one
                                                    }
                                                </p>
                                            </Col>
                                        )}
                                        {(profileData as Writer | Moderator)
                                            .designation && (
                                            <Col span={24}>
                                                <p
                                                    style={{
                                                        color: isDark
                                                            ? "rgba(255, 255, 255, 0.85)"
                                                            : "rgba(0, 0, 0, 0.85)",
                                                    }}
                                                >
                                                    <UserOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    {
                                                        (
                                                            profileData as
                                                                | Writer
                                                                | Moderator
                                                        ).designation
                                                    }
                                                </p>
                                            </Col>
                                        )}
                                    </>
                                )}
                            </Row>
                            <Divider
                                style={{
                                    borderColor: isDark ? "#303030" : "#f0f0f0",
                                }}
                            />
                            <div>
                                <h4
                                    style={{
                                        color: isDark ? "#fff" : "#000",
                                        marginBottom: 8,
                                    }}
                                >
                                    Account Status
                                </h4>
                                <div style={{ marginTop: 8 }}>
                                    <Tag
                                        color={
                                            user.is_online ? "green" : "default"
                                        }
                                    >
                                        {user.is_online ? "Online" : "Offline"}
                                    </Tag>
                                    <Tag
                                        color={
                                            user.is_email_verified
                                                ? "blue"
                                                : "orange"
                                        }
                                    >
                                        {user.is_email_verified
                                            ? "Email Verified"
                                            : "Email Not Verified"}
                                    </Tag>
                                    <Tag
                                        color={
                                            user.status === "active"
                                                ? "green"
                                                : "red"
                                        }
                                    >
                                        {user.status}
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={16}>
                    <Card
                        style={{
                            borderRadius: "8px",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            background: isDark ? "#1f2937" : "#ffffff",
                        }}
                    >
                        <Tabs
                            activeKey={activeTab}
                            onChange={handleTabChange}
                            items={tabItems}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
}
