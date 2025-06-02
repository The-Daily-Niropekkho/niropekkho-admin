import { ThemeProvider } from "@/components/theme-context";
import ReduxProvider from "@/provider/redux-provider";
import { SessionProvider } from "@/provider/session-provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App as AntdApp } from "antd";
import { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
    title: "Dashboard App",
    description: "Niropekkho Admin Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="custom-sidebar-menu">
                <SessionProvider>
                    <ReduxProvider>
                        <ThemeProvider>
                            <AntdRegistry>
                                <AntdApp>{children}</AntdApp>
                            </AntdRegistry>
                        </ThemeProvider>
                    </ReduxProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
