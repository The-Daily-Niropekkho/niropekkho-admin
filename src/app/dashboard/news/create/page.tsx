"use client"
import { useTheme } from "@/components/theme-context"
import {
  ClockCircleOutlined,
  CloseOutlined,
  EyeOutlined,
  FileTextOutlined,
  GlobalOutlined,
  PictureOutlined,
  SaveOutlined,
  SendOutlined,
} from "@ant-design/icons"
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Upload,
} from "antd"
import dynamic from "next/dynamic"
import { useState } from "react"

// Dynamically import the CKEditor component
const CKEditor = dynamic(() => import("@/components/ui/ckeditor"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #d9d9d9",
        borderRadius: "6px",
        background: "#f5f5f5",
      }}
    >
      Loading editor...
    </div>
  ),
})

const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

export default function CreateNewsPage() {
  const [form] = Form.useForm()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [editorContent, setEditorContent] = useState("")
  const isDark = theme === "dark"

  const onFinish = (values: any) => {
    setLoading(true)

    // Add the editor content to the form values
    values.content = editorContent

    console.log("Form values:", values)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      message.success("News article created successfully!")
    }, 1500)
  }

  const onReset = () => {
    form.resetFields()
    setEditorContent("")
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  const categories = [
    "Politics",
    "Business",
    "Science",
    "Sports",
    "Entertainment",
    "Weather",
    "Technology",
    "Health",
    "Education",
    "World",
  ]

  const tags = [
    "Breaking News",
    "Exclusive",
    "Feature",
    "Opinion",
    "Analysis",
    "Interview",
    "Investigation",
    "Review",
    "Profile",
    "Report",
  ]

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
          Create News Article
        </h1>
        <p style={{ color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.45)" }}>
          Create and publish a new news article with rich content and media.
        </p>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          background: isDark ? "#1f2937" : "#ffffff",
        }}
      >
        <Form
          form={form}
          name="news_form"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: true,
            featured: false,
            breaking: false,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} lg={16}>
              <Form.Item
                name="title"
                label="Headline"
                rules={[{ required: true, message: "Please enter the headline" }]}
              >
                <Input placeholder="Enter headline" size="large" />
              </Form.Item>

              <Form.Item name="subtitle" label="Subheadline">
                <Input placeholder="Enter subheadline" />
              </Form.Item>

              <Form.Item
                name="content"
                label="Content"
                rules={[{ required: true, message: "Please enter the article content" }]}
              >
                <CKEditor  />
              </Form.Item>

              <Form.Item
                name="excerpt"
                label="Excerpt"
                rules={[{ required: true, message: "Please enter an excerpt" }]}
              >
                <TextArea rows={3} placeholder="Enter a short excerpt for the article" />
              </Form.Item>
            </Col>

            <Col xs={24} lg={8}>
              <Tabs defaultActiveKey="1">
                <TabPane
                  tab={
                    <span>
                      <FileTextOutlined /> General
                    </span>
                  }
                  key="1"
                >
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: "Please select a category" }]}
                  >
                    <Select placeholder="Select a category">
                      {categories.map((category) => (
                        <Option key={category} value={category}>
                          {category}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item name="tags" label="Tags">
                    <Select mode="tags" placeholder="Select or create tags">
                      {tags.map((tag) => (
                        <Option key={tag} value={tag}>
                          {tag}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="author"
                    label="Author"
                    rules={[{ required: true, message: "Please select an author" }]}
                  >
                    <Select placeholder="Select an author">
                      <Option value="John Doe">John Doe</Option>
                      <Option value="Jane Smith">Jane Smith</Option>
                      <Option value="Robert Johnson">Robert Johnson</Option>
                      <Option value="Sarah Wilson">Sarah Wilson</Option>
                      <Option value="Michael Brown">Michael Brown</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item name="publishDate" label="Publish Date">
                    <DatePicker showTime style={{ width: "100%" }} placeholder="Select date and time" />
                  </Form.Item>

                  <Row gutter={8}>
                    <Col span={8}>
                      <Form.Item name="status" label="Status" valuePropName="checked">
                        <Switch checkedChildren="Published" unCheckedChildren="Draft" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="featured" label="Featured" valuePropName="checked">
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="breaking" label="Breaking" valuePropName="checked">
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <PictureOutlined /> Media
                    </span>
                  }
                  key="2"
                >
                  <Form.Item
                    name="featuredImage"
                    label="Featured Image"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                  >
                    <Upload name="featuredImage" listType="picture-card" maxCount={1} beforeUpload={() => false}>
                      <div>
                        <PictureOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>

                  <Form.Item name="gallery" label="Image Gallery" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload name="gallery" listType="picture-card" multiple beforeUpload={() => false}>
                      <div>
                        <PictureOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </TabPane>

                <TabPane
                  tab={
                    <span>
                      <GlobalOutlined /> SEO
                    </span>
                  }
                  key="3"
                >
                  <Form.Item name="metaTitle" label="Meta Title">
                    <Input placeholder="Enter meta title" />
                  </Form.Item>

                  <Form.Item name="metaDescription" label="Meta Description">
                    <TextArea rows={4} placeholder="Enter meta description" />
                  </Form.Item>

                  <Form.Item name="metaKeywords" label="Meta Keywords">
                    <Select mode="tags" placeholder="Enter keywords">
                      <Option value="news">news</Option>
                      <Option value="article">article</Option>
                      <Option value="breaking">breaking</Option>
                    </Select>
                  </Form.Item>
                </TabPane>
              </Tabs>
            </Col>
          </Row>

          <Divider style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)" }} />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Space>
              <Button icon={<EyeOutlined />}>Preview</Button>
              <Button icon={<ClockCircleOutlined />}>Save as Draft</Button>
            </Space>
            <Space>
              <Button icon={<CloseOutlined />} onClick={onReset}>
                Reset
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                Save
              </Button>
              <Button type="primary" icon={<SendOutlined />} style={{ background: "#10b981" }}>
                Publish
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </>
  )
}
