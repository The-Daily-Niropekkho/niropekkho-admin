"use client";

import { useTheme } from "@/components/theme-context";
import { TFileDocument } from "@/types";
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

export default function FileCard({ item }: { item: TFileDocument }) {
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
                    {item.fileType === "image" ? (
                        <Image
                            alt={item.filename}
                            src={item.url || "/placeholder.svg"}
                            preview={false}
                            className="media-image"
                            width={200}
                            height={200}
                        />
                    ) : (
                        <div
                            className={`media-file-icon ${
                                isDark ? "dark" : ""
                            }`}
                        >
                            {item.fileType === "video" && <VideoCameraOutlined />}
                            {item.fileType === "document" && <FileTextOutlined />}
                            {item.fileType === "archive" && <FileZipOutlined />}
                            {![
                                "video",
                                "document",
                                "archive",
                                "image",
                            ].includes(item.fileType) && <FileOutlined />}
                            <div className="file-type">{item.fileType}</div>
                        </div>
                    )}
                </div>

                <div className="media-info">
                    <div className="media-name" title={item.filename}>
                        {item.filename}
                    </div>
                    <div className="media-meta">
                        <span className="media-size">
                            {item.size < 1024
                                ? `${item.size} KB`
                                : `${(item.size / 1024).toFixed(2)} MB`}
                        </span>
                        <Tag
                            color={
                                item.fileType === "image"
                                    ? "blue"
                                    : item.fileType === "video"
                                    ? "red"
                                    : item.fileType === "document"
                                    ? "green"
                                    : item.fileType === "archive"
                                    ? "orange"
                                    : "default"
                            }
                        >
                            {item.fileType}
                        </Tag>
                    </div>
                </div>

                <div className="media-actions">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => setIsDetailsModalOpen(true)}
                    />
                    <Button type="text" icon={<EditOutlined />} />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
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
