"use client"

import { Button as EnhancedButton } from "@/components/ant/button"
import { Card as EnhancedCard } from "@/components/ant/card"
import { Divider as EnhancedDivider } from "@/components/ant/divider"
import { Modal as EnhancedModal } from "@/components/ant/modal"
import { Table as EnhancedTable } from "@/components/ant/table"
import { Tabs as EnhancedTabs } from "@/components/ant/tabs"
import {
    BarChartOutlined,
    CheckOutlined,
    CloseOutlined,
    EditOutlined,
    InfoCircleOutlined,
    ReloadOutlined,
    SearchOutlined,
} from "@ant-design/icons"
import { Button, Form, Input, List, Progress, Select, Switch, Tag, Tooltip, Typography } from "antd"
import { useState } from "react"

const { TextArea } = Input
const { TabPane } = EnhancedTabs
const { Title, Paragraph, Text } = Typography

export default function SEOPage() {
  const [activeTab, setActiveTab] = useState("1")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingPage, setEditingPage] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")

  // Sample data for SEO pages
  const pages = [
    {
      id: 1,
      title: "Home Page",
      url: "/",
      metaTitle: "News Portal - Latest News and Updates",
      metaDescription:
        "Get the latest news, updates, and in-depth articles on politics, technology, sports, and entertainment.",
      keywords: ["news", "latest news", "updates"],
      score: 92,
      status: "optimized",
      issues: [],
    },
    {
      id: 2,
      title: "Technology News",
      url: "/technology",
      metaTitle: "Technology News - Latest Tech Updates and Reviews",
      metaDescription:
        "Stay updated with the latest technology news, product reviews, and digital trends from around the world.",
      keywords: ["technology", "tech news", "digital trends"],
      score: 88,
      status: "optimized",
      issues: ["Missing alt tags on 2 images"],
    },
    {
      id: 3,
      title: "Sports News",
      url: "/sports",
      metaTitle: "Sports News - Latest Sports Updates and Results",
      metaDescription:
        "Get the latest sports news, match results, player updates, and in-depth analysis of your favorite sports.",
      keywords: ["sports", "sports news", "match results"],
      score: 75,
      status: "needs improvement",
      issues: ["Meta description too long", "Missing header tags"],
    },
    {
      id: 4,
      title: "Politics News",
      url: "/politics",
      metaTitle: "Politics News - Latest Political Updates",
      metaDescription:
        "Stay informed with the latest political news, policy updates, and government decisions from around the world.",
      keywords: ["politics", "political news", "government"],
      score: 65,
      status: "needs improvement",
      issues: ["Low keyword density", "Missing meta tags", "Duplicate content detected"],
    },
    {
      id: 5,
      title: "Entertainment News",
      url: "/entertainment",
      metaTitle: "Entertainment News - Latest Celebrity Updates",
      metaDescription: "Get the latest entertainment news, celebrity gossip, movie reviews, and TV show updates.",
      keywords: ["entertainment", "celebrity news", "movies"],
      score: 82,
      status: "good",
      issues: ["Missing structured data"],
    },
  ]

  // Sample data for keyword rankings
  const keywords = [
    { id: 1, keyword: "latest news", position: 3, change: 2, volume: 12500, difficulty: "High" },
    { id: 2, keyword: "technology news", position: 5, change: -1, volume: 8200, difficulty: "Medium" },
    { id: 3, keyword: "sports updates", position: 7, change: 3, volume: 6800, difficulty: "Medium" },
    { id: 4, keyword: "political news", position: 12, change: 0, volume: 5400, difficulty: "High" },
    { id: 5, keyword: "celebrity gossip", position: 8, change: 5, volume: 9200, difficulty: "Low" },
    { id: 6, keyword: "tech reviews", position: 15, change: -3, volume: 4800, difficulty: "Medium" },
    { id: 7, keyword: "breaking news", position: 22, change: -5, volume: 15000, difficulty: "Very High" },
  ]

  // Sample SEO issues
  const seoIssues = [
    { id: 1, type: "critical", issue: "Missing meta descriptions on 3 pages", affected: 3, impact: "High" },
    { id: 2, type: "warning", issue: "Duplicate title tags detected", affected: 2, impact: "Medium" },
    { id: 3, type: "warning", issue: "Missing alt tags on images", affected: 12, impact: "Medium" },
    { id: 4, type: "critical", issue: "Broken links detected", affected: 5, impact: "High" },
    { id: 5, type: "info", issue: "Pages with low word count", affected: 8, impact: "Low" },
    { id: 6, type: "critical", issue: "Slow page loading speed", affected: 4, impact: "High" },
    { id: 7, type: "warning", issue: "Missing header tags", affected: 6, impact: "Medium" },
  ]

  const showModal = (page = null) => {
    setEditingPage(page)
    if (page) {
      form.setFieldsValue({
        title: page.title,
        url: page.url,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        keywords: page.keywords.join(", "),
        status: page.status === "optimized",
      })
    } else {
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log("Form values:", values)
      setIsModalVisible(false)
      form.resetFields()
    })
  }

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchText.toLowerCase()) ||
      page.url.toLowerCase().includes(searchText.toLowerCase()),
  )

  const pageColumns = [
    {
      title: "Page Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (url) => <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{url}</code>,
    },
    {
      title: "SEO Score",
      dataIndex: "score",
      key: "score",
      render: (score) => (
        <div className="flex items-center">
          <Progress
            percent={score}
            size="small"
            status={score >= 90 ? "success" : score >= 70 ? "normal" : "exception"}
            className="w-24 mr-2"
          />
          <span
            className={`font-medium ${score >= 90 ? "text-green-600" : score >= 70 ? "text-blue-600" : "text-red-600"}`}
          >
            {score}
          </span>
        </div>
      ),
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "optimized"
              ? "green"
              : status === "good"
                ? "blue"
                : status === "needs improvement"
                  ? "orange"
                  : "red"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Issues",
      dataIndex: "issues",
      key: "issues",
      render: (issues) => (
        <div>
          {issues.length === 0 ? (
            <Tag color="green">No issues</Tag>
          ) : (
            <Tooltip title={issues.map((issue, i) => <div key={i}>{issue}</div>)}>
              <Tag color="orange">
                {issues.length} {issues.length === 1 ? "issue" : "issues"}
              </Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Tooltip title="Edit SEO Settings">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title="View Analytics">
            <Button type="text" icon={<BarChartOutlined />} className="text-green-500 hover:text-green-700" />
          </Tooltip>
        </div>
      ),
    },
  ]

  const keywordColumns = [
    {
      title: "Keyword",
      dataIndex: "keyword",
      key: "keyword",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      render: (position) => <span className="font-medium">{position}</span>,
      sorter: (a, b) => a.position - b.position,
    },
    {
      title: "Change",
      dataIndex: "change",
      key: "change",
      render: (change) => (
        <span
          className={`font-medium ${change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"}`}
        >
          {change > 0 ? `+${change}` : change}
        </span>
      ),
      sorter: (a, b) => a.change - b.change,
    },
    {
      title: "Search Volume",
      dataIndex: "volume",
      key: "volume",
      render: (volume) => <span>{volume.toLocaleString()}</span>,
      sorter: (a, b) => a.volume - b.volume,
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (difficulty) => (
        <Tag
          color={
            difficulty === "Low" ? "green" : difficulty === "Medium" ? "blue" : difficulty === "High" ? "orange" : "red"
          }
        >
          {difficulty}
        </Tag>
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SEO Management</h1>
        <div className="flex space-x-2">
          <Tooltip title="Run SEO Audit">
            <EnhancedButton icon={<ReloadOutlined />} variant="outline">
              Run Audit
            </EnhancedButton>
          </Tooltip>
          <EnhancedButton type="primary" icon={<EditOutlined />} onClick={() => showModal()} variant="gradient">
            Add SEO Settings
          </EnhancedButton>
        </div>
      </div>

      <EnhancedTabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
        <TabPane tab="Pages" key="1">
          <EnhancedCard className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="w-full md:w-1/3">
                <Input
                  placeholder="Search pages..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-1/4">
                <Select
                  placeholder="Filter by status"
                  defaultValue="all"
                  className="w-full"
                  options={[
                    { value: "all", label: "All Statuses" },
                    { value: "optimized", label: "Optimized" },
                    { value: "good", label: "Good" },
                    { value: "needs improvement", label: "Needs Improvement" },
                    { value: "poor", label: "Poor" },
                  ]}
                />
              </div>
            </div>

            <EnhancedDivider className="my-4" />

            <EnhancedTable
              columns={pageColumns}
              dataSource={filteredPages}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
              }}
            />
          </EnhancedCard>
        </TabPane>
        <TabPane tab="Keywords" key="2">
          <EnhancedCard>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="w-full md:w-1/3">
                <Input
                  placeholder="Search keywords..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-1/4">
                <Select
                  placeholder="Filter by difficulty"
                  defaultValue="all"
                  className="w-full"
                  options={[
                    { value: "all", label: "All Difficulties" },
                    { value: "Low", label: "Low" },
                    { value: "Medium", label: "Medium" },
                    { value: "High", label: "High" },
                    { value: "Very High", label: "Very High" },
                  ]}
                />
              </div>
            </div>

            <EnhancedDivider className="my-4" />

            <EnhancedTable
              columns={keywordColumns}
              dataSource={keywords}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
              }}
            />
          </EnhancedCard>
        </TabPane>
        <TabPane tab="Issues" key="3">
          <EnhancedCard>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="w-full md:w-1/3">
                <Input
                  placeholder="Search issues..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-1/4">
                <Select
                  placeholder="Filter by type"
                  defaultValue="all"
                  className="w-full"
                  options={[
                    { value: "all", label: "All Types" },
                    { value: "critical", label: "Critical" },
                    { value: "warning", label: "Warning" },
                    { value: "info", label: "Info" },
                  ]}
                />
              </div>
            </div>

            <EnhancedDivider className="my-4" />

            <List
              itemLayout="horizontal"
              dataSource={seoIssues}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="fix" type="primary" size="small">
                      Fix
                    </Button>,
                    <Button key="ignore" size="small">
                      Ignore
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.type === "critical"
                            ? "bg-red-100 text-red-600"
                            : item.type === "warning"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {item.type === "critical" ? "!" : item.type === "warning" ? "⚠" : "i"}
                      </div>
                    }
                    title={
                      <div className="flex items-center">
                        <span className="font-medium">{item.issue}</span>
                        <Tag
                          className="ml-2"
                          color={item.impact === "High" ? "red" : item.impact === "Medium" ? "orange" : "blue"}
                        >
                          {item.impact} Impact
                        </Tag>
                      </div>
                    }
                    description={`Affects ${item.affected} ${item.affected === 1 ? "page" : "pages"}`}
                  />
                </List.Item>
              )}
            />
          </EnhancedCard>
        </TabPane>
        <TabPane tab="Settings" key="4">
          <EnhancedCard>
            <Title level={4}>Global SEO Settings</Title>
            <EnhancedDivider />

            <Form layout="vertical">
              <Form.Item label="Site Title" initialValue="News Portal - Latest News and Updates">
                <Input />
              </Form.Item>

              <Form.Item
                label="Site Description"
                initialValue="Get the latest news, updates, and in-depth articles on politics, technology, sports, and entertainment."
              >
                <TextArea rows={3} />
              </Form.Item>

              <Form.Item label="Default Keywords" initialValue="news, latest news, breaking news, updates">
                <Input />
              </Form.Item>

              <Form.Item label="Robots.txt Content">
                <TextArea
                  rows={5}
                  defaultValue={`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /private/\n\nSitemap: https://example.com/sitemap.xml`}
                />
              </Form.Item>

              <Form.Item label="Generate XML Sitemap" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>

              <Form.Item label="Enable Schema Markup" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>

              <Form.Item label="Enable Social Meta Tags" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>

              <Form.Item label="Enable Canonical URLs" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>

              <Form.Item>
                <EnhancedButton type="primary" variant="gradient">
                  Save Settings
                </EnhancedButton>
              </Form.Item>
            </Form>
          </EnhancedCard>
        </TabPane>
      </EnhancedTabs>

      <EnhancedModal
        title={editingPage ? "Edit SEO Settings" : "Add SEO Settings"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <EnhancedButton key="submit" type="primary" onClick={handleSubmit} variant="gradient">
            {editingPage ? "Update" : "Save"}
          </EnhancedButton>,
        ]}
        width={700}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="title" label="Page Title" rules={[{ required: true, message: "Please enter page title" }]}>
            <Input placeholder="Enter page title" />
          </Form.Item>

          <Form.Item name="url" label="URL Path" rules={[{ required: true, message: "Please enter URL path" }]}>
            <Input placeholder="Enter URL path (e.g., /about)" />
          </Form.Item>

          <Form.Item
            name="metaTitle"
            label={
              <div className="flex items-center">
                <span>Meta Title</span>
                <Tooltip title="Recommended length: 50-60 characters">
                  <InfoCircleOutlined className="ml-1 text-gray-400" />
                </Tooltip>
              </div>
            }
            rules={[{ required: true, message: "Please enter meta title" }]}
          >
            <Input placeholder="Enter meta title" />
          </Form.Item>

          <Form.Item
            name="metaDescription"
            label={
              <div className="flex items-center">
                <span>Meta Description</span>
                <Tooltip title="Recommended length: 150-160 characters">
                  <InfoCircleOutlined className="ml-1 text-gray-400" />
                </Tooltip>
              </div>
            }
            rules={[{ required: true, message: "Please enter meta description" }]}
          >
            <TextArea rows={3} placeholder="Enter meta description" />
          </Form.Item>

          <Form.Item name="keywords" label="Keywords (comma separated)">
            <Input placeholder="Enter keywords, separated by commas" />
          </Form.Item>

          <Form.Item name="status" label="Mark as Optimized" valuePropName="checked">
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
          </Form.Item>
        </Form>
      </EnhancedModal>
    </div>
  )
}
