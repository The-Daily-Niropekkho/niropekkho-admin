/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useTheme } from "@/components/theme-context";
import { useMobile } from "@/hooks/use-mobile";
import {
    BulbFilled,
    BulbOutlined,
    DownOutlined,
    EditOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SearchOutlined,
    SettingOutlined,
    SolutionOutlined,
    UserOutlined
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Dropdown,
    Input,
    Layout,
    message,
    Skeleton,
    Tooltip,
} from "antd";

import useAuth from "@/hooks/useAuth";
import { useSession } from "@/provider/session-provider";
import { baseApi } from "@/redux/api/baseApi";
import { useGetUserProfileQuery } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { signout } from "@/service/auth";
import fileObjectToLink from "@/utils/fileObjectToLink";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotificationMenu from "./notification-menu";

const { Header } = Layout;

interface HeaderProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    pageTitle?: string;
}

export default function AppHeader({
    collapsed,
    setCollapsed,
    pageTitle = "Dashboard",
}: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const isMobile = useMobile();
    const { data: user, isLoading } = useGetUserProfileQuery(undefined);
    const router = useRouter();
    const { setIsLoading } = useSession();
    const { logout } = useAuth();
    const dispatch = useAppDispatch();
    
    async function handleLogout() {
        setIsLoading(true);
        localStorage.removeItem("token");
        await signout();
        router.push("/auth/signin");
        router.refresh();
        logout();
        dispatch(baseApi.util.resetApiState());
        message.success("Logged out successfully");
    }

    const isDark = theme === "dark";
    const primaryColor = "#10b981";

    const userMenuItems = [
        {
            key: "1",
            icon: <UserOutlined />,
            label: <Link href="/dashboard/profile?tab=1">My Profile</Link>,
        },
        {
            key: "2",
            icon: <EditOutlined />,
            label: <Link href="/dashboard/profile?tab=2">Change Password</Link>,
        },
        {
            key: "3",
            icon: <SolutionOutlined />,
            label: <Link href="/dashboard/profile?tab=3">Activity Logs</Link>,
        },
        {
            key: "4",
            icon: <SettingOutlined />,
            label: <Link href="/dashboard/settings">Settings</Link>,
        },
        {
            type: "divider" as const,
        },
        {
            key: "5",
            icon: <LogoutOutlined />,
            label: (
                <span onClick={handleLogout}>
                    Sign Out
                </span>
            ),
        },
    ];

    return (
        <Header
            style={{
                padding: 0,
                background: isDark ? "#1f2937" : "#ffffff",
                boxShadow: "0 0 3px rgba(0, 0, 0, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 999,
                height: "80px",
                borderBottom: `1px solid ${
                    isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"
                }`,
            }}
        >
            <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                    type="link"
                    icon={
                        collapsed ? (
                            <MenuUnfoldOutlined />
                        ) : (
                            <MenuFoldOutlined />
                        )
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: "16px",
                        width: 64,
                        height: 80,
                        color: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.65)",
                    }}
                />
                {!isMobile && (
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            padding: "0 5px",
                            maxWidth: "500px",
                            flex: 1,
                            color: isDark ? "#ffffff" : "#111827",
                            marginLeft: "20px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <Input
                            placeholder="Search for anything..."
                            prefix={
                                <SearchOutlined
                                    style={{
                                        color: primaryColor,
                                        fontSize: "16px",
                                    }}
                                />
                            }
                            style={{
                                width: "100%",
                                border: "none",
                                padding: "10px 15px",
                                height: "42px",
                                background: isDark
                                    ? "rgba(255, 255, 255, 0.05)"
                                    : "rgba(0, 0, 0, 0.03)",
                                fontSize: "14px",
                            }}
                        />
                    </div>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 16px",
                }}
            >
                <Tooltip
                    title={
                        theme === "dark"
                            ? "Switch to Light Mode"
                            : "Switch to Dark Mode"
                    }
                >
                    <Button
                        type="text"
                        icon={
                            theme === "dark" ? <BulbFilled /> : <BulbOutlined />
                        }
                        onClick={toggleTheme}
                        style={{
                            marginRight: "16px",
                            color: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.65)",
                            width: "40px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                        }}
                    />
                </Tooltip>

                <NotificationMenu />
                {/* User Menu */}
                <div>
                    <Dropdown
                        menu={{ items: userMenuItems as any }}
                        placement="bottomRight"
                        trigger={["click"]}
                    >
                        <div
                            style={{ padding: "0 5px" }}
                            className="flex justify-between cursor-pointer border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 rounded-3xl h-9"
                        >
                            {isLoading ? (
                                <>
                                    <Skeleton.Avatar active size={32} />
                                    {!isMobile && (
                                        <div
                                            style={{
                                                marginRight: "4px",
                                                lineHeight: 1.2,
                                            }}
                                            className="flex flex-col "
                                        >
                                            <Skeleton.Input
                                                active
                                                size="small"
                                                style={{
                                                    width: 40,
                                                    height: 16,
                                                    marginBottom: 4,
                                                }}
                                            />
                                            <Skeleton.Input
                                                active
                                                size="small"
                                                style={{
                                                    width: 20,
                                                    height: 12,
                                                }}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Avatar
                                        src={fileObjectToLink(user?.admin?.profile_image || null)}
                                        size={32}
                                        style={{
                                            marginRight: !isMobile ? "8px" : 0,
                                            border: `2px solid ${primaryColor}`,
                                        }}
                                    />
                                    {!isMobile && (
                                        <>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    marginRight: "4px",
                                                    lineHeight: 1.2,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: isDark
                                                            ? "#ffffff"
                                                            : "rgba(0, 0, 0, 0.85)",
                                                        fontWeight: "500",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    {user?.admin?.first_name}{" "}
                                                    {user?.admin?.last_name}
                                                </span>
                                                <span
                                                    style={{
                                                        color: isDark
                                                            ? "rgba(255, 255, 255, 0.5)"
                                                            : "rgba(0, 0, 0, 0.5)",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {user?.user_type}
                                                </span>
                                            </div>
                                            <DownOutlined
                                                style={{
                                                    fontSize: "10px",
                                                    color: isDark
                                                        ? "rgba(255, 255, 255, 0.5)"
                                                        : "rgba(0, 0, 0, 0.5)",
                                                }}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </Dropdown>
                </div>
            </div>
        </Header>
    );
}
