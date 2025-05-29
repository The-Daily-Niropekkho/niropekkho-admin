/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import NavbarPositionEditor from "@/components/features/menus/navbar-position-editor";
import { useGetAllCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import { TArgsParam } from "@/types";
import { Alert, Button, Card, Spin, Tabs } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface Position {
    id: string;
    name: string;
    position: number;
}

export interface HomePosition {
    id: string;
    name: string;
    position_in_home: number;
}

const CategoriesPage = () => {
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(999);
    const [sortBy, setSortBy] = useState("position,position_update_at");
    const [sortOrder, setSortOrder] = useState("asc");
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [is_home, setIsHome] = useState<boolean>(false);

    const query: TArgsParam = {};
    query["page"] = page;
    query["limit"] = limit;
    query["sortBy"] = sortBy;
    query["sortOrder"] = sortOrder;
    query["status"] = status;
    query["is_home"] = is_home;

    const {
        data: categories,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useGetAllCategoriesQuery(query);

    const [activeTab, setActiveTab] = useState<string>("navbar");
    const [navbarPositions, setNavbarPositions] = useState<Position[]>([]);
    const [pagePositions, setPagePositions] = useState<HomePosition[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get("tab");
            if (tab) {
                setActiveTab(tab);
            }
        }
    }, []);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        const params = new URLSearchParams(window.location.search);
        params.set("tab", key);
        router.replace(`?${params.toString()}`);
    };

    const tabItems = [
        {
            key: "navbar",
            label: "Navbar Position",
            children: (
                <NavbarPositionEditor
                    positions={navbarPositions}
                    setPositions={setNavbarPositions}
                    allCategories={categories?.data || []}
                    setSortBy={setSortBy}
                    setSortOrder={setSortOrder}
                    setIsHome={setIsHome}
                />
            ),
        },
        // {
        //     key: "page",
        //     label: "Page Position",
        //     children: (
        //         <PagePositionEditor
        //             positions={pagePositions}
        //             setPositions={setPagePositions}
        //             allCategories={categories?.data || []}
        //             setSortBy={setSortBy}
        //             setSortOrder={setSortOrder}
        //             setIsHome={setIsHome}
        //         />
        //     ),
        // },
    ];

    return (
        <div style={{ padding: "24px" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                }}
            >
                <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
                    Menu Management
                </h1>
            </div>

            <Card>
                {isLoading || isFetching ? (
                    <div style={{ padding: "60px 0", textAlign: "center" }}>
                        <Spin size="large" tip="Loading categories..." />
                    </div>
                ) : isError ? (
                    <Alert
                        type="error"
                        message="Failed to load categories"
                        description="Please check your connection or try again later."
                        action={
                            <Button onClick={() => refetch()} type="primary">
                                Retry
                            </Button>
                        }
                    />
                ) : (
                    <Tabs
                        activeKey={activeTab}
                        onChange={handleTabChange}
                        centered
                        items={tabItems}
                    />
                )}
            </Card>
        </div>
    );
};

export default CategoriesPage;
