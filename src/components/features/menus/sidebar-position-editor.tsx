/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useTheme } from "@/components/theme-context";
import { useUpdateCategoryPositionMutation } from "@/redux/features/categories/categoriesApi";
import { Category } from "@/types";
import { DeleteOutlined, MenuOutlined, SaveOutlined } from "@ant-design/icons";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Empty, message } from "antd";
import { useEffect, useState } from "react";
import "./position-editor.css";

interface Position {
    id: string;
    name: string;
    position: number;
}

interface SortableItemProps {
    id: string;
    name: string;
    position: number;
    onRemove: (id: string) => void;
}

interface SidebarPositionEditorProps {
    positions: Position[];
    setPositions: (
        positions: Position[] | ((positions: Position[]) => Position[])
    ) => void;
    allCategories: Category[];
}

const SortableItem = ({ id, name, position, onRemove }: SortableItemProps) => {
    const { isDark } = useTheme();
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`position-editor__item ${
                isDark ? "position-editor__item--dark" : ""
            }`}
        >
            <div className="position-editor__item-content">
                <div
                    {...attributes}
                    {...listeners}
                    className={`position-editor__drag-handle ${
                        isDark ? "position-editor__drag-handle--dark" : ""
                    }`}
                >
                    <MenuOutlined style={{ fontSize: "18px" }} />
                </div>
                <span className="position-editor__item-name">{name}</span>
            </div>
            <div className="position-editor__item-actions">
                <span
                    className={`position-editor__position-badge ${
                        isDark ? "position-editor__position-badge--dark" : ""
                    }`}
                >
                    Position: {position}
                </span>
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onRemove(id)}
                    size="middle"
                    className="position-editor__remove-button"
                >
                    Remove
                </Button>
            </div>
        </div>
    );
};

const SidebarPositionEditor = ({
    positions,
    setPositions,
    allCategories,
}: SidebarPositionEditorProps) => {
    const { isDark } = useTheme();
    const [updatePositions, { isLoading }] =
        useUpdateCategoryPositionMutation();
    const [hasChanges, setHasChanges] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // auto load all categories once
    useEffect(() => {
        if (allCategories.length > 0 && positions.length === 0) {
            const initial = allCategories.map((cat, index) => ({
                id: cat.id,
                name: cat.title,
                position: index + 1,
            }));
            setPositions(initial);
        }
    }, [allCategories]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setPositions((items: Position[]) => {
                const oldIndex = items.findIndex(
                    (item) => item.id === active.id
                );
                const newIndex = items.findIndex(
                    (item) => item.id === over?.id
                );
                const newItems = arrayMove(items, oldIndex, newIndex);

                setHasChanges(true);

                return newItems.map((item, index) => ({
                    ...item,
                    position: index + 1,
                }));
            });

            message.success("Position updated");
        }
    };

    const handleRemove = (id: string) => {
        const updated = positions
            .filter((pos) => pos.id !== id)
            .map((item, index) => ({
                ...item,
                position: index + 1,
            }));
        setPositions(updated);
        setHasChanges(true);
        message.success("Removed from sidebar");
    };

    const handleSave = async () => {
        const payload = positions.map((p, i) => ({
            id: p.id,
            position: i + 1,
        }));
        try {
            await updatePositions({ positions: payload }).unwrap();
            message.success("Sidebar positions updated");
            setHasChanges(false);
        } catch (err) {
            console.error(err);
            message.error("Failed to save");
        }
    };

    return (
        <div className="position-editor">
            <div className="position-editor__items">
                <div
                    className="flex justify-between items-center"
                    style={{ margin: "10px 0px" }}
                >
                    <h3
                        className={`position-editor__title ${
                            isDark ? "position-editor__title--dark" : ""
                        }`}
                    >
                        Navbar Categories Order
                    </h3>
                    {hasChanges && (
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSave}
                            loading={isLoading}
                        >
                            Update Positions
                        </Button>
                    )}
                </div>
                {positions.length === 0 ? (
                    <Empty
                        description="No categories"
                        className="position-editor__empty"
                    />
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={positions.map((pos) => pos.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {positions.map((pos) => (
                                <SortableItem
                                    key={pos.id}
                                    id={pos.id}
                                    name={pos.name}
                                    position={pos.position}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}

                {hasChanges && (
                    <div style={{ marginTop: 16 }}>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSave}
                            loading={isLoading}
                        >
                            Update Sidebar Positions
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SidebarPositionEditor;
