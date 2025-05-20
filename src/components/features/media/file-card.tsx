"use client";

import { useTheme } from "@/components/theme-context";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    FileOutlined,
    FileTextOutlined,
    FileZipOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";
import { Button, Image, Tag } from "antd";
import { useState } from "react";
import MediaDeleteModal from "./media-delete-modal";
import MediaDetailsModal from "./media-details-modal";

export default function FileCard({ item }: { item: any }) {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { isDark } = useTheme();
    const handleDelete = () => {
        setIsDetailsModalOpen(false);
        setIsDeleteModalOpen(true);
    };

    return (
        <>
            <div className={`media-item ${isDark ? "dark" : ""}`}>
                <div
                    className="media-preview"
                    onClick={() => setIsDetailsModalOpen(true)}
                >
                    {item.type === "image" ? (
                        <Image
                            alt={item.name}
                            src={item.url || "/placeholder.svg"}
                            preview={false}
                            className="media-image"
                        />
                    ) : (
                        <div
                            className={`media-file-icon ${
                                isDark ? "dark" : ""
                            }`}
                        >
                            {item.type === "video" && <VideoCameraOutlined />}
                            {item.type === "document" && <FileTextOutlined />}
                            {item.type === "archive" && <FileZipOutlined />}
                            {![
                                "video",
                                "document",
                                "archive",
                                "image",
                            ].includes(item.type) && <FileOutlined />}
                            <div className="file-type">{item.type}</div>
                        </div>
                    )}
                </div>

                <div className="media-info">
                    <div className="media-name" title={item.name}>
                        {item.name}
                    </div>
                    <div className="media-meta">
                        <span className="media-size">
                            {item.size < 1024
                                ? `${item.size} KB`
                                : `${(item.size / 1024).toFixed(2)} MB`}
                        </span>
                        <Tag
                            color={
                                item.type === "image"
                                    ? "blue"
                                    : item.type === "video"
                                    ? "red"
                                    : item.type === "document"
                                    ? "green"
                                    : item.type === "archive"
                                    ? "orange"
                                    : "default"
                            }
                        >
                            {item.type}
                        </Tag>
                    </div>
                </div>

                <div className="media-actions">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => setIsDetailsModalOpen(item)}
                    />
                    <Button type="text" icon={<EditOutlined />} />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete()}
                    />
                </div>
            </div>
            <MediaDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                item={item}
            />
            <MediaDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                item={item}
            />
        </>
    );
}
