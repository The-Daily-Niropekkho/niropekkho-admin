"use client"

import { Spin } from "antd";
import { useTheme } from "../theme-context";

export default function Loader() {
    const { isDark } = useTheme()
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
