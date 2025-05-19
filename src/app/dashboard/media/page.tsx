"use client"
import { useState } from "react"

import { useTheme } from "@/components/theme-context"
import {
    AudioOutlined,
    CopyOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    EyeOutlined,
    FileImageOutlined,
    FileOutlined,
    FileTextOutlined,
    FileZipOutlined,
    FilterOutlined,
    PictureOutlined,
    SearchOutlined,
    UploadOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons"
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Image,
    Input,
    List,
    Modal,
    Row,
    Select,
    Space,
    Tabs,
    Tag,
    Upload,
    message,
} from "antd"

const { Option } = Select
const { TabPane } = Tabs
const { Dragger } = Upload

export default function MediaLibraryPage() {
  const { theme } = useTheme()
  const [searchText, setSearchText] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedMedia, setSelectedMedia] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const isDark = theme === "dark"

  // Sample media data
  const mediaItems = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Image ${i + 1}.jpg`,
    type: i % 5 === 0 ? "video" : i % 7 === 0 ? "document" : "image",
    url: `/placeholder.svg?height=200&width=300&query=newspaper image ${i + 1}`,
    size: Math.floor(Math.random() * 5000) + 100, // Size in KB
    dimensions: "1920x1080",
    uploadedBy: ["Admin User", "John Doe", "Jane Smith"][Math.floor(Math.random() * 3)],
    uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
    tags: ["news", "featured", "article", "banner", "gallery"][Math.floor(Math.random() * 5)],
  }))

  const filteredMedia = mediaItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.tags.toLowerCase().includes(searchText.toLowerCase()) ||
      item.uploadedBy.toLowerCase().includes(searchText.toLowerCase()),
  )

  const handleDelete = (item: any) => {
    setSelectedMedia(item)
    setIsDetailsModalOpen(false)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    message.success(`${selectedMedia.name} has been deleted`)
    setIsDeleteModalOpen(false)
  }

  const showDetails = (item: any) => {
    setSelectedMedia(item)
    setIsDetailsModalOpen(true)
  }

  const getIconByType = (type: string) => {
    switch (type) {
      case "image":
        return <FileImageOutlined />
      case "video":
        return <VideoCameraOutlined />
      case "audio":
        return <AudioOutlined />
      case "document":
        return <FileTextOutlined />
      case "archive":
        return <FileZipOutlined />
      default:
        return <FileOutlined />
    }
  }

  const getColorByType = (type: string) => {
    switch (type) {
      case "image":
        return "blue"
      case "video":
        return "red"
      case "audio":
        return "purple"
      case "document":
        return "green"
      case "archive":
        return "orange"
      default:
        return "default"
    }
  }

  const formatFileSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) {
      return `${sizeInKB} KB`
    } else {
      return `${(sizeInKB / 1024).toFixed(2)} MB`
    }
  }

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: isDark ? "#fff" : "#000",
          }}
        >
          Media Library
        </h1>
        <p style={{ color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.45)" }}>
          Manage your media files including images, videos, and documents.
        </p>
      </div>

      <Card
        variant="borderless"
        style={{
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          background: isDark ? "#1f1f1f" : "#fff",
        }}
      >
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <PictureOutlined /> Media Library
              </span>
            }
            key="1"
          >
            <div
              style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}
            >
              <Space wrap>
                <Input
                  placeholder="Search media"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                />
                <Select defaultValue="all" style={{ width: 120 }}>
                  <Option value="all">All Media</Option>
                  <Option value="image">Images</Option>
                  <Option value="video">Videos</Option>
                  <Option value="document">Documents</Option>
                </Select>
                <Button icon={<FilterOutlined />}>Filter</Button>
              </Space>
              <Space wrap>
                <Button
                  icon={viewMode === "grid" ? <FileOutlined /> : <PictureOutlined />}
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                >
                  {viewMode === "grid" ? "List View" : "Grid View"}
                </Button>
                <Upload>
                  <Button type="primary" icon={<UploadOutlined />}>
                    Upload
                  </Button>
                </Upload>
              </Space>
            </div>

            {viewMode === "grid" ? (
              <Row gutter={[16, 16]}>
                {filteredMedia.map((item) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                    <Card
                      hoverable
                      cover={
                        item.type === "image" ? (
                          <Image
                            alt={item.name}
                            src={item.url || "/placeholder.svg"}
                            style={{ height: 150, objectFit: "cover" }}
                            preview={false}
                          />
                        ) : (
                          <div
                            style={{
                              height: 150,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                            }}
                          >
                            {getIconByType(item.type)}
                            <div style={{ marginTop: 8 }}>{item.type.toUpperCase()}</div>
                          </div>
                        )
                      }
                      actions={[
                        <EyeOutlined key="view" onClick={() => showDetails(item)} />,
                        <EditOutlined key="edit" />,
                        <DeleteOutlined key="delete" onClick={() => handleDelete(item)} />,
                      ]}
                      bodyStyle={{ padding: "12px" }}
                    >
                      <Card.Meta
                        title={
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.name}
                            </div>
                            <Tag color={getColorByType(item.type)}>{item.type}</Tag>
                          </div>
                        }
                        description={
                          <div
                            style={{
                              fontSize: "12px",
                              color: isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
                            }}
                          >
                            {formatFileSize(item.size)} • {item.uploadedAt}
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={filteredMedia}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button key="view" type="text" icon={<EyeOutlined />} onClick={() => showDetails(item)} />,
                      <Button key="edit" type="text" icon={<EditOutlined />} />,
                      <Button
                        key="delete"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(item)}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        item.type === "image" ? (
                          <Image
                            alt={item.name}
                            src={item.url || "/placeholder.svg"}
                            style={{ width: 60, height: 60, objectFit: "cover" }}
                            preview={false}
                          />
                        ) : (
                          <div
                            style={{
                              width: 60,
                              height: 60,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                              fontSize: "24px",
                            }}
                          >
                            {getIconByType(item.type)}
                          </div>
                        )
                      }
                      title={
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {item.name}
                          <Tag color={getColorByType(item.type)}>{item.type}</Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div>
                            {formatFileSize(item.size)} • {item.dimensions}
                          </div>
                          <div>
                            Uploaded by {item.uploadedBy} on {item.uploadedAt}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </TabPane>

          <TabPane
            tab={
              <span>
                <UploadOutlined /> Upload
              </span>
            }
            key="2"
          >
            <Dragger multiple beforeUpload={() => false} style={{ padding: "20px" }}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: "48px", color: "#10b981" }} />
              </p>
              <p className="ant-upload-text" style={{ fontSize: "16px", fontWeight: "500" }}>
                Click or drag files to this area to upload
              </p>
              <p
                className="ant-upload-hint"
                style={{ color: isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)" }}
              >
                Support for single or bulk upload. Strictly prohibited from uploading company data or other banned
                files.
              </p>
            </Dragger>

            <Divider style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)" }} />

            <div>
              <h3 style={{ marginBottom: "16px", color: isDark ? "#fff" : "#000" }}>Upload Settings</h3>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Max File Size">
                    <Input defaultValue="10MB" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Allowed File Types">
                    <Select
                      mode="multiple"
                      defaultValue={["jpg", "png", "gif", "pdf", "doc"]}
                      style={{ width: "100%" }}
                    >
                      <Option value="jpg">JPG</Option>
                      <Option value="png">PNG</Option>
                      <Option value="gif">GIF</Option>
                      <Option value="pdf">PDF</Option>
                      <Option value="doc">DOC</Option>
                      <Option value="mp4">MP4</Option>
                      <Option value="mp3">MP3</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        {selectedMedia && (
          <p>
            Are you sure you want to delete <strong>{selectedMedia.name}</strong>? This action cannot be undone.
          </p>
        )}
      </Modal>

      <Modal
        title="Media Details"
        open={isDetailsModalOpen}
        onCancel={() => setIsDetailsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailsModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {selectedMedia && (
          <Row gutter={16}>
            <Col xs={24} md={12}>
              {selectedMedia.type === "image" ? (
                <Image
                  alt={selectedMedia.name}
                  src={selectedMedia.url || "/placeholder.svg"}
                  style={{ width: "100%", objectFit: "contain" }}
                />
              ) : (
                <div
                  style={{
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                    fontSize: "64px",
                  }}
                >
                  {getIconByType(selectedMedia.type)}
                </div>
              )}
            </Col>
            <Col xs={24} md={12}>
              <h3 style={{ marginTop: 0, marginBottom: "16px", color: isDark ? "#fff" : "#000" }}>
                {selectedMedia.name}
              </h3>
              <p>
                <Tag color={getColorByType(selectedMedia.type)}>{selectedMedia.type.toUpperCase()}</Tag>
              </p>
              <Divider
                style={{ margin: "12px 0", borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)" }}
              />
              <p>
                <strong>Size:</strong> {formatFileSize(selectedMedia.size)}
              </p>
              <p>
                <strong>Dimensions:</strong> {selectedMedia.dimensions}
              </p>
              <p>
                <strong>Uploaded by:</strong> {selectedMedia.uploadedBy}
              </p>
              <p>
                <strong>Upload date:</strong> {selectedMedia.uploadedAt}
              </p>
              <p>
                <strong>Tags:</strong> <Tag>{selectedMedia.tags}</Tag>
              </p>
              <Divider
                style={{ margin: "12px 0", borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)" }}
              />
              <Space>
                <Button icon={<DownloadOutlined />}>Download</Button>
                <Button icon={<CopyOutlined />}>Copy URL</Button>
                <Button icon={<EditOutlined />}>Edit</Button>
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(selectedMedia)}>
                  Delete
                </Button>
              </Space>
            </Col>
          </Row>
        )}
      </Modal>
    </>
  )
}
