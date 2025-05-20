/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useTheme } from "@/components/theme-context";
import {
    AppstoreOutlined,
    ArrowLeftOutlined,
    CaretRightOutlined,
    DeleteOutlined,
    DragOutlined,
    EditOutlined,
    EyeOutlined,
    FileOutlined,
    LinkOutlined,
    MenuOutlined,
    PlusOutlined,
    SaveOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    defaultDropAnimationSideEffects,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
    type DropAnimation,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Breadcrumb,
    Button,
    Card,
    Divider,
    Form,
    Input,
    Modal,
    Select,
    Switch,
    Tabs,
    Tooltip,
    message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

const { TabPane } = Tabs;

// Define interfaces for the menu and menu items
interface MenuItem {
    id: string;
    title: string;
    url: string;
    type: "custom" | "page" | "category" | "post";
    target: "_self" | "_blank";
    icon: string;
    children: MenuItem[];
    class?: string;
    htmlId?: string;
    rel?: string[];
    visibility?: string[];
    roles?: string[];
    active?: boolean;
}

interface Menu {
    id: string;
    name: string;
    location: string;
    type: string;
    status: string;
    description: string;
    items: MenuItem[];
}

// Define form values type
interface MenuItemFormValues {
    title: string;
    url: string;
    type: "custom" | "page" | "category" | "post";
    target: "_self" | "_blank";
    icon?: string;
    class?: string;
    id?: string;
    rel?: string[];
    visibility?: string[];
    roles?: string[];
    active?: boolean;
}

// Mock menu data
const mockMenu: Menu = {
    id: "1",
    name: "Main Navigation",
    location: "header",
    type: "main",
    status: "active",
    description: "Primary navigation menu for the website header",
    items: [
        {
            id: "item-1",
            title: "Home",
            url: "/",
            type: "custom",
            target: "_self",
            icon: "home",
            children: [],
        },
        {
            id: "item-2",
            title: "News",
            url: "/news",
            type: "page",
            target: "_self",
            icon: "file",
            children: [
                {
                    id: "item-2-1",
                    title: "Latest News",
                    url: "/news/latest",
                    type: "page",
                    target: "_self",
                    icon: "",
                    children: [],
                },
                {
                    id: "item-2-2",
                    title: "Popular News",
                    url: "/news/popular",
                    type: "page",
                    target: "_self",
                    icon: "",
                    children: [],
                },
            ],
        },
        {
            id: "item-3",
            title: "Categories",
            url: "/categories",
            type: "category",
            target: "_self",
            icon: "appstore",
            children: [
                {
                    id: "item-3-1",
                    title: "Politics",
                    url: "/categories/politics",
                    type: "category",
                    target: "_self",
                    icon: "",
                    children: [],
                },
                {
                    id: "item-3-2",
                    title: "Technology",
                    url: "/categories/technology",
                    type: "category",
                    target: "_self",
                    icon: "",
                    children: [],
                },
                {
                    id: "item-3-3",
                    title: "Sports",
                    url: "/categories/sports",
                    type: "category",
                    target: "_self",
                    icon: "",
                    children: [],
                },
            ],
        },
        {
            id: "item-4",
            title: "About Us",
            url: "/about",
            type: "page",
            target: "_self",
            icon: "info-circle",
            children: [],
        },
        {
            id: "item-5",
            title: "Contact",
            url: "/contact",
            type: "page",
            target: "_self",
            icon: "mail",
            children: [],
        },
    ],
};

// Helper function to get icon component
const getIconComponent = (icon: string): React.ReactNode => {
    switch (icon) {
        case "home":
            return <MenuOutlined />;
        case "file":
            return <FileOutlined />;
        case "appstore":
            return <AppstoreOutlined />;
        case "info-circle":
            return <EyeOutlined />;
        case "mail":
            return <SettingOutlined />;
        default:
            return <LinkOutlined />;
    }
};

// Helper function to get item type icon
const getItemTypeIcon = (type: MenuItem["type"]): React.ReactNode => {
    switch (type) {
        case "page":
            return <FileOutlined />;
        case "category":
            return <AppstoreOutlined />;
        case "custom":
            return <LinkOutlined />;
        default:
            return <LinkOutlined />;
    }
};

// Custom drop animation
const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.5",
            },
        },
    }),
};

