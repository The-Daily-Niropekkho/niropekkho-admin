"use client";

import CategoryFormModal from "@/components/features/menus/category-form-modal";
import CategoryList from "@/components/features/menus/category-list";
import NavbarPositionEditor from "@/components/features/menus/navbar-position-editor";
import PagePositionEditor from "@/components/features/menus/page-position-editor";
import SidebarPositionEditor from "@/components/features/menus/sidebar-position-editor";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Tabs } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { TabPane } = Tabs;

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    status: string;
    postCount: number;
}

interface Position {
    id: string;
    name: string;
    position: number;
}

// Mock categories data
const initialCategories: Category[] = [
    {
        id: "1",
        name: "Politics",
        slug: "politics",
        description: "Political news and updates",
        status: "active",
        postCount: 45,
    },
    {
        id: "2",
        name: "Technology",
        slug: "technology",
        description: "Tech news and reviews",
        status: "active",
        postCount: 32,
    },
    {
        id: "3",
        name: "Sports",
        slug: "sports",
        description: "Sports news and events",
        status: "active",
        postCount: 28,
    },
    {
        id: "4",
        name: "Entertainment",
        slug: "entertainment",
        description: "Entertainment and celebrity news",
        status: "active",
        postCount: 37,
    },
    {
        id: "5",
        name: "Business",
        slug: "business",
        description: "Business and financial news",
        status: "active",
        postCount: 19,
    },
    {
        id: "6",
        name: "Health",
        slug: "health",
        description: "Health and wellness news",
        status: "inactive",
        postCount: 12,
    },
    {
        id: "7",
        name: "Science",
        slug: "science",
        description: "Science news and discoveries",
        status: "active",
        postCount: 15,
    },
];

const CategoriesPage = () => {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<string>("categoryList");
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Navbar position data
    const [navbarPositions, setNavbarPositions] = useState<Position[]>([
        { id: "1", name: "Politics", position: 1 },
        { id: "2", name: "Technology", position: 2 },
        { id: "4", name: "Entertainment", position: 3 },
        { id: "3", name: "Sports", position: 4 },
    ]);

    // Sidebar position data
    const [sidebarPositions, setSidebarPositions] = useState<Position[]>([
        { id: "1", name: "Politics", position: 1 },
        { id: "5", name: "Business", position: 2 },
        { id: "7", name: "Science", position: 3 },
        { id: "6", name: "Health", position: 4 },
    ]);

    // Page position data
    const [pagePositions, setPagePositions] = useState<Position[]>([
        { id: "2", name: "Technology", position: 1 },
        { id: "3", name: "Sports", position: 2 },
        { id: "4", name: "Entertainment", position: 3 },
        { id: "5", name: "Business", position: 4 },
        { id: "7", name: "Science", position: 5 },
    ]);

    // Extract ?tab=... from the URL (CSR-safe way)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get("tab");
            if (tab) {
                setActiveTab(tab);
            }
        }
    }, []);

    const handleAddCategory = (values: Omit<Category, "id" | "postCount">) => {
        const newCategory: Category = {
            id: `${Date.now()}`,
            ...values,
            postCount: 0,
        };

        setCategories([...categories, newCategory]);
        setIsModalVisible(false);
    };

    const handleEditCategory = (values: Omit<Category, "id" | "postCount">) => {
        if (!editingCategory) return;

        const updatedCategories = categories.map((category) =>
            category.id === editingCategory.id ? { ...category, ...values } : category
        );

        setCategories(updatedCategories);
        setIsModalVisible(false);
        setEditingCategory(null);
    };

    const handleDeleteCategory = (id: string) => {
        setCategories(categories.filter((category) => category.id !== id));
    };

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        const params = new URLSearchParams(window.location.search);
        params.set("tab", key);
        router.replace(`?${params.toString()}`);
    };

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
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingCategory(null);
                        setIsModalVisible(true);
                    }}
                >
                    Create Category
                </Button>
            </div>

            <Card>
                <Tabs activeKey={activeTab} onChange={handleTabChange} centered>
                    <TabPane tab="Category List" key="categoryList">
                        <CategoryList
                            categories={categories}
                            onEdit={(category) => {
                                setEditingCategory(category);
                                setIsModalVisible(true);
                            }}
                            onDelete={handleDeleteCategory}
                        />
                    </TabPane>

                    <TabPane tab="Navbar Position" key="navbar">
                        <NavbarPositionEditor
                            positions={navbarPositions}
                            setPositions={setNavbarPositions}
                            allCategories={categories}
                        />
                    </TabPane>

                    <TabPane tab="Sidebar Position" key="sidebar">
                        <SidebarPositionEditor
                            positions={sidebarPositions}
                            setPositions={setSidebarPositions}
                            allCategories={categories}
                        />
                    </TabPane>

                    <TabPane tab="Page Position" key="page">
                        <PagePositionEditor
                            positions={pagePositions}
                            setPositions={setPagePositions}
                            allCategories={categories}
                        />
                    </TabPane>
                </Tabs>
            </Card>

            <CategoryFormModal
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingCategory(null);
                }}
                onSubmit={
                    editingCategory ? handleEditCategory : handleAddCategory
                }
                initialValues={editingCategory}
                title={editingCategory ? "Edit Category" : "Create Category"}
            />
        </div>
    );
};

export default CategoriesPage;
