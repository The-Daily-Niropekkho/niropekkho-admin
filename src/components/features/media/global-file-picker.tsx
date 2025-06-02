/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useTheme } from "@/components/theme-context";
import { useDebounced } from "@/hooks/use-debounce";
import { useGetMediaQuery } from "@/redux/features/media/mediaApi";
import { TArgsParam, TError, TFileDocument } from "@/types";
import { FilProgressMultipleFilesUploaderS3 } from "@/utils/handleFileUploderFileProgress";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    CloudUploadOutlined,
    FileImageOutlined,
    FileOutlined,
    FileTextOutlined,
    FileZipOutlined,
    FolderOutlined,
    LoadingOutlined,
    SearchOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import {
    Button,
    Col,
    Empty,
    Input,
    List,
    Modal,
    Progress,
    Row,
    Select,
    Tabs,
    Tag,
    Typography,
    Upload,
} from "antd";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import "./media-components.css";
import MediaFolders from "./media-folders";

const { Option } = Select;

interface GlobalFilePickerProps {
    open: boolean;
    onCancel: () => void;
    onSelect: (selectedFiles: TFileDocument[]) => void;
    multiple?: boolean;
    fileTypes?: string[];
    initialSelected?: TFileDocument[];
}

export function GlobalFilePicker({
    open,
    onCancel,
    onSelect,
    multiple = false,
    fileTypes,
    initialSelected = [],
}: GlobalFilePickerProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [selectedItems, setSelectedItems] =
        useState<TFileDocument[]>(initialSelected);
    const [fileProgressList, setFileProgressList] = useState<
        Array<{ name: string; progress: number; status: string; url?: string }>
    >([]);
    const [searchText, setSearchText] = useState("");
    const [sortBy] = useState("createdAt");
    const [sortOrder] = useState<"asc" | "desc">("desc");
    const [filterType, setFilterType] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9); // Load 9 files per scroll
    const [activeTabKey, setActiveTabKey] = useState("1");
    const [allMediaItems, setAllMediaItems] = useState<TFileDocument[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isFetchingRef = useRef(false);

    const query: TArgsParam = {};
    query["page"] = currentPage;
    query["limit"] = itemsPerPage;
    query["file_type"] = filterType;
    query["sortBy"] = sortBy;
    query["sortOrder"] = sortOrder;

    const debouncedSearchTerm = useDebounced({
        searchQuery: searchText,
        delay: 600,
    });
    if (!!debouncedSearchTerm) {
        query["searchTerm"] = debouncedSearchTerm;
    }

    const {
        data: mediaItems,
        isLoading,
        isFetching,
        error,
    } = useGetMediaQuery(query, {
        skip: !open || activeTabKey !== "2",
    });

    useEffect(() => {
        if (open) {
            setSelectedItems(initialSelected);
            setFileProgressList([]);
            setCurrentPage(1);
            setAllMediaItems([]);
            setHasMore(true);
        }
    }, [open, initialSelected]);

    useEffect(() => {
        if (mediaItems?.data) {
            console.log(
                `Fetched page ${currentPage}: ${mediaItems.data.length} items`,
                mediaItems.data
            ); // Debug log
            setAllMediaItems((prev) =>
                currentPage === 1
                    ? mediaItems.data
                    : [...prev, ...mediaItems.data]
            );
            setHasMore(mediaItems.data.length === itemsPerPage);
            isFetchingRef.current = false;
        } else if (mediaItems && !mediaItems.data) {
            console.log(`No data for page ${currentPage}`); // Debug log
            setHasMore(false);
            isFetchingRef.current = false;
        }
    }, [mediaItems, currentPage]);

    const loadMoreFiles = useCallback(() => {
        if (isFetchingRef.current || !hasMore || isLoading) {
            console.log("Skipping load: isFetching, no more items, or loading"); // Debug log
            return;
        }
        console.log("Triggering load more files"); // Debug log
        isFetchingRef.current = true;
        setCurrentPage((prev) => prev + 1);
    }, [hasMore, isLoading]);

    useEffect(() => {
        if (!loadMoreRef.current || !open || activeTabKey !== "2") return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    console.log("Sentinel visible, loading more"); // Debug log
                    loadMoreFiles();
                }
            },
            { threshold: 0.5, rootMargin: "50px" } // Trigger earlier with rootMargin
        );

        observerRef.current.observe(loadMoreRef.current);

        return () => {
            if (observerRef.current && loadMoreRef.current) {
                observerRef.current.unobserve(loadMoreRef.current);
            }
        };
    }, [loadMoreFiles, open, activeTabKey]);

    const handleSelect = (item: TFileDocument) => {
        if (!multiple) {
            setSelectedItems([item]);
            onSelect([item]);
            onCancel();
        } else {
            const alreadySelected = selectedItems.some((f) => f.id === item.id);
            setSelectedItems((prev) =>
                alreadySelected
                    ? prev.filter((f) => f.id !== item.id)
                    : [...prev, item]
            );
        }
    };

    const handleUpload = async (file: File) => {
        try {
            setFileProgressList((prev) => [
                ...prev,
                { name: file.name, progress: 0, status: "uploading" },
            ]);

            const uploadedFiles = await FilProgressMultipleFilesUploaderS3(
                [file],
                setFileProgressList
            );

            const cleanFiles = uploadedFiles?.map((file) => {
                const clone = { ...file };
                delete clone.pre_url;
                return clone;
            });

            if (!multiple && cleanFiles[0]) {
                setSelectedItems([cleanFiles[0]]);
                onSelect([cleanFiles[0]]);
                onCancel();
            } else {
                setSelectedItems((prev) => [...prev, ...cleanFiles]);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setFileProgressList((prev) =>
                prev.map((item) =>
                    item.name === file.name
                        ? { ...item, status: "error", progress: 0 }
                        : item
                )
            );
        }
    };

    const getIconByType = (type: string) => {
        switch (type) {
            case "image":
                return <FileImageOutlined />;
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

    const tabItems = [
        {
            key: "1",
            label: (
                <span>
                    <CloudUploadOutlined /> Upload Files
                </span>
            ),
            children: (
                <>
                    <Upload.Dragger
                        multiple={multiple}
                        accept={fileTypes?.join(",")}
                        customRequest={({ file }) => {
                            if (file instanceof File) handleUpload(file);
                        }}
                        showUploadList={false}
                        className="file-upload"
                    >
                        <p className="ant-upload-drag-icon">
                            <CloudUploadOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag to upload
                        </p>
                        <p className="ant-upload-hint">
                            Supports {multiple ? "multi" : "single"} file
                            uploads
                        </p>
                    </Upload.Dragger>

                    {fileProgressList.length > 0 && (
                        <List
                            style={{ marginTop: "20px" }}
                            dataSource={fileProgressList}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <div className="upload-status-row">
                                                {item.status === "done" ? (
                                                    <CheckCircleOutlined
                                                        style={{
                                                            color: "#52c41a",
                                                        }}
                                                    />
                                                ) : item.status === "error" ? (
                                                    <CloseCircleOutlined
                                                        style={{
                                                            color: "#ff4d4f",
                                                        }}
                                                    />
                                                ) : (
                                                    <LoadingOutlined
                                                        style={{
                                                            color: "#1890ff",
                                                        }}
                                                    />
                                                )}
                                                <Typography.Text>
                                                    {item.name}
                                                </Typography.Text>
                                                <Tag
                                                    color={
                                                        item.status === "done"
                                                            ? "success"
                                                            : item.status ===
                                                              "error"
                                                            ? "error"
                                                            : "processing"
                                                    }
                                                >
                                                    {item.status.toUpperCase()}
                                                </Tag>
                                            </div>
                                        }
                                        description={
                                            <Progress
                                                percent={item.progress}
                                                status={
                                                    item.status === "done"
                                                        ? "success"
                                                        : item.status ===
                                                          "error"
                                                        ? "exception"
                                                        : "active"
                                                }
                                                showInfo
                                            />
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </>
            ),
        },
        {
            key: "2",
            label: (
                <span>
                    <FolderOutlined /> Browse Files
                </span>
            ),
            children: (
                <>
                    <div className="file-picker-toolbar">
                        <div className="file-picker-filters">
                            <Input
                                placeholder="Search files"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setCurrentPage(1);
                                    setAllMediaItems([]);
                                    setHasMore(true);
                                }}
                            />
                            <Select
                                value={filterType}
                                onChange={(value) => {
                                    setFilterType(value);
                                    setCurrentPage(1);
                                    setAllMediaItems([]);
                                    setHasMore(true);
                                }}
                            >
                                <Option value="all">All Types</Option>
                                <Option value="image">Images</Option>
                                <Option value="video">Videos</Option>
                                <Option value="document">Documents</Option>
                                <Option value="archive">Archives</Option>
                            </Select>
                        </div>
                        <div>{allMediaItems.length} files found</div>
                    </div>

                    <div className="file-picker-container">
                        <div className="file-picker-sidebar">
                            <MediaFolders
                                activeFolder={filterType}
                                setActiveFolder={(value) => {
                                    setFilterType(value);
                                    setCurrentPage(1);
                                    setAllMediaItems([]);
                                    setHasMore(true);
                                }}
                            />
                        </div>
                        <div
                            className="file-picker-content"
                            style={{
                                maxHeight: "400px",
                                overflowY: "auto",
                                position: "relative",
                            }}
                        >
                            {error && (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "16px",
                                        color: "red",
                                    }}
                                >
                                    Error loading files:{" "}
                                    {(error as TError)?.data?.message ||
                                        "Unknown error"}
                                </div>
                            )}
                            {isLoading && currentPage === 1 ? (
                                <div
                                    className={`empty-state ${
                                        isDark ? "dark" : ""
                                    }`}
                                >
                                    <Progress type="circle" />
                                    <h3>Loading media...</h3>
                                </div>
                            ) : allMediaItems.length === 0 ? (
                                <Empty description="No files found" />
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {allMediaItems.map((item) => {
                                        const isSelected = selectedItems.some(
                                            (f) => f.id === item.id
                                        );
                                        const fileSize = item.size
                                            ? `${(
                                                  item.size /
                                                  1024 /
                                                  1024
                                              ).toFixed(2)} MB`
                                            : "Unknown";
                                        const uploadDate = item.createdAt
                                            ? new Date(
                                                  item.createdAt
                                              ).toLocaleDateString()
                                            : "Unknown";

                                        return (
                                            <Col
                                                xs={24}
                                                sm={12}
                                                md={8}
                                                key={item.id}
                                            >
                                                <div
                                                    className={`file-item ${
                                                        isDark ? "dark" : ""
                                                    } ${
                                                        isSelected
                                                            ? "selected"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleSelect(item)
                                                    }
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            e.key === "Enter" ||
                                                            e.key === " "
                                                        ) {
                                                            handleSelect(item);
                                                        }
                                                    }}
                                                    aria-label={`Select file ${item.filename}`}
                                                >
                                                    <div className="file-preview">
                                                        {item.file_type ===
                                                        "image" ? (
                                                            <Image
                                                                alt={
                                                                    item.filename ||
                                                                    "file"
                                                                }
                                                                src={
                                                                    item.url ||
                                                                    "/placeholder.png"
                                                                }
                                                                width={200}
                                                                height={200}
                                                                className="file-image"
                                                                style={{
                                                                    objectFit:
                                                                        "cover",
                                                                    borderRadius:
                                                                        "4px",
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="file-icon-container">
                                                                <div className="file-icon">
                                                                    {getIconByType(
                                                                        item.file_type
                                                                    )}
                                                                </div>
                                                                <Tag
                                                                    color="blue"
                                                                    className="file-type-tag"
                                                                >
                                                                    {item.file_type.toUpperCase()}
                                                                </Tag>
                                                            </div>
                                                        )}
                                                        <div className="file-overlay">
                                                            <div className="file-checkbox">
                                                                {isSelected && (
                                                                    <CheckCircleOutlined
                                                                        style={{
                                                                            color: "#52c41a",
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="file-info">
                                                        <Typography.Text
                                                            ellipsis={{
                                                                tooltip:
                                                                    item.filename,
                                                            }}
                                                            className="file-name"
                                                        >
                                                            {item.filename}
                                                        </Typography.Text>
                                                        <div className="file-meta">
                                                            <Typography.Text type="secondary">
                                                                {fileSize} •{" "}
                                                                {uploadDate}
                                                            </Typography.Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            )}
                            <div
                                ref={loadMoreRef}
                                style={{
                                    height: "20px",
                                    textAlign: "center",
                                    padding: "16px",
                                }}
                            >
                                {isFetching && hasMore && (
                                    <>
                                        <Progress
                                            type="circle"
                                            percent={75}
                                            size="small"
                                        />
                                        <Typography.Text
                                            style={{ marginLeft: "8px" }}
                                        >
                                            Loading more files...
                                        </Typography.Text>
                                    </>
                                )}
                                {!hasMore && allMediaItems.length > 0 && (
                                    <Typography.Text
                                        style={{
                                            color: isDark ? "#ccc" : "#666",
                                        }}
                                    >
                                        No more files to load
                                    </Typography.Text>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ),
        },
    ];

    return (
        <Modal
            title="File Picker"
            open={open}
            onCancel={onCancel}
            width={900}
            className={`file-picker-modal ${isDark ? "dark-modal" : ""}`}
            footer={
                activeTabKey === "2"
                    ? [
                          <Button key="cancel" onClick={onCancel}>
                              Cancel
                          </Button>,
                          <Button
                              key="submit"
                              type="primary"
                              disabled={selectedItems.length === 0}
                              onClick={() => {
                                  onSelect(selectedItems);
                                  onCancel();
                              }}
                          >
                              {multiple
                                  ? `Select ${selectedItems.length} Files`
                                  : "Select File"}
                          </Button>,
                      ]
                    : null
            }
        >
            <Tabs
                defaultActiveKey="1"
                items={tabItems}
                onChange={(key) => setActiveTabKey(key)}
            />
        </Modal>
    );
}
