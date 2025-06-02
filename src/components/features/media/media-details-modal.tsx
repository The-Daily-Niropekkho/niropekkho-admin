"use client";

import { useTheme } from "@/components/theme-context";
import { TFileDocument } from "@/types";
import {
    CopyOutlined,
    DownloadOutlined,
    EditOutlined,
    EyeOutlined,
    FileOutlined,
    FileTextOutlined,
    FileZipOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Col, Modal, Row, Tag, message } from "antd";
import Image from "next/image";

interface MediaDetailsModalProps {
    item: TFileDocument;
    isOpen: boolean;
    onClose: () => void;
}

export default function MediaDetailsModal({
    item,
    isOpen,
    onClose,
}: MediaDetailsModalProps) {
    const { isDark } = useTheme();

    const file_type = item?.file_type?.toLowerCase() || "other";

    function formatFileSize(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        if (bytes < 1024 * 1024 * 1024)
            return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    const renderIcon = () => {
        switch (file_type) {
            case "video":
                return <VideoCameraOutlined style={{ fontSize: 64 }} />;
            case "document":
                return <FileTextOutlined style={{ fontSize: 64 }} />;
            case "archive":
                return <FileZipOutlined style={{ fontSize: 64 }} />;
            default:
                return <FileOutlined style={{ fontSize: 64 }} />;
        }
    };

    const handleCopyUrl = () => {
        if (item?.originalUrl) {
            navigator.clipboard.writeText(item.originalUrl);
            message.success("URL copied to clipboard");
        }
    };

    const handleDownload = () => {
        if (item?.url) {
            const link = document.createElement("a");
            link.href = item.url;
            link.download = item.filename || "file";
            link.click();
        }
    };

    return (
        <Modal
            title={
                <div className="modal-title">
                    <EyeOutlined /> Media Details
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
            ]}
            width={700}
            className={`details-modal ${isDark ? "dark-modal" : ""}`}
        >
            {item && (
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <div className="media-preview-large">
                            {file_type === "image" ? (
                                <Image
                                    alt={item.filename || "Media file"}
                                    src={item.url || "/placeholder.svg"}
                                    className="preview-image"
                                    width={400}
                                    height={400}
                                />
                            ) : (
                                <div
                                    className={`preview-file-icon ${
                                        isDark ? "dark" : ""
                                    }`}
                                >
                                    {renderIcon()}
                                </div>
                            )}
                        </div>
                    </Col>

                    <Col xs={24} md={12}>
                        <div className="media-details-info">
                            <h3
                                className={`details-title ${
                                    isDark ? "dark" : ""
                                }`}
                            >
                                {item.filename || "Untitled"}
                            </h3>

                            <div className="details-type">
                                <Tag
                                    color={
                                        {
                                            image: "blue",
                                            video: "red",
                                            document: "green",
                                            archive: "orange",
                                        }[file_type] || "default"
                                    }
                                >
                                    {file_type.toUpperCase()}
                                </Tag>
                            </div>

                            <div className="details-section">
                                <div className="details-row">
                                    <span className="details-label">Size:</span>
                                    <span className="details-value">
                                        {formatFileSize(item.size)}
                                    </span>
                                </div>

                                <div className="details-row">
                                    <span className="details-label">
                                        Upload date:
                                    </span>
                                    <span className="details-value">
                                        {item.createdAt}
                                    </span>
                                </div>

                                <div className="details-row">
                                    <span className="details-label">
                                        Last modified:
                                    </span>
                                    <span className="details-value">
                                        {item.updatedAt}
                                    </span>
                                </div>
                            </div>

                            <div className="details-actions">
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={handleDownload}
                                >
                                    Download
                                </Button>
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={handleCopyUrl}
                                >
                                    Copy S3 URL
                                </Button>
                                <Button icon={<EditOutlined />}>Edit</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            )}
        </Modal>
    );
}
