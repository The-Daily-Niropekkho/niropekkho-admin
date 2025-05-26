import { useTheme } from "@/components/theme-context";
import { TFileDocument } from "@/types";
import { EditOutlined, EyeOutlined, FileImageOutlined, FileOutlined, FileTextOutlined, FileZipOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";
import { useState } from "react";
import MediaDetailsModal from "./media-details-modal";

export default function FileCardInline({ item }: { item: TFileDocument }) {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const { isDark } = useTheme();
    return (
        <>
            <div
                className={`list-item ${isDark ? "dark" : ""}`}
            >
                <div className="item-name" onClick={() => setIsDetailsModalOpen(true)}>
                    {item.fileType === "image" && (
                        <FileImageOutlined className="item-icon" />
                    )}
                    {item.fileType === "video" && (
                        <VideoCameraOutlined className="item-icon" />
                    )}
                    {item.fileType === "document" && (
                        <FileTextOutlined className="item-icon" />
                    )}
                    {item.fileType === "archive" && (
                        <FileZipOutlined className="item-icon" />
                    )}
                    {!["image", "video", "document", "archive"].includes(
                        item.fileType
                    ) && <FileOutlined className="item-icon" />}
                    <span className="name-text">{item.filename}</span>
                </div>

                <div className="item-type">
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

                <div className="item-size">
                    {item.size < 1024
                        ? `${item.size} KB`
                        : `${(item.size / 1024).toFixed(2)} MB`}
                </div>

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
