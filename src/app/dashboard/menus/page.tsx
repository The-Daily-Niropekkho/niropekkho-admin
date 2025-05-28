// app/(admin)/categories/page.tsx
"use client";

import NavbarPositionEditor from "@/components/features/menus/navbar-position-editor";
import { useGetAllCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Tabs } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { TabPane } = Tabs;

export interface Position {
  id: string;
  name: string;
  position: number;
}

const CategoriesPage = () => {
  const router = useRouter();

  const {
    data: categories,
    isLoading: isCategoryLoading,
    isFetching: isCategoryFetching,
  } = useGetAllCategoriesQuery({ limit: 999 });

  const [activeTab, setActiveTab] = useState<string>("navbar");
  const [navbarPositions, setNavbarPositions] = useState<Position[]>([]);
  const [sidebarPositions, setSidebarPositions] = useState<Position[]>([]);
  const [pagePositions, setPagePositions] = useState<Position[]>([]);

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

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Menu Management</h1>
        <Button type="primary" icon={<PlusOutlined />}>Create Category</Button>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange} centered>
          <TabPane tab="Navbar Position" key="navbar">
            <NavbarPositionEditor
              positions={navbarPositions}
              setPositions={setNavbarPositions}
              allCategories={categories?.data || []}
            />
          </TabPane>
          {/* <TabPane tab="Sidebar Position" key="sidebar">
            <SidebarPositionEditor
              positions={sidebarPositions}
              setPositions={setSidebarPositions}
              allCategories={categories?.data || []}
            />
          </TabPane>
          <TabPane tab="Page Position" key="page">
            <PagePositionEditor
              positions={pagePositions}
              setPositions={setPagePositions}
              allCategories={categories?.data || []}
            />
          </TabPane> */}
        </Tabs>
      </Card>
    </div>
  );
};

export default CategoriesPage;