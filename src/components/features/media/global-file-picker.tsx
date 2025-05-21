/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client"

import { useTheme } from "@/components/theme-context"
import { useMediaUtils } from "@/hooks/use-media-utils"
import { useGetMediaQuery, useUploadMediaMutation } from "@/redux/features/media/mediaApi"
import { TFileDocument } from "@/types"
import {
  CloudUploadOutlined,
  FileImageOutlined,
  FileOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FolderOutlined,
  SearchOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons"
import { Button, Col, Empty, Image, Input, Modal, Row, Select, Tabs, Upload } from "antd"
import { useEffect, useState } from "react"
import "./media-components.css"

const { TabPane } = Tabs

interface GlobalFilePickerProps {
  open: boolean
  onCancel: () => void
  onSelect: (selectedFiles: TFileDocument[]) => void
  multiple?: boolean
  fileTypes?: string[]
  initialSelected?: number[]
}

export function GlobalFilePicker({
  open,
  onCancel,
  onSelect,
  multiple = false,
  fileTypes,
  initialSelected = [],
}: GlobalFilePickerProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [searchText, setSearchText] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [activeFolder, setActiveFolder] = useState<string>("all")
  const [selectedItems, setSelectedItems] = useState<number[]>(initialSelected)
  const { data: mediaItems = [], isLoading } = useGetMediaQuery()

  const { filterMedia } = useMediaUtils()
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation()

  // Reset selections when modal opens/closes
  useEffect(() => {
    if (open) {
      setSelectedItems(initialSelected)
    }
  }, [open, initialSelected])

  // Filter media items
  const filteredMedia = filterMedia(mediaItems, searchText, filterType, activeFolder)

  const handleSelect = (id: number) => {
    if (!multiple) {
      setSelectedItems([id])
      return
    }

    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleConfirm = () => {
    const selectedFiles = mediaItems.filter((item) => selectedItems.includes(item.id))
    onSelect(selectedFiles)
  }

  const handleUpload = (file: File) => {
    uploadMedia({
      files: [file],
      folder: activeFolder === "all" ? "Uncategorized" : activeFolder,
    })
    return false // Prevent default upload behavior
  }

  const getIconByType = (type: string) => {
    switch (type) {
      case "image":
        return <FileImageOutlined />
      case "video":
        return <VideoCameraOutlined />
      case "document":
        return <FileTextOutlined />
      case "archive":
        return <FileZipOutlined />
      default:
        return <FileOutlined />
    }
  }

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
        <Button key="submit" type="primary" disabled={selectedItems.length === 0} onClick={handleConfirm}>
          {multiple ? `Select ${selectedItems.length} Files` : "Select File"}
        </Button>,
      ]}
    >
      <Tabs defaultActiveKey="browse">
        <TabPane
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

              <Select defaultValue="all" value={filterType} onChange={setFilterType} className="file-picker-filter">
                <Select.Option value="all">All Types</Select.Option>
                <Select.Option value="image">Images</Select.Option>
                <Select.Option value="video">Videos</Select.Option>
                <Select.Option value="document">Documents</Select.Option>
                <Select.Option value="archive">Archives</Select.Option>
              </Select>
            </div>

            <div className="file-picker-info">{filteredMedia.length} files found</div>
          </div>

          <div className="file-picker-container">
            <div className="file-picker-sidebar">
              <h4 className={`sidebar-heading ${isDark ? "dark" : ""}`}>Folders</h4>
              <ul className="folder-list">
                <li
                  className={`folder-item ${activeFolder === "all" ? "active" : ""} ${isDark ? "dark" : ""}`}
                  onClick={() => setActiveFolder("all")}
                >
                  <FolderOutlined /> All Files
                  <span className="folder-count">{mediaItems.length}</span>
                </li>
                {Array.from(new Set(mediaItems.map((item) => item.fileType))).map((folder) => (
                  <li
                    key={folder}
                    className={`folder-item ${activeFolder === folder ? "active" : ""} ${isDark ? "dark" : ""}`}
                    onClick={() => setActiveFolder(folder)}
                  >
                    <FolderOutlined /> {folder}
                    <span className="folder-count">{mediaItems.filter((item) => item.fileType === folder).length}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="file-picker-content">
              {filteredMedia.length === 0 ? (
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
                        className={`file-item ${isDark ? "dark" : ""} ${selectedItems.includes(item.id) ? "selected" : ""}`}
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
                            <div className="file-icon">{getIconByType(item.fileType)}</div>
                          )}
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <CloudUploadOutlined /> Upload Files
            </span>
          }
          key="upload"
        >
          <div className="file-upload">
            <CloudUploadOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
            <h3>Upload to S3</h3>
            <p>Files will be uploaded directly to your S3 bucket</p>
            <Upload.Dragger
              multiple
              customRequest={({ file, onSuccess }) => {
                if (file instanceof File) {
                  handleUpload(file)
                  setTimeout(() => {
                    onSuccess && onSuccess("ok")
                  }, 2000)
                }
              }}
            >
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
              <p className="ant-upload-hint">
                Support for single or bulk upload. Strictly prohibited from uploading company data or other banned
                files.
              </p>
            </Upload.Dragger>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  )
}
