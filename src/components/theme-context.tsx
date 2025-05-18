"use client";

import { ConfigProvider, theme as antTheme } from "antd";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// Define our theme types and token structure
export type ThemeMode = "light" | "dark";

export interface ThemeTokens {
    // Colors
    colorPrimary: string;
    colorSuccess: string;
    colorWarning: string;
    colorError: string;
    colorInfo: string;
    colorTextBase: string;
    colorTextSecondary: string;
    colorBgContainer: string;
    colorBgElevated: string;
    colorBgLayout: string;
    colorBorder: string;

    // Typography
    fontSizeBase: number;
    fontSizeSm: number;
    fontSizeLg: number;
    fontSizeXl: number;
    fontFamily: string;

    // Spacing and sizing
    paddingXS: number;
    paddingSM: number;
    padding: number;
    paddingMD: number;
    paddingLG: number;
    paddingXL: number;

    // Border and radius
    borderRadius: number;
    borderRadiusSM: number;
    borderRadiusLG: number;
    borderWidth: number;

    // Shadows
    boxShadow: string;
    boxShadowSecondary: string;

    // Animation
    motionDurationSlow: string;
    motionDurationMid: string;
    motionDurationFast: string;
}

// Define our theme context type
interface ThemeContextType {
    theme: ThemeMode;
    toggleTheme: () => void;
    tokens: ThemeTokens;
    isDark: boolean;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define our theme tokens for light and dark modes
const lightTokens: ThemeTokens = {
    // Colors
    colorPrimary: "#10b981",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    colorInfo: "#3b82f6",
    colorTextBase: "#374151",
    colorTextSecondary: "#6b7280",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgLayout: "#f9fafb",
    colorBorder: "#e5e7eb",

    // Typography
    fontSizeBase: 14,
    fontSizeSm: 12,
    fontSizeLg: 16,
    fontSizeXl: 20,
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

    // Spacing and sizing
    paddingXS: 8,
    paddingSM: 12,
    padding: 16,
    paddingMD: 20,
    paddingLG: 24,
    paddingXL: 32,

    // Border and radius
    borderRadius: 8,
    borderRadiusSM: 4,
    borderRadiusLG: 12,
    borderWidth: 1,

    // Shadows
    boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    boxShadowSecondary:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",

    // Animation
    motionDurationSlow: "0.3s",
    motionDurationMid: "0.2s",
    motionDurationFast: "0.1s",
};

const darkTokens: ThemeTokens = {
    // Colors
    colorPrimary: "#10b981",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    colorInfo: "#3b82f6",
    colorTextBase: "#e5e7eb",
    colorTextSecondary: "#9ca3af",
    colorBgContainer: "#1f2937",
    colorBgElevated: "#1f2937",
    colorBgLayout: "#111827",
    colorBorder: "#374151",

    // Typography
    fontSizeBase: 14,
    fontSizeSm: 12,
    fontSizeLg: 16,
    fontSizeXl: 20,
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

    // Spacing and sizing
    paddingXS: 8,
    paddingSM: 12,
    padding: 16,
    paddingMD: 20,
    paddingLG: 24,
    paddingXL: 32,

    // Border and radius
    borderRadius: 8,
    borderRadiusSM: 4,
    borderRadiusLG: 12,
    borderWidth: 1,

    // Shadows
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)",
    boxShadowSecondary:
        "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",

    // Animation
    motionDurationSlow: "0.3s",
    motionDurationMid: "0.2s",
    motionDurationFast: "0.1s",
};

// Create the theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<ThemeMode>("light");
    const isDark = theme === "dark";
    const tokens = isDark ? darkTokens : lightTokens;

    useEffect(() => {
        // Check if theme is stored in localStorage
        const storedTheme = localStorage.getItem("theme") as ThemeMode | null;

        // Check if user prefers dark mode
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        // Set theme based on stored preference or system preference
        if (storedTheme) {
            setTheme(storedTheme);
        } else if (prefersDark) {
            setTheme("dark");
        }
    }, []);

    useEffect(() => {
        // Update document class when theme changes
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        // Store theme preference
        localStorage.setItem("theme", theme);

        // Update CSS variables
        const root = document.documentElement;

        // Set all theme tokens as CSS variables
        Object.entries(tokens).forEach(([key, value]) => {
            // Convert camelCase to kebab-case for CSS variables
            const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
            root.style.setProperty(`--${cssKey}`, value.toString());
        });
    }, [theme, tokens]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    // Create the Ant Design theme configuration
    const antDesignTheme = {
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
            colorPrimary: tokens.colorPrimary,
            colorSuccess: tokens.colorSuccess,
            colorWarning: tokens.colorWarning,
            colorError: tokens.colorError,
            colorInfo: tokens.colorInfo,
            colorText: tokens.colorTextBase,
            colorTextSecondary: tokens.colorTextSecondary,
            colorBgContainer: tokens.colorBgContainer,
            colorBgElevated: tokens.colorBgElevated,
            colorBgLayout: tokens.colorBgLayout,
            colorBorder: tokens.colorBorder,
            borderRadius: tokens.borderRadius,
            borderRadiusSM: tokens.borderRadiusSM,
            borderRadiusLG: tokens.borderRadiusLG,
            fontFamily: tokens.fontFamily,
            fontSize: tokens.fontSizeBase,
            boxShadow: tokens.boxShadow,
            boxShadowSecondary: tokens.boxShadowSecondary,
        },
        components: {
            Button: {
                colorPrimary: tokens.colorPrimary,
                algorithm: true,
            },
            Card: {
                colorBgContainer: tokens.colorBgContainer,
                borderRadiusLG: tokens.borderRadiusLG,
            },
            Table: {
                borderRadius: tokens.borderRadius,
                colorBgContainer: tokens.colorBgContainer,
            },
            Menu: {
                colorItemBgSelected: isDark
                    ? `rgba(16, 185, 129, 0.2)`
                    : `rgba(16, 185, 129, 0.1)`,
                colorItemTextSelected: tokens.colorPrimary,
            },
            Select: {
                colorPrimary: tokens.colorPrimary,
                controlItemBgActive: isDark
                    ? `rgba(16, 185, 129, 0.2)`
                    : `rgba(16, 185, 129, 0.1)`,
            },
            Input: {
                colorPrimary: tokens.colorPrimary,
                activeBorderColor: tokens.colorPrimary,
            },
            Checkbox: {
                colorPrimary: tokens.colorPrimary,
            },
            Radio: {
                colorPrimary: tokens.colorPrimary,
            },
            Switch: {
                colorPrimary: tokens.colorPrimary,
            },
            Slider: {
                colorPrimary: tokens.colorPrimary,
            },
            DatePicker: {
                colorPrimary: tokens.colorPrimary,
            },
            Modal: {
                borderRadiusLG: tokens.borderRadiusLG,
            },
            Dropdown: {
                colorPrimary: tokens.colorPrimary,
            },
            Tabs: {
                colorPrimary: tokens.colorPrimary,
            },
            Tag: {
                colorSuccess: tokens.colorSuccess,
                colorError: tokens.colorError,
                colorWarning: tokens.colorWarning,
                colorInfo: tokens.colorInfo,
            },
        },
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, tokens, isDark }}>
            <ConfigProvider theme={antDesignTheme}>{children}</ConfigProvider>
        </ThemeContext.Provider>
    );
}

// Create a hook to use the theme context
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
