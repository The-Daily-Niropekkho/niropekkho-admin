"use client";

import FileCard from "@/components/features/media/file-card";
import FileCardInline from "@/components/features/media/file-card-inline";
import { GlobalFilePicker } from "@/components/features/media/global-file-picker";
import MediaFolders from "@/components/features/media/media-folders";
import { useTheme } from "@/components/theme-context";
import { FileType } from "@/constants";
import { useDebounced } from "@/hooks/use-debounce";
import { useGetMediaQuery } from "@/redux/features/media/mediaApi";
import { TArgsParam } from "@/types";
import {
    AppstoreOutlined,
    CloudUploadOutlined,
    FileOutlined,
    SearchOutlined,
    SortAscendingOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Input,
    Pagination,
    Progress,
    Row,
    Select,
} from "antd";
import { useState } from "react";
import "./media.css";

export default function MediaLibraryPage() {
    const { isDark } = useTheme();
    const [searchText, setSearchText] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [filterType, setFilterType] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [openFilePicker, setOpenFilePicker] = useState(false);
    // RTK Query hooks

    const query: TArgsParam = {};
    query["page"] = currentPage;
    query["limit"] = itemsPerPage;
    query["sortBy"] = sortBy;
    query["sortOrder"] = sortOrder;
    query["file_type"] = filterType;

    const debouncedSearchTerm = useDebounced({
        searchQuery: searchText,
        delay: 600,
    });
    if (!!debouncedSearchTerm) {
        query["searchTerm"] = debouncedSearchTerm;
    }

    const { data: mediaItems, isLoading } = useGetMediaQuery(query);

    const file_types = Object.values(FileType);
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
                            {file_types?.map((type) => (
                                <Select.Option key={type} value={type}>
                                    <span
                                        style={{ textTransform: "capitalize" }}
                                    >
                                        {type}
                                    </span>
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-2">
                        <Select
                            defaultValue="createdAt"
                            value={sortBy}
                            onChange={setSortBy}
                            className="media-sort"
                        >
                            <Select.Option value="createdAt">
                                Date
                            </Select.Option>
                            <Select.Option value="name">Name</Select.Option>
                            <Select.Option value="size">Size</Select.Option>
                            <Select.Option value="file_type">
                                Type
                            </Select.Option>
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
                            onClick={() => setOpenFilePicker(true)}
                            className="media-upload-btn"
                        >
                            Upload
                        </Button>
                    </div>
                </div>
                <div className="media-container">
                    <div className="media-sidebar">
                        <MediaFolders
                            activeFolder={filterType}
                            setActiveFolder={setFilterType}
                        />
                        {/*  <MediaStats stats={mediaStats} isDark={isDark} /> */}
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
                        ) : mediaItems?.data?.length === 0 ? (
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
                                    onClick={() => setOpenFilePicker(true)}
                                >
                                    Upload Files
                                </Button>
                            </div>
                        ) : viewMode === "grid" ? (
                            <div className="media-grid">
                                <Row gutter={[16, 16]}>
                                    {mediaItems?.data?.map((item) => (
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

                                {mediaItems?.data?.map((item) => (
                                    <FileCardInline key={item.id} item={item} />
                                ))}
                            </div>
                        )}
                        {(mediaItems?.meta?.total ?? 0) > itemsPerPage && (
                            <div
                                style={{
                                    textAlign: "center",
                                    marginTop: 16,
                                }}
                                className="flex justify-between"
                            >
                                <Select
                                    value={itemsPerPage}
                                    onChange={(value) => {
                                        setItemsPerPage(value);
                                        setCurrentPage(1);
                                    }}
                                    style={{ width: 120 }}
                                >
                                    <Select.Option value={6}>
                                        6 / page
                                    </Select.Option>
                                    <Select.Option value={12}>
                                        12 / page
                                    </Select.Option>
                                    <Select.Option value={24}>
                                        24 / page
                                    </Select.Option>
                                    <Select.Option value={48}>
                                        48 / page
                                    </Select.Option>
                                </Select>
                                <Pagination
                                    current={currentPage}
                                    pageSize={itemsPerPage}
                                    total={mediaItems?.meta?.total || 0}
                                    onChange={(page) => setCurrentPage(page)}
                                    showSizeChanger={false}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Card>
            <GlobalFilePicker
                open={openFilePicker}
                onCancel={() => setOpenFilePicker(false)}
                onSelect={() => {}}
            />
        </>
    );
}