// Sortable menu item component
interface SortableMenuItemProps {
    item: MenuItem;
    onEdit: (item: MenuItem) => void;
    onAdd: (parentId: string) => void;
    onDelete: (itemId: string) => void;
    onToggle: (itemId: string) => void;
    isExpanded: boolean;
    children?: React.ReactNode;
    depth?: number;
}

const SortableMenuItem: React.FC<SortableMenuItemProps> = ({
    item,
    onEdit,
    onAdd,
    onDelete,
    onToggle,
    isExpanded,
    children,
    depth = 0,
}) => {
    const { isDark } = useTheme();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: "relative",
        zIndex: isDragging ? 1 : 0,
    };

    // Generate gradient based on depth
    const getGradient = (): string => {
        if (isDark) {
            // Dark theme gradients
            switch (depth % 4) {
                case 0:
                    return "from-slate-800 to-slate-700";
                case 1:
                    return "from-slate-700 to-slate-600";
                case 2:
                    return "from-slate-600 to-slate-700";
                case 3:
                    return "from-slate-700 to-slate-800";
                default:
                    return "from-slate-800 to-slate-700";
            }
        } else {
            // Light theme gradients
            switch (depth % 4) {
                case 0:
                    return "from-white to-gray-50";
                case 1:
                    return "from-gray-50 to-gray-100";
                case 2:
                    return "from-gray-100 to-gray-50";
                case 3:
                    return "from-gray-50 to-white";
                default:
                    return "from-white to-gray-50";
            }
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-3">
            <div
                className={`border rounded-lg shadow-sm ${
                    isDragging
                        ? isDark
                            ? "border-blue-500 bg-blue-900/20"
                            : "border-blue-500 bg-blue-50"
                        : isDark
                        ? "border-gray-700"
                        : "border-gray-200"
                } ${
                    isExpanded
                        ? isDark
                            ? "border-blue-700"
                            : "border-blue-300"
                        : ""
                }`}
            >
                <div
                    className={`flex items-center p-3 rounded-t-lg bg-gradient-to-r ${getGradient()} ${
                        isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                >
                    <div
                        {...attributes}
                        {...listeners}
                        className={`mr-3 p-2 rounded cursor-move flex items-center justify-center ${
                            isDark
                                ? "bg-slate-700 hover:bg-slate-600 text-gray-300"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                        } transition-colors duration-200`}
                    >
                        <DragOutlined />
                    </div>

                    <div className="flex-1 flex items-center">
                        <span
                            className={`mr-2 ${
                                isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                        >
                            {getItemTypeIcon(item.type)}
                        </span>
                        <span className="font-medium">{item.title}</span>
                        {item.target === "_blank" && (
                            <Tooltip title="Opens in new window">
                                <span
                                    className={`ml-2 ${
                                        isDark
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                    }`}
                                >
                                    <EyeOutlined />
                                </span>
                            </Tooltip>
                        )}
                    </div>

                    <div
                        className={`text-sm mr-4 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                        {item.url}
                    </div>

                    <div className="flex space-x-1">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(item)}
                            size="small"
                            className={
                                isDark ? "text-gray-300 hover:text-white" : ""
                            }
                        />
                        <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={() => onAdd(item.id)}
                            size="small"
                            className={
                                isDark ? "text-gray-300 hover:text-white" : ""
                            }
                        />
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onDelete(item.id)}
                            size="small"
                            className={isDark ? "hover:text-red-400" : ""}
                        />
                        {item.children.length > 0 && (
                            <Button
                                type="text"
                                icon={
                                    isExpanded ? (
                                        <CaretRightOutlined rotate={90} />
                                    ) : (
                                        <CaretRightOutlined />
                                    )
                                }
                                onClick={() => onToggle(item.id)}
                                size="small"
                                className={
                                    isDark
                                        ? "text-gray-300 hover:text-white"
                                        : ""
                                }
                            />
                        )}
                    </div>
                </div>

                {item.children.length > 0 && isExpanded && (
                    <div
                        className={`pl-8 pr-2 pb-2 pt-2 ${
                            isDark
                                ? "bg-slate-800 border-t border-gray-700"
                                : "bg-gray-50 border-t border-gray-200"
                        }`}
                    >
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

// Menu editor component
interface MenuEditorProps {
    params: { id: string };
}

const MenuEditor: React.FC<MenuEditorProps> = ({ params }) => {
    const router = useRouter();
    const { isDark } = useTheme();
    const [menu, setMenu] = useState<Menu>(mockMenu);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [parentId, setParentId] = useState<string | null>(null);
    const [form] = Form.useForm<MenuItemFormValues>();
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);
    const [currentContainer, setCurrentContainer] = useState<string | null>(
        null
    );

    // Set up sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        // In a real app, fetch the menu data based on params.id
        console.log("Fetching menu with ID:", params.id);
        // For now, we'll use the mock data
    }, [params.id]);

    // Get all item IDs for the root level
    const rootItemIds = useMemo(
        () => menu.items.map((item) => item.id),
        [menu.items]
    );

    // Handle drag start
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);

        // Find the dragged item and its container
        const findItemAndContainer = (
            items: MenuItem[],
            id: string,
            container: string | null = null
        ): [MenuItem | null, string | null] => {
            for (const item of items) {
                if (item.id === id) {
                    return [item, container];
                }
                if (item.children.length > 0) {
                    const [found, foundContainer] = findItemAndContainer(
                        item.children,
                        id,
                        item.id
                    );
                    if (found) return [found, foundContainer];
                }
            }
            return [null, null];
        };

        const [item, container] = findItemAndContainer(
            menu.items,
            active.id as string,
            "root"
        );
        setDraggedItem(item);
        setCurrentContainer(container);
    };

    // Handle drag end
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            setDraggedItem(null);
            setCurrentContainer(null);
            return;
        }

        if (active.id !== over.id) {
            // Create a deep copy of the menu
            const newMenu: Menu = JSON.parse(JSON.stringify(menu));

            // Find the container of the over item
            const findItemContainer = (
                items: MenuItem[],
                id: string,
                container: string | null = null
            ): string | null => {
                for (const item of items) {
                    if (item.id === id) {
                        return container;
                    }
                    if (item.children.length > 0) {
                        const foundContainer = findItemContainer(
                            item.children,
                            id,
                            item.id
                        );
                        if (foundContainer !== null) return foundContainer;
                    }
                }
                return null;
            };

            const overContainer = findItemContainer(
                menu.items,
                over.id as string,
                "root"
            );

            // If both items are in the same container, just reorder
            if (currentContainer === overContainer) {
                // Find the container array
                const findContainerItems = (
                    items: MenuItem[],
                    containerId: string | null
                ): MenuItem[] | null => {
                    if (containerId === "root") {
                        return items;
                    }
                    for (const item of items) {
                        if (item.id === containerId) {
                            return item.children;
                        }
                        if (item.children.length > 0) {
                            const found = findContainerItems(
                                item.children,
                                containerId
                            );
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const containerItems = findContainerItems(
                    newMenu.items,
                    currentContainer
                );

                if (containerItems) {
                    // Find the indices
                    const oldIndex = containerItems.findIndex(
                        (item) => item.id === active.id
                    );
                    const newIndex = containerItems.findIndex(
                        (item) => item.id === over.id
                    );

                    if (oldIndex !== -1 && newIndex !== -1) {
                        // Reorder using arrayMove from @dnd-kit/sortable
                        const reorderedItems = arrayMove(
                            containerItems,
                            oldIndex,
                            newIndex
                        );

                        // Update the container with the reordered items
                        if (currentContainer === "root") {
                            newMenu.items = reorderedItems;
                        } else {
                            // Find and update the container's children
                            const updateContainerItems = (
                                items: MenuItem[],
                                containerId: string
                            ): boolean => {
                                for (let i = 0; i < items.length; i++) {
                                    if (items[i].id === containerId) {
                                        items[i].children = reorderedItems;
                                        return true;
                                    }
                                    if (items[i].children.length > 0) {
                                        if (
                                            updateContainerItems(
                                                items[i].children,
                                                containerId
                                            )
                                        ) {
                                            return true;
                                        }
                                    }
                                }
                                return false;
                            };

                            if (currentContainer !== null) {
                                updateContainerItems(
                                    newMenu.items,
                                    currentContainer
                                );
                            }
                        }

                        setMenu(newMenu);
                        message.success("Menu item order updated");
                    }
                }
            } else {
                // Moving between different containers
                // First, remove the item from its current container
                const removeItem = (
                    items: MenuItem[],
                    itemId: string,
                    containerId: string | null
                ): MenuItem | null => {
                    if (containerId === "root") {
                        const index = items.findIndex(
                            (item) => item.id === itemId
                        );
                        if (index !== -1) {
                            return items.splice(index, 1)[0];
                        }
                        return null;
                    }

                    for (const item of items) {
                        if (item.id === containerId) {
                            const index = item.children.findIndex(
                                (child) => child.id === itemId
                            );
                            if (index !== -1) {
                                return item.children.splice(index, 1)[0];
                            }
                            return null;
                        }
                        if (item.children.length > 0) {
                            const removed = removeItem(
                                item.children,
                                itemId,
                                containerId
                            );
                            if (removed) return removed;
                        }
                    }
                    return null;
                };

                const removedItem = removeItem(
                    newMenu.items,
                    active.id as string,
                    currentContainer
                );

                if (removedItem) {
                    // Then, add the item to its new container
                    const addItem = (
                        items: MenuItem[],
                        itemToAdd: MenuItem,
                        targetId: string,
                        containerId: string | null
                    ): boolean => {
                        if (containerId === "root") {
                            const index = items.findIndex(
                                (item) => item.id === targetId
                            );
                            if (index !== -1) {
                                items.splice(index + 1, 0, itemToAdd);
                                return true;
                            }
                            return false;
                        }

                        for (const item of items) {
                            if (item.id === containerId) {
                                const index = item.children.findIndex(
                                    (child) => child.id === targetId
                                );
                                if (index !== -1) {
                                    item.children.splice(
                                        index + 1,
                                        0,
                                        itemToAdd
                                    );
                                    return true;
                                }
                                return false;
                            }
                            if (item.children.length > 0) {
                                if (
                                    addItem(
                                        item.children,
                                        itemToAdd,
                                        targetId,
                                        containerId
                                    )
                                ) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };

                    if (
                        addItem(
                            newMenu.items,
                            removedItem,
                            over.id as string,
                            overContainer
                        )
                    ) {
                        setMenu(newMenu);
                        message.success("Menu item moved to new parent");
                    }
                }
            }
        }

        setActiveId(null);
        setDraggedItem(null);
        setCurrentContainer(null);
    };

    // Add new menu item
    const handleAddItem = () => {
        form.validateFields().then((values: MenuItemFormValues) => {
            const newItem: MenuItem = {
                id: `item-${Date.now()}`,
                ...values,
                icon: values.icon ?? "",
                children: [],
            };

            if (parentId === null) {
                // Add to root level
                setMenu({
                    ...menu,
                    items: [...menu.items, newItem],
                });
            } else {
                // Add as a child of another item
                const addItemToParent = (items: MenuItem[]): MenuItem[] => {
                    return items.map((item) => {
                        if (item.id === parentId) {
                            return {
                                ...item,
                                children: [...item.children, newItem],
                            };
                        }
                        if (item.children.length > 0) {
                            return {
                                ...item,
                                children: addItemToParent(item.children),
                            };
                        }
                        return item;
                    });
                };

                setMenu({
                    ...menu,
                    items: addItemToParent(menu.items),
                });

                // Auto-expand the parent
                if (!expandedKeys.includes(parentId)) {
                    setExpandedKeys([...expandedKeys, parentId]);
                }
            }

            setIsAddModalVisible(false);
            form.resetFields();
            setParentId(null);
            message.success("Menu item added successfully");
        });
    };

    // Edit menu item
    const handleEditItem = () => {
        form.validateFields().then((values: MenuItemFormValues) => {
            if (!editingItem) return;

            const updateItem = (items: MenuItem[]): MenuItem[] => {
                return items.map((item) => {
                    if (item.id === editingItem.id) {
                        return {
                            ...item,
                            ...values,
                        };
                    }
                    if (item.children.length > 0) {
                        return {
                            ...item,
                            children: updateItem(item.children),
                        };
                    }
                    return item;
                });
            };

            setMenu({
                ...menu,
                items: updateItem(menu.items),
            });

            setIsEditModalVisible(false);
            form.resetFields();
            setEditingItem(null);
            message.success("Menu item updated successfully");
        });
    };

    // Delete menu item
    const handleDeleteItem = (itemId: string) => {
        Modal.confirm({
            title: "Are you sure you want to delete this menu item?",
            content:
                "This will also delete any child items. This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => {
                const deleteItem = (items: MenuItem[]): MenuItem[] => {
                    return items.filter((item) => {
                        if (item.id === itemId) {
                            return false;
                        }
                        if (item.children.length > 0) {
                            item.children = deleteItem(item.children);
                        }
                        return true;
                    });
                };

                setMenu({
                    ...menu,
                    items: deleteItem(menu.items),
                });
                message.success("Menu item deleted successfully");
            },
        });
    };

    // Toggle expanded state of a menu item
    const toggleExpanded = (itemId: string) => {
        if (expandedKeys.includes(itemId)) {
            setExpandedKeys(expandedKeys.filter((key) => key !== itemId));
        } else {
            setExpandedKeys([...expandedKeys, itemId]);
        }
    };

    // Recursive function to render menu items
    const renderMenuItems = (
        items: MenuItem[],
        parentId: string | null = null,
        depth = 0
    ) => {
        const itemIds = items.map((item) => item.id);

        return (
            <SortableContext
                items={itemIds}
                strategy={verticalListSortingStrategy}
            >
                {items.map((item) => (
                    <SortableMenuItem
                        key={item.id}
                        item={item}
                        onEdit={(item) => {
                            setEditingItem(item);
                            form.setFieldsValue(item);
                            setIsEditModalVisible(true);
                        }}
                        onAdd={(parentId) => {
                            setParentId(parentId);
                            form.resetFields();
                            setIsAddModalVisible(true);
                        }}
                        onDelete={handleDeleteItem}
                        onToggle={toggleExpanded}
                        isExpanded={expandedKeys.includes(item.id)}
                        depth={depth}
                    >
                        {item.children.length > 0 &&
                            expandedKeys.includes(item.id) &&
                            renderMenuItems(item.children, item.id, depth + 1)}
                    </SortableMenuItem>
                ))}
            </SortableContext>
        );
    };

    return (
        <div className="p-6">
            <Breadcrumb className="mb-4">
                <Breadcrumb.Item>
                    <Link href="/dashboard">Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link href="/dashboard/menu">Menus</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{menu.name}</Breadcrumb.Item>
            </Breadcrumb>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.push("/dashboard/menu")}
                        className="mr-4"
                    >
                        Back to Menus
                    </Button>
                    <h1 className="text-2xl font-bold m-0">{menu.name}</h1>
                </div>
                <div className="flex space-x-2">
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() =>
                            message.success("Menu saved successfully")
                        }
                    >
                        Save Menu
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card
                        title={
                            <div className="flex items-center">
                                <MenuOutlined className="mr-2" />
                                <span>Menu Structure</span>
                            </div>
                        }
                        className="mb-6"
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setParentId(null);
                                    form.resetFields();
                                    setIsAddModalVisible(true);
                                }}
                            >
                                Add Menu Item
                            </Button>
                        }
                    >
                        <div className="mb-4">
                            <div
                                className={`p-3 rounded-lg ${
                                    isDark
                                        ? "bg-slate-800 text-gray-300"
                                        : "bg-blue-50 text-blue-700"
                                } flex items-center`}
                            >
                                <InfoIcon className="mr-2 flex-shrink-0" />
                                <p className="text-sm m-0">
                                    Drag and drop items to reorder. Use the +
                                    button to add child items. Click the arrow
                                    to expand/collapse nested items.
                                </p>
                            </div>
                        </div>

                        <div
                            className={`p-4 rounded-lg border ${
                                isDark
                                    ? "border-gray-700 bg-slate-900/50"
                                    : "border-gray-200 bg-gray-50/50"
                            }`}
                        >
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                {menu.items.length > 0 ? (
                                    renderMenuItems(menu.items)
                                ) : (
                                    <div
                                        className={`text-center py-8 ${
                                            isDark
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                        } border-2 border-dashed rounded-lg ${
                                            isDark
                                                ? "border-gray-700"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <p className="mb-2">
                                            No menu items yet
                                        </p>
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => {
                                                setParentId(null);
                                                form.resetFields();
                                                setIsAddModalVisible(true);
                                            }}
                                        >
                                            Add First Menu Item
                                        </Button>
                                    </div>
                                )}

                                <DragOverlay dropAnimation={dropAnimation}>
                                    {activeId && draggedItem ? (
                                        <div
                                            className={`border rounded-lg shadow-md ${
                                                isDark
                                                    ? "border-blue-500 bg-blue-900/30 text-blue-300"
                                                    : "border-blue-500 bg-blue-50 text-blue-700"
                                            } p-3`}
                                        >
                                            <div className="flex items-center">
                                                <span className="mr-2">
                                                    {getItemTypeIcon(
                                                        draggedItem.type
                                                    )}
                                                </span>
                                                <span className="font-medium">
                                                    {draggedItem.title}
                                                </span>
                                            </div>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card
                        title={
                            <div className="flex items-center">
                                <SettingOutlined className="mr-2" />
                                <span>Menu Settings</span>
                            </div>
                        }
                        className="mb-6"
                    >
                        <Form layout="vertical">
                            <Form.Item
                                label="Menu Name"
                                initialValue={menu.name}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Location"
                                initialValue={menu.location}
                            >
                                <Select
                                    options={[
                                        { value: "header", label: "Header" },
                                        { value: "footer", label: "Footer" },
                                        { value: "sidebar", label: "Sidebar" },
                                        { value: "mobile", label: "Mobile" },
                                        {
                                            value: "dashboard",
                                            label: "Dashboard",
                                        },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Status"
                                initialValue={menu.status === "active"}
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Active"
                                    unCheckedChildren="Inactive"
                                    defaultChecked={menu.status === "active"}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                initialValue={menu.description}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>

                            <Divider />

                            <Form.Item label="Display Options">
                                <div className="space-y-2">
                                    <div>
                                        <Switch
                                            defaultChecked
                                            className="mr-2"
                                        />
                                        <span>Show on Desktop</span>
                                    </div>
                                    <div>
                                        <Switch
                                            defaultChecked
                                            className="mr-2"
                                        />
                                        <span>Show on Mobile</span>
                                    </div>
                                    <div>
                                        <Switch
                                            defaultChecked
                                            className="mr-2"
                                        />
                                        <span>Show for Logged-in Users</span>
                                    </div>
                                    <div>
                                        <Switch
                                            defaultChecked
                                            className="mr-2"
                                        />
                                        <span>Show for Guests</span>
                                    </div>
                                </div>
                            </Form.Item>

                            <Button
                                type="primary"
                                block
                                onClick={() =>
                                    message.success("Menu settings saved")
                                }
                            >
                                Save Settings
                            </Button>
                        </Form>
                    </Card>

                    <Card
                        title={
                            <div className="flex items-center">
                                <EyeOutlined className="mr-2" />
                                <span>Menu Preview</span>
                            </div>
                        }
                        className="mb-6"
                    >
                        <div
                            className={`p-4 border rounded-lg ${
                                isDark
                                    ? "bg-slate-900 border-gray-700"
                                    : "bg-gray-50 border-gray-200"
                            }`}
                        >
                            <div className="flex flex-col space-y-2">
                                {menu.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center"
                                    >
                                        <span
                                            className={`mr-2 ${
                                                isDark
                                                    ? "text-gray-400"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {getIconComponent(item.icon)}
                                        </span>
                                        <span className="font-medium">
                                            {item.title}
                                        </span>
                                        {item.children.length > 0 && (
                                            <span
                                                className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                                                    isDark
                                                        ? "bg-blue-900/30 text-blue-300 border border-blue-800"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {item.children.length}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Add Menu Item Modal */}
            <Modal
                title={
                    <div className="flex items-center">
                        <PlusOutlined className="mr-2" />
                        <span>Add Menu Item</span>
                    </div>
                }
                open={isAddModalVisible}
                onOk={handleAddItem}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    form.resetFields();
                    setParentId(null);
                }}
                width={600}
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Basic Info" key="1">
                            <Form.Item
                                name="type"
                                label="Item Type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a type",
                                    },
                                ]}
                                initialValue="custom"
                            >
                                <Select
                                    placeholder="Select type"
                                    options={[
                                        {
                                            value: "custom",
                                            label: "Custom Link",
                                        },
                                        { value: "page", label: "Page" },
                                        {
                                            value: "category",
                                            label: "Category",
                                        },
                                        { value: "post", label: "Post" },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                name="title"
                                label="Menu Item Title"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter a title",
                                    },
                                ]}
                            >
                                <Input placeholder="e.g., Home" />
                            </Form.Item>

                            <Form.Item
                                name="url"
                                label="URL"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter a URL",
                                    },
                                ]}
                            >
                                <Input placeholder="e.g., /home or https://example.com" />
                            </Form.Item>

                            <Form.Item
                                name="target"
                                label="Open in"
                                initialValue="_self"
                            >
                                <Select
                                    options={[
                                        {
                                            value: "_self",
                                            label: "Same Window",
                                        },
                                        {
                                            value: "_blank",
                                            label: "New Window",
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="Advanced" key="2">
                            <Form.Item name="icon" label="Icon">
                                <Select
                                    placeholder="Select icon"
                                    allowClear
                                    options={[
                                        { value: "home", label: "Home" },
                                        { value: "file", label: "File" },
                                        {
                                            value: "appstore",
                                            label: "App Store",
                                        },
                                        {
                                            value: "info-circle",
                                            label: "Info Circle",
                                        },
                                        { value: "mail", label: "Mail" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item name="class" label="CSS Class">
                                <Input placeholder="e.g., featured-item" />
                            </Form.Item>

                            <Form.Item name="id" label="HTML ID">
                                <Input placeholder="e.g., home-link" />
                            </Form.Item>

                            <Form.Item name="rel" label="Rel Attribute">
                                <Select
                                    mode="multiple"
                                    placeholder="Select rel attributes"
                                    options={[
                                        {
                                            value: "nofollow",
                                            label: "nofollow",
                                        },
                                        {
                                            value: "noreferrer",
                                            label: "noreferrer",
                                        },
                                        {
                                            value: "noopener",
                                            label: "noopener",
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="Visibility" key="3">
                            <Form.Item
                                name="visibility"
                                label="Visibility"
                                initialValue={["desktop", "mobile"]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select visibility options"
                                    options={[
                                        { value: "desktop", label: "Desktop" },
                                        { value: "mobile", label: "Mobile" },
                                        {
                                            value: "logged_in",
                                            label: "Logged-in Users",
                                        },
                                        { value: "guests", label: "Guests" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item name="roles" label="User Roles">
                                <Select
                                    mode="multiple"
                                    placeholder="Select user roles"
                                    options={[
                                        { value: "admin", label: "Admin" },
                                        { value: "editor", label: "Editor" },
                                        { value: "author", label: "Author" },
                                        {
                                            value: "subscriber",
                                            label: "Subscriber",
                                        },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                name="active"
                                label="Status"
                                valuePropName="checked"
                                initialValue={true}
                            >
                                <Switch
                                    checkedChildren="Active"
                                    unCheckedChildren="Inactive"
                                    defaultChecked
                                />
                            </Form.Item>
                        </TabPane>
                    </Tabs>
                </Form>
            </Modal>

            {/* Edit Menu Item Modal */}
            <Modal
                title={
                    <div className="flex items-center">
                        <EditOutlined className="mr-2" />
                        <span>Edit Menu Item</span>
                    </div>
                }
                open={isEditModalVisible}
                onOk={handleEditItem}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    form.resetFields();
                    setEditingItem(null);
                }}
                width={600}
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Basic Info" key="1">
                            <Form.Item
                                name="title"
                                label="Menu Item Title"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter a title",
                                    },
                                ]}
                            >
                                <Input placeholder="e.g., Home" />
                            </Form.Item>

                            <Form.Item
                                name="type"
                                label="Item Type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a type",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Select type"
                                    options={[
                                        {
                                            value: "custom",
                                            label: "Custom Link",
                                        },
                                        { value: "page", label: "Page" },
                                        {
                                            value: "category",
                                            label: "Category",
                                        },
                                        { value: "post", label: "Post" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                name="url"
                                label="URL"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter a URL",
                                    },
                                ]}
                            >
                                <Input placeholder="e.g., /home or https://example.com" />
                            </Form.Item>

                            <Form.Item name="target" label="Open in">
                                <Select
                                    options={[
                                        {
                                            value: "_self",
                                            label: "Same Window",
                                        },
                                        {
                                            value: "_blank",
                                            label: "New Window",
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="Advanced" key="2">
                            <Form.Item name="icon" label="Icon">
                                <Select
                                    placeholder="Select icon"
                                    allowClear
                                    options={[
                                        { value: "home", label: "Home" },
                                        { value: "file", label: "File" },
                                        {
                                            value: "appstore",
                                            label: "App Store",
                                        },
                                        {
                                            value: "info-circle",
                                            label: "Info Circle",
                                        },
                                        { value: "mail", label: "Mail" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item name="class" label="CSS Class">
                                <Input placeholder="e.g., featured-item" />
                            </Form.Item>

                            <Form.Item name="id" label="HTML ID">
                                <Input placeholder="e.g., home-link" />
                            </Form.Item>

                            <Form.Item name="rel" label="Rel Attribute">
                                <Select
                                    mode="multiple"
                                    placeholder="Select rel attributes"
                                    options={[
                                        {
                                            value: "nofollow",
                                            label: "nofollow",
                                        },
                                        {
                                            value: "noreferrer",
                                            label: "noreferrer",
                                        },
                                        {
                                            value: "noopener",
                                            label: "noopener",
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="Visibility" key="3">
                            <Form.Item name="visibility" label="Visibility">
                                <Select
                                    mode="multiple"
                                    placeholder="Select visibility options"
                                    options={[
                                        { value: "desktop", label: "Desktop" },
                                        { value: "mobile", label: "Mobile" },
                                        {
                                            value: "logged_in",
                                            label: "Logged-in Users",
                                        },
                                        { value: "guests", label: "Guests" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item name="roles" label="User Roles">
                                <Select
                                    mode="multiple"
                                    placeholder="Select user roles"
                                    options={[
                                        { value: "admin", label: "Admin" },
                                        { value: "editor", label: "Editor" },
                                        { value: "author", label: "Author" },
                                        {
                                            value: "subscriber",
                                            label: "Subscriber",
                                        },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                name="active"
                                label="Status"
                                valuePropName="checked"
                            >
                                <Switch
                                    checkedChildren="Active"
                                    unCheckedChildren="Inactive"
                                />
                            </Form.Item>
                        </TabPane>
                    </Tabs>
                </Form>
            </Modal>
        </div>
    );
};

// Info icon component
interface InfoIconProps {
    className?: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
};

export default MenuEditor;
