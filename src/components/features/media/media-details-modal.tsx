"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@/components/theme-context";
import { TFileDocument } from "@/types";
import { CopyOutlined, DownloadOutlined, EditOutlined, EyeOutlined, FileOutlined, FileTextOutlined, FileZipOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Tag } from "antd";
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
                            {item.fileType === "image" ? (
                                <Image
                                    alt={item.filename || "Media file"}
                                    src={
                                        item.url || "/placeholder.svg"
                                    }
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
                                    {item.fileType === "video" && (
                                        <VideoCameraOutlined />
                                    )}
                                    {item.fileType === "document" && (
                                        <FileTextOutlined />
                                    )}
                                    {item.fileType === "archive" && (
                                        <FileZipOutlined />
                                    )}
                                    {![
                                        "video",
                                        "document",
                                        "archive",
                                        "image",
                                    ].includes(item.fileType) && (
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
                                {item.filename}
                            </h3>

                            <div className="details-type">
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
                                    {item.fileType.toUpperCase()}
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

                                {/* {item.dimensions && (
                                    <div className="details-row">
                                        <span className="details-label">
                                            Dimensions:
                                        </span>
                                        <span className="details-value">
                                            {item.dimensions}
                                        </span>
                                    </div>
                                )} */}

                                {/* <div className="details-row">
                                    <span className="details-label">
                                        Uploaded by:
                                    </span>
                                    <span className="details-value">
                                        {item.uploadedBy}
                                    </span>
                                </div> */}

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
