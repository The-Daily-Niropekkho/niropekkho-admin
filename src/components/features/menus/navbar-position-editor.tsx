/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useTheme } from "@/components/theme-context";
import { useUpdateCategoryPositionMutation } from "@/redux/features/categories/categoriesApi";
import { Category } from "@/types";
import { MenuOutlined, SaveOutlined } from "@ant-design/icons";
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./position-editor.css";

export interface Position {
    id: string;
    name: string;
    position: number;
}

interface SortableItemProps {
    id: string;
    name: string;
    position: number;
}

interface NavbarPositionEditorProps {
    positions: Position[];
    setPositions: (
        positions: Position[] | ((prev: Position[]) => Position[])
    ) => void;
    allCategories: Category[];
    setIsHome: Dispatch<SetStateAction<boolean>>;
    setSortBy: Dispatch<SetStateAction<string>>;
    setSortOrder: Dispatch<SetStateAction<string>>;
}

const SortableItem = ({ id, name, position }: SortableItemProps) => {
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
                    <MenuOutlined />
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
            </div>
        </div>
    );
};

const NavbarPositionEditor = ({
    positions,
    setPositions,
    allCategories,
    setSortBy,
    setSortOrder,
    setIsHome,
}: NavbarPositionEditorProps) => {
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

    useEffect(() => {
        if (
            allCategories &&
            allCategories.length > 0 &&
            positions.length === 0
        ) {
            const initialized = allCategories.map((cat, idx) => ({
                id: cat.id,
                name: cat.title,
                position: idx + 1,
            }));
            setPositions(initialized);
        }
    }, [allCategories]);

    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");

    useEffect(() => {
        if (tab === "page") {
            setSortBy("position,position_update_at");
            setSortOrder("asc");
            setIsHome(true);
        }
    }, []);

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
                const moved = arrayMove(items, oldIndex, newIndex);

                setHasChanges(true);
                return moved.map((item, index) => ({
                    ...item,
                    position: index + 1,
                }));
            });

            message.success("Position changed");
        }
    };

    const handleSave = async () => {
        const payload = positions.map((p, i) => ({
            id: p.id,
            position: i + 1,
        }));
        try {

            await updatePositions({ payload: payload }).unwrap();
            message.success("Positions saved");
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
                            items={positions.map((p) => p.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {positions.map((p) => (
                                <SortableItem
                                    key={p.id}
                                    id={p.id}
                                    name={p.name}
                                    position={p.position}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
};

export default NavbarPositionEditor;
