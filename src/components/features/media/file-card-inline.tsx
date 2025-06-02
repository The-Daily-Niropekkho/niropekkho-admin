"use client";

import { useTheme } from "@/components/theme-context";
import { TFileDocument } from "@/types";
import {
    EditOutlined,
    EyeOutlined,
    FileImageOutlined,
    FileOutlined,
    FileTextOutlined,
    FileZipOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Tag } from "antd";
import { useState } from "react";
import MediaDetailsModal from "./media-details-modal";

export default function FileCardInline({ item }: { item: TFileDocument }) {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const { isDark } = useTheme();

    function formatFileSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        if (bytes < 1024 * 1024 * 1024)
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }

    const getIcon = () => {
        console.log(item);

        switch (item.file_type) {
            case "image":
                return <FileImageOutlined className="item-icon" />;
            case "video":
                return <VideoCameraOutlined className="item-icon" />;
            case "document":
                return <FileTextOutlined className="item-icon" />;
            case "archive":
                return <FileZipOutlined className="item-icon" />;
            default:
                return <FileOutlined className="item-icon" />;
        }
    };

    return (
        <>
            <div className={`list-item ${isDark ? "dark" : ""}`}>
                <div
                    className="item-name"
                    onClick={() => setIsDetailsModalOpen(true)}
                >
                    {getIcon()}
                    <span className="name-text">{item.filename}</span>
                </div>

                <div className="item-type">
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

                <div className="item-size">{formatFileSize(item.size)}</div>

                <div className="item-date">{item.createdAt}</div>

                <div className="item-actions">
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
