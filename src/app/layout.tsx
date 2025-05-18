import { ThemeProvider } from "@/components/theme-context";
import ReduxProvider from "@/provider/redux-provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
    title: "Dashboard App",
    description: "A Next.js dashboard with i18n and Redux",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`custom-sidebar-menu`}>
                <ReduxProvider>
                    <ThemeProvider>
                        <AntdRegistry>{children}</AntdRegistry>
                    </ThemeProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
