"use client";

import { useTheme } from "@/components/theme-context";
import { TFileDocument } from "@/types";
import {
    EditOutlined,
    EyeOutlined,
    FileOutlined,
    FileTextOutlined,
    FileZipOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Image, Tag } from "antd";
import { useState } from "react";
import MediaDetailsModal from "./media-details-modal";

export default function FileCard({ item }: { item: TFileDocument }) {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const { isDark } = useTheme();

    function formatFileSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        if (bytes < 1024 * 1024 * 1024)
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    const renderIcon = () => {
        switch (item.file_type) {
            case "video":
                return <VideoCameraOutlined />;
            case "document":
                return <FileTextOutlined />;
            case "archive":
                return <FileZipOutlined />;
            default:
                return <FileOutlined />;
        }
    };

    return (
        <>
            <div className={`media-item ${isDark ? "dark" : ""}`}>
                <div
                    className="media-preview"
                    onClick={() => setIsDetailsModalOpen(true)}
                >
                    {item.file_type === "image" ? (
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
                            {renderIcon()}
                            <div className="file-type">{item.file_type}</div>
                        </div>
                    )}
                </div>

                <div className="media-info">
                    <div className="media-name" title={item.filename}>
                        {item.filename}
                    </div>
                    <div className="media-meta">
                        <span className="media-size">
                            {formatFileSize(item.size)}
                        </span>
                        
                        <Tag
                            color={
                                {
                                    image: "blue",
                                    video: "red",
                                    document: "green",
                                    archive: "orange",
                                }[item.file_type] || "default"
                            }
                        >
                            {item.file_type}
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
                </div>
            </div>

            <MediaDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                item={item}
            />
        </>
    );
}
