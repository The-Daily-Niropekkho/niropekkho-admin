"use client";

import FileCard from "@/components/features/media/file-card";
import { useTheme } from "@/components/theme-context";
import { useMediaSelection } from "@/hooks/use-media-selection";
import { useMediaUtils } from "@/hooks/use-media-utils";
import {
    useGetMediaQuery,
    useUploadMediaMutation
} from "@/redux/features/media/mediaApi";
import type { MediaItem } from "@/types/media";
import {
    AppstoreOutlined,
    CloseOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    EyeOutlined,
    FileImageOutlined,
    FileOutlined,
    FileTextOutlined,
    FileZipOutlined,
    FolderOutlined,
    InfoCircleOutlined,
    SearchOutlined,
    SortAscendingOutlined,
    StarFilled,
    StarOutlined,
    UnorderedListOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Input,
    Progress,
    Row,
    Select,
    Space,
    Tag,
    message
} from "antd";
import { useState } from "react";
import "./media.css";

export default function MediaLibraryPage() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [searchText, setSearchText] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [activeFolder, setActiveFolder] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [filterType, setFilterType] = useState<string>("all");

    // RTK Query hooks
    const { data: mediaItems = [], isLoading } = useGetMediaQuery();
    const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

    // Custom hooks
    const { selectedItems, selectItems, clearSelection } = useMediaSelection();
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

    const handleDelete = (item: MediaItem) => {
        setSelectedMedia(item);
        setIsDetailsModalOpen(false);
        setIsDeleteModalOpen(true);
    };



    const handleBulkDelete = () => {
        if (selectedItems.length > 0) {
            deleteMedia(selectedItems)
                .unwrap()
                .then(() => {
                    message.success(
                        `${selectedItems.length} items have been deleted`
                    );
                    clearSelection();
                })
                .catch((error) => {
                    message.error(`Failed to delete: ${error.message}`);
                });
        }
    };

    const showDetails = (item: MediaItem) => {
        setSelectedMedia(item);
        setIsDetailsModalOpen(true);
    };

    const handleUpload = (files: FileList) => {
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

    const handleSelectItem = (id: number, selected: boolean) => {
        const newSelectedItems = selected
            ? [...selectedItems, id]
            : selectedItems.filter((itemId) => itemId !== id);
        selectItems(newSelectedItems);
    };

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            selectItems(sortedMedia.map((item) => item.id));
        } else {
            clearSelection();
        }
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

            <Card
                bordered={false}
                className={`media-card`}
            >
                <div className="flex justify-between align-center" style={{ marginBottom: 16 }}>
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

                    <div className="flex gap-2">
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

                {selectedItems.length > 0 && (
                    <div className="bulk-actions">
                        <span className="selected-count">
                            {selectedItems.length} items selected
                        </span>
                        <Space>
                            <Button icon={<DownloadOutlined />}>
                                Download
                            </Button>
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                onClick={handleBulkDelete}
                            >
                                Delete
                            </Button>
                            <Button
                                icon={<CloseOutlined />}
                                onClick={clearSelection}
                            >
                                Clear Selection
                            </Button>
                        </Space>
                    </div>
                )}

                <div className="media-container">
                    <div className="media-sidebar">
                        <div className="media-folders">
                            <h3
                                className={`sidebar-title ${
                                    isDark ? "dark" : ""
                                }`}
                            >
                                <FolderOutlined /> Folders
                            </h3>
                            <ul className="folder-list">
                                <li
                                    className={`folder-item ${
                                        activeFolder === "all" ? "active" : ""
                                    } ${isDark ? "dark" : ""}`}
                                    onClick={() => setActiveFolder("all")}
                                >
                                    <FolderOutlined /> All Files
                                    <span className="folder-count">
                                        {mediaItems.length}
                                    </span>
                                </li>
                                {Array.from(
                                    new Set(
                                        mediaItems.map((item) => item.folder)
                                    )
                                ).map((folder) => (
                                    <li
                                        key={folder}
                                        className={`folder-item ${
                                            activeFolder === folder
                                                ? "active"
                                                : ""
                                        } ${isDark ? "dark" : ""}`}
                                        onClick={() => setActiveFolder(folder)}
                                    >
                                        <FolderOutlined /> {folder}
                                        <span className="folder-count">
                                            {
                                                mediaItems.filter(
                                                    (item) =>
                                                        item.folder === folder
                                                ).length
                                            }
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="media-stats">
                            <h3
                                className={`sidebar-title ${
                                    isDark ? "dark" : ""
                                }`}
                            >
                                <InfoCircleOutlined /> Statistics
                            </h3>
                            <ul className="stats-list">
                                <li
                                    className={`stats-item ${
                                        isDark ? "dark" : ""
                                    }`}
                                >
                                    <span className="stats-label">
                                        Total Files
                                    </span>
                                    <span className="stats-value">
                                        {mediaStats.total}
                                    </span>
                                </li>
                                <li
                                    className={`stats-item ${
                                        isDark ? "dark" : ""
                                    }`}
                                >
                                    <span className="stats-label">Images</span>
                                    <span className="stats-value">
                                        {mediaStats.images}
                                    </span>
                                </li>
                                <li
                                    className={`stats-item ${
                                        isDark ? "dark" : ""
                                    }`}
                                >
                                    <span className="stats-label">Videos</span>
                                    <span className="stats-value">
                                        {mediaStats.videos}
                                    </span>
                                </li>
                                <li
                                    className={`stats-item ${
                                        isDark ? "dark" : ""
                                    }`}
                                >
                                    <span className="stats-label">
                                        Documents
                                    </span>
                                    <span className="stats-value">
                                        {mediaStats.documents}
                                    </span>
                                </li>
                                <li
                                    className={`stats-item ${
                                        isDark ? "dark" : ""
                                    }`}
                                >
                                    <span className="stats-label">Other</span>
                                    <span className="stats-value">
                                        {mediaStats.other}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="media-content">
                        {isLoading ? (
                            <div
                                className={`empty-state ${
                                    isDark ? "dark" : ""
                                }`}
                            >
                                <Progress type="circle" />
                                <h3>Loading media from S3...</h3>
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
                                                item={item}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        ) : (
                            <div className="media-list">
                                <div className="list-header">
                                    <Checkbox
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                        checked={
                                            selectedItems.length ===
                                                sortedMedia.length &&
                                            sortedMedia.length > 0
                                        }
                                        indeterminate={
                                            selectedItems.length > 0 &&
                                            selectedItems.length <
                                                sortedMedia.length
                                        }
                                    />
                                    <span className="header-name">Name</span>
                                    <span className="header-type">Type</span>
                                    <span className="header-size">Size</span>
                                    <span className="header-date">Date</span>
                                    <span className="header-actions">
                                        Actions
                                    </span>
                                </div>

                                {sortedMedia.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`list-item ${
                                            isDark ? "dark" : ""
                                        } ${
                                            selectedItems.includes(item.id)
                                                ? "selected"
                                                : ""
                                        }`}
                                    >
                                        <Checkbox
                                            checked={selectedItems.includes(
                                                item.id
                                            )}
                                            onChange={(e) =>
                                                handleSelectItem(
                                                    item.id,
                                                    e.target.checked
                                                )
                                            }
                                        />

                                        <div
                                            className="item-name"
                                            onClick={() => showDetails(item)}
                                        >
                                            {item.type === "image" && (
                                                <FileImageOutlined className="item-icon" />
                                            )}
                                            {item.type === "video" && (
                                                <VideoCameraOutlined className="item-icon" />
                                            )}
                                            {item.type === "document" && (
                                                <FileTextOutlined className="item-icon" />
                                            )}
                                            {item.type === "archive" && (
                                                <FileZipOutlined className="item-icon" />
                                            )}
                                            {![
                                                "image",
                                                "video",
                                                "document",
                                                "archive",
                                            ].includes(item.type) && (
                                                <FileOutlined className="item-icon" />
                                            )}
                                            <span className="name-text">
                                                {item.name}
                                            </span>
                                            {item.favorite && (
                                                <StarFilled className="favorite-icon" />
                                            )}
                                        </div>

                                        <div className="item-type">
                                            <Tag
                                                color={
                                                    item.type === "image"
                                                        ? "blue"
                                                        : item.type === "video"
                                                        ? "red"
                                                        : item.type ===
                                                          "document"
                                                        ? "green"
                                                        : item.type ===
                                                          "archive"
                                                        ? "orange"
                                                        : "default"
                                                }
                                            >
                                                {item.type}
                                            </Tag>
                                        </div>

                                        <div className="item-size">
                                            {item.size < 1024
                                                ? `${item.size} KB`
                                                : `${(item.size / 1024).toFixed(
                                                      2
                                                  )} MB`}
                                        </div>

                                        <div className="item-date">
                                            {item.uploadedAt}
                                        </div>

                                        <div className="item-actions">
                                            <Button
                                                type="text"
                                                icon={<EyeOutlined />}
                                                onClick={() =>
                                                    showDetails(item)
                                                }
                                            />
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                            />
                                            <Button
                                                type="text"
                                                icon={
                                                    item.favorite ? (
                                                        <StarFilled className="favorite-icon" />
                                                    ) : (
                                                        <StarOutlined />
                                                    )
                                                }
                                            />
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() =>
                                                    handleDelete(item)
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Card>


        </>
    );
}
