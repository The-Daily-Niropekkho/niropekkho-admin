/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useTheme } from "@/components/theme-context";
import { useMediaUtils } from "@/hooks/use-media-utils";
import {
    useGetMediaQuery,
    useUploadMediaMutation,
} from "@/redux/features/media/mediaApi";
import { TFileDocument } from "@/types";
import { FilProgressMultipleFilesUploaderS3 } from "@/utils/handleFileUploderFileProgress";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    CloudUploadOutlined,
    FileImageOutlined,
    FileOutlined,
    FileTextOutlined,
    FileZipOutlined,
    LoadingOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, List, Modal, Progress, Select, Tabs, Tag, Typography, Upload } from "antd";
import { useEffect, useState } from "react";
import "./media-components.css";

const { TabPane } = Tabs;
const { Option } = Select;

interface GlobalFilePickerProps {
    open: boolean;
    onCancel: () => void;
    onSelect: (selectedFiles: TFileDocument[]) => void;
    multiple?: boolean;
    fileTypes?: string[];
    initialSelected?: string[];
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
    const [searchText, setSearchText] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [activeFolder, setActiveFolder] = useState<string>("all");
    const [selectedItems, setSelectedItems] =
        useState<string[]>(initialSelected);
    const [progressList, setProgressList] = useState<
        Array<{ name: string; progress: number; status: string; url?: string }>
    >([]);
    const { data: mediaItems = [], isLoading } = useGetMediaQuery(undefined);
    const { filterMedia } = useMediaUtils();
    const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

    // Filter media items based on search, type, and folder
    //   const filteredMedia = filterMedia(mediaItems, {
    //     searchText,
    //     fileType: filterType === "all" ? undefined : filterType,
    //     folder: activeFolder === "all" ? undefined : activeFolder,
    //     fileTypes,
    //   });

    // Reset selections and progress when modal opens/closes
    useEffect(() => {
        if (open) {
            setSelectedItems(initialSelected);
            setProgressList([]);
        }
    }, [open, initialSelected]);

    const handleSelect = (id: string) => {
        if (!multiple) {
            setSelectedItems([id]);
            return;
        }

        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleConfirm = () => {
        const selectedFiles = mediaItems.filter((item) =>
            selectedItems.includes(item.id)
        );
        onSelect(selectedFiles);
        onCancel();
    };

    const handleUpload = async (file: File) => {
        try {
            // Initialize progress tracking
            setProgressList((prev) => [
                ...prev,
                { name: file.name, progress: 0, status: "uploading" },
            ]);

            const uploadedFiles = await FilProgressMultipleFilesUploaderS3(
                [file],
                (updatedList: any) => setProgressList(updatedList)
            );

            // Automatically select the uploaded file(s)
            const uploadedFileIds = uploadedFiles?.map((file) => file.id);
            if (!multiple) {
                setSelectedItems([uploadedFileIds[0]]);
                onSelect([uploadedFiles[0]]);
                onCancel();
            } else {
                setSelectedItems((prev) => [...prev, ...uploadedFileIds]);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setProgressList((prev) =>
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

    return (
        <Modal
            title="File Picker"
            open={open}
            onCancel={onCancel}
            width={900}
            className={`file-picker-modal ${isDark ? "dark-modal" : ""}`}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    disabled={selectedItems.length === 0}
                    onClick={handleConfirm}
                >
                    {multiple
                        ? `Select ${selectedItems.length} Files`
                        : "Select File"}
                </Button>,
            ]}
        >
            <Tabs defaultActiveKey="upload">
                <TabPane
                    tab={
                        <span>
                            <CloudUploadOutlined /> Upload Files
                        </span>
                    }
                    key="upload"
                >
                    <Upload.Dragger
                        multiple={multiple}
                        accept={fileTypes?.join(",")}
                        customRequest={({ file, onSuccess }) => {
                            if (file instanceof File) {
                                handleUpload(file);
                                setTimeout(() => {
                                    onSuccess && onSuccess("ok");
                                }, 2000);
                            }
                        }}
                        showUploadList={false}
                        className="file-upload"
                    >
                        <p className="ant-upload-drag-icon">
                            <CloudUploadOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag files to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                            Support for {multiple ? "single or bulk" : "single"}{" "}
                            upload. Strictly prohibited from uploading company
                            data or other banned files.
                        </p>
                    </Upload.Dragger>
                    {progressList.length > 0 && (
                        <List
                            style={{ marginTop : "20px" }}
                            dataSource={progressList}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                }}
                                            >
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
                </TabPane>
                {/* <TabPane
          tab={
            <span>
              <FolderOutlined /> Browse Files
            </span>
          }
          key="browse"
        >
          <div className="file-picker-toolbar">
            <div className="file-picker-filters">
              <Input
                placeholder="Search files"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="file-picker-search"
              />
              <Select
                defaultValue="all"
                value={filterType}
                onChange={setFilterType}
                className="file-picker-filter"
              >
                <Option value="all">All Types</Option>
                <Option value="image">Images</Option>
                <Option value="video">Videos</Option>
                <Option value="document">Documents</Option>
                <Option value="archive">Archives</Option>
              </Select>
            </div>
            <div className="file-picker-info">
              {filteredMedia.length} files found
            </div>
          </div>
          <div className="file-picker-container">
            <div className="file-picker-sidebar">
              <h4 className={`sidebar-heading ${isDark ? "dark" : ""}`}>
                Folders
              </h4>
              <ul className="folder-list">
                <li
                  className={`folder-item ${
                    activeFolder === "all" ? "active" : ""
                  } ${isDark ? "dark" : ""}`}
                  onClick={() => setActiveFolder("all")}
                >
                  <FolderOutlined /> All Files
                  <span className="folder-count">{mediaItems.length}</span>
                </li>
                {Array.from(new Set(mediaItems.map((item) => item.fileType))).map(
                  (folder) => (
                    <li
                      key={folder}
                      className={`folder-item ${
                        activeFolder === folder ? "active" : ""
                      } ${isDark ? "dark" : ""}`}
                      onClick={() => setActiveFolder(folder)}
                    >
                      <FolderOutlined /> {folder}
                      <span className="folder-count">
                        {mediaItems.filter((item) => item.fileType === folder).length}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="file-picker-content">
              {isLoading ? (
                <div>Loading...</div>
              ) : filteredMedia.length === 0 ? (
                <Empty
                  description="No files found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="file-picker-empty"
                />
              ) : (
                <Row gutter={[16, 16]} className="file-picker-grid">
                  {filteredMedia.map((item) => (
                    <Col xs={24} sm={12} md={8} key={item.id}>
                      <div
                        className={`file-item ${isDark ? "dark" : ""} ${
                          selectedItems.includes(item.id) ? "selected" : ""
                        }`}
                        onClick={() => handleSelect(item.id)}
                      >
                        <div className="file-preview">
                          {item.fileType === "image" ? (
                            <Image
                              alt={item.filename}
                              src={item.url || "/placeholder.png"}
                              preview={false}
                              className="file-image"
                            />
                          ) : (
                            <div className="file-icon">
                              {getIconByType(item.fileType)}
                            </div>
                          )}
                          <div className="file-name">{item.filename}</div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </div>
        </TabPane> */}
            </Tabs>
        </Modal>
    );
}
