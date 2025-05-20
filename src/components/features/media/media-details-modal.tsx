"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@/components/theme-context";
import { CopyOutlined, DownloadOutlined, EditOutlined, EyeOutlined, FileOutlined, FileTextOutlined, FileZipOutlined, StarFilled, VideoCameraOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Tag } from "antd";
import Image from "next/image";

interface MediaDetailsModalProps {
    item: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function MediaDetailsModal({
    item,
    isOpen,
    onClose,
}: MediaDetailsModalProps) {
        const { isDark } = useTheme();
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
                <Button
                    key="close"
                    onClick={onClose}
                >
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
                            {item.type === "image" ? (
                                <Image
                                    alt={item.name}
                                    src={
                                        item.url || "/placeholder.svg"
                                    }
                                    className="preview-image"
                                />
                            ) : (
                                <div
                                    className={`preview-file-icon ${
                                        isDark ? "dark" : ""
                                    }`}
                                >
                                    {item.type === "video" && (
                                        <VideoCameraOutlined />
                                    )}
                                    {item.type === "document" && (
                                        <FileTextOutlined />
                                    )}
                                    {item.type === "archive" && (
                                        <FileZipOutlined />
                                    )}
                                    {![
                                        "video",
                                        "document",
                                        "archive",
                                        "image",
                                    ].includes(item.type) && (
                                        <FileOutlined />
                                    )}
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
                                {item.name}
                                {item.favorite && (
                                    <StarFilled className="favorite-icon" />
                                )}
                            </h3>

                            <div className="details-type">
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
                                    {item.type.toUpperCase()}
                                </Tag>
                            </div>

                            <div className="details-section">
                                <div className="details-row">
                                    <span className="details-label">Size:</span>
                                    <span className="details-value">
                                        {item.size < 1024
                                            ? `${item.size} KB`
                                            : `${(
                                                  item.size / 1024
                                              ).toFixed(2)} MB`}
                                    </span>
                                </div>

                                {item.dimensions && (
                                    <div className="details-row">
                                        <span className="details-label">
                                            Dimensions:
                                        </span>
                                        <span className="details-value">
                                            {item.dimensions}
                                        </span>
                                    </div>
                                )}

                                <div className="details-row">
                                    <span className="details-label">
                                        Uploaded by:
                                    </span>
                                    <span className="details-value">
                                        {item.uploadedBy}
                                    </span>
                                </div>

                                <div className="details-row">
                                    <span className="details-label">
                                        Upload date:
                                    </span>
                                    <span className="details-value">
                                        {item.uploadedAt}
                                    </span>
                                </div>

                                <div className="details-row">
                                    <span className="details-label">
                                        Folder:
                                    </span>
                                    <span className="details-value">
                                        {item.folder}
                                    </span>
                                </div>

                                <div className="details-row">
                                    <span className="details-label">
                                        S3 Key:
                                    </span>
                                    <span className="details-value">
                                        {item.s3Key}
                                    </span>
                                </div>

                                <div className="details-row">
                                    <span className="details-label">Tags:</span>
                                    <span className="details-value">
                                        {item.tags.map((tag : string) => (
                                            <Tag key={tag}>{tag}</Tag>
                                        ))}
                                    </span>
                                </div>
                            </div>

                            <div className="details-actions">
                                <Button icon={<DownloadOutlined />}>
                                    Download
                                </Button>
                                <Button icon={<CopyOutlined />}>
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
