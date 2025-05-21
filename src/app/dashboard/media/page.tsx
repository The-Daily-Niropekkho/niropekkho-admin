"use client";

import FileCard from "@/components/features/media/file-card";
import FileCardInline from "@/components/features/media/file-card-inline";
import MediaFolders from "@/components/features/media/media-folders";
import MediaStats from "@/components/features/media/media-stats";
import { useTheme } from "@/components/theme-context";
import { useMediaUtils } from "@/hooks/use-media-utils";
import {
    useGetMediaQuery,
    useUploadMediaMutation,
} from "@/redux/features/media/mediaApi";
import {
    AppstoreOutlined,
    CloudUploadOutlined,
    FileOutlined,
    SearchOutlined,
    SortAscendingOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import { Button, Card, Col, Input, Progress, Row, Select, message } from "antd";
import { useState } from "react";
import "./media.css";

export default function MediaLibraryPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [searchText, setSearchText] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeFolder, setActiveFolder] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [filterType, setFilterType] = useState<string>("all");

    // RTK Query hooks
    const { data: mediaItems = [], isLoading } = useGetMediaQuery();
    const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();
    const { filterMedia, getMediaStats } = useMediaUtils();

    // Filter and sort media items
    const sortedMedia = filterMedia(
        mediaItems,
        searchText,
        filterType,
        activeFolder,
        sortBy,
        sortOrder
    );
    const mediaStats = getMediaStats(mediaItems);

    const handleUpload = (files: FileList) => {
        console.log(files);

        uploadMedia({
            files: Array.from(files),
            folder: activeFolder === "all" ? "Uncategorized" : activeFolder,
        })
            .unwrap()
            .then((newItems) => {
                message.success(
                    `${newItems.length} files uploaded successfully`
                );
            })
            .catch((error) => {
                message.error(`Upload failed: ${error.message}`);
            });
    };

    return (
        <>
            <div className="media-header">
                <h1 className={`media-title ${isDark ? "dark" : ""}`}>
                    Media Library
                </h1>
                <p className={`media-description ${isDark ? "dark" : ""}`}>
                    Manage your media files including images, videos, and
                    documents.
                </p>
            </div>

            <Card bordered={false} className={`media-card`}>
                <div
                    className="flex flex-col md:flex-row justify-between align-center gap-2.5"
                    style={{ marginBottom: 16 }}
                >
                    <div className="flex justify-start align-center gap-2">
                        <Input
                            placeholder="Search media"
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ maxWidth: 220 }}
                        />

                        <Select
                            defaultValue="all"
                            value={filterType}
                            onChange={setFilterType}
                        >
                            <Select.Option value="all">All Types</Select.Option>
                            <Select.Option value="image">Images</Select.Option>
                            <Select.Option value="video">Videos</Select.Option>
                            <Select.Option value="document">
                                Documents
                            </Select.Option>
                            <Select.Option value="archive">
                                Archives
                            </Select.Option>
                        </Select>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-2">
                        <Select
                            defaultValue="date"
                            value={sortBy}
                            onChange={setSortBy}
                            className="media-sort"
                        >
                            <Select.Option value="date">Date</Select.Option>
                            <Select.Option value="name">Name</Select.Option>
                            <Select.Option value="size">Size</Select.Option>
                            <Select.Option value="type">Type</Select.Option>
                        </Select>

                        <Button
                            icon={
                                sortOrder === "asc" ? (
                                    <SortAscendingOutlined />
                                ) : (
                                    <SortAscendingOutlined className="sort-desc" />
                                )
                            }
                            onClick={() =>
                                setSortOrder(
                                    sortOrder === "asc" ? "desc" : "asc"
                                )
                            }
                            className="media-sort-order"
                        >
                            {sortOrder === "asc" ? "Asc" : "Desc"}
                        </Button>
                        <Button
                            icon={
                                viewMode === "grid" ? (
                                    <UnorderedListOutlined />
                                ) : (
                                    <AppstoreOutlined />
                                )
                            }
                            onClick={() =>
                                setViewMode(
                                    viewMode === "grid" ? "list" : "grid"
                                )
                            }
                            className="media-view-toggle"
                        >
                            {viewMode === "grid" ? "List View" : "Grid View"}
                        </Button>

                        <Button
                            type="primary"
                            icon={<CloudUploadOutlined />}
                            onClick={() =>
                                document
                                    .getElementById("media-upload-input")
                                    ?.click()
                            }
                            className="media-upload-btn"
                        >
                            Upload
                        </Button>

                        <input
                            id="media-upload-input"
                            type="file"
                            multiple
                            onChange={(e) =>
                                e.target.files && handleUpload(e.target.files)
                            }
                            style={{ display: "none" }}
                        />
                    </div>
                </div>

                {isUploading && (
                    <div className="upload-progress">
                        <Progress percent={50} status="active" />
                    </div>
                )}

                <div className="media-container">
                    <div className="media-sidebar">
                        <MediaFolders
                            mediaItems={mediaItems}
                            activeFolder={activeFolder}
                            setActiveFolder={setActiveFolder}
                            isDark={isDark}
                        />
                        <MediaStats stats={mediaStats} isDark={isDark} />
                    </div>

                    <div className="media-content">
                        {isLoading ? (
                            <div
                                className={`empty-state h-full ${
                                    isDark ? "dark" : ""
                                }`}
                            >
                                <Progress type="circle" />
                                <h3>Loading media ...</h3>
                            </div>
                        ) : sortedMedia.length === 0 ? (
                            <div
                                className={`empty-state ${
                                    isDark ? "dark" : ""
                                }`}
                            >
                                <FileOutlined className="empty-icon" />
                                <h3>No files found</h3>
                                <p>
                                    Upload files or change your search criteria
                                </p>
                                <Button
                                    type="primary"
                                    icon={<CloudUploadOutlined />}
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "media-upload-input"
                                            )
                                            ?.click()
                                    }
                                >
                                    Upload Files
                                </Button>
                            </div>
                        ) : viewMode === "grid" ? (
                            <div className="media-grid">
                                <Row gutter={[16, 16]}>
                                    {sortedMedia.map((item) => (
                                        <Col
                                            xs={24}
                                            sm={12}
                                            md={8}
                                            lg={6}
                                            xl={4}
                                            key={item.id}
                                        >
                                            <FileCard
                                                key={item.id}
                                                item={item}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ) : (
                            <div className="media-list">
                                <div
                                    className={`list-header ${
                                        isDark ? "dark" : ""
                                    }`}
                                >
                                    <span className="header-name">Name</span>
                                    <span className="header-type">Type</span>
                                    <span className="header-size">Size</span>
                                    <span className="header-date">Date</span>
                                    <span className="header-actions">
                                        Actions
                                    </span>
                                </div>

                                {sortedMedia.map((item) => (
                                    <FileCardInline key={item.id} item={item} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </>
    );
}
