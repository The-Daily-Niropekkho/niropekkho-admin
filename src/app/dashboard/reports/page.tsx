"use client"
import { Card as EnhancedCard } from "@/components/ant"
import { useTheme } from "@/components/theme-context"
import { Area, Column, Pie } from "@ant-design/charts"
import {
    BarChartOutlined,
    CalendarOutlined,
    DollarOutlined,
    DownloadOutlined,
    EyeOutlined,
    FallOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    LineChartOutlined,
    PieChartOutlined,
    PrinterOutlined,
    ReloadOutlined,
    RiseOutlined,
    ShareAltOutlined,
    UserOutlined,
} from "@ant-design/icons"
import { Button, Card, Col, DatePicker, Dropdown, Menu, Row, Select, Space, Statistic, Table, Tabs } from "antd"
import { useState } from "react"

const { TabPane } = Tabs
const { RangePicker } = DatePicker
const { Option } = Select

export default function ReportsPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null)

  // Sample data for charts
  const trafficData = [
    { date: "2023-05-01", pageviews: 5200, visitors: 3100 },
    { date: "2023-05-02", pageviews: 5500, visitors: 3300 },
    { date: "2023-05-03", pageviews: 5300, visitors: 3200 },
    { date: "2023-05-04", pageviews: 5600, visitors: 3400 },
    { date: "2023-05-05", pageviews: 6100, visitors: 3700 },
    { date: "2023-05-06", pageviews: 4900, visitors: 2900 },
    { date: "2023-05-07", pageviews: 4700, visitors: 2800 },
    { date: "2023-05-08", pageviews: 5400, visitors: 3300 },
    { date: "2023-05-09", pageviews: 5800, visitors: 3500 },
    { date: "2023-05-10", pageviews: 5900, visitors: 3600 },
    { date: "2023-05-11", pageviews: 6200, visitors: 3800 },
    { date: "2023-05-12", pageviews: 6300, visitors: 3900 },
    { date: "2023-05-13", pageviews: 5700, visitors: 3500 },
    { date: "2023-05-14", pageviews: 5100, visitors: 3100 },
    { date: "2023-05-15", pageviews: 5800, visitors: 3600 },
    { date: "2023-05-16", pageviews: 6000, visitors: 3700 },
    { date: "2023-05-17", pageviews: 6100, visitors: 3800 },
    { date: "2023-05-18", pageviews: 6300, visitors: 3900 },
    { date: "2023-05-19", pageviews: 6500, visitors: 4000 },
    { date: "2023-05-20", pageviews: 6200, visitors: 3800 },
    { date: "2023-05-21", pageviews: 5800, visitors: 3500 },
    { date: "2023-05-22", pageviews: 6100, visitors: 3700 },
    { date: "2023-05-23", pageviews: 6400, visitors: 3900 },
    { date: "2023-05-24", pageviews: 6600, visitors: 4100 },
    { date: "2023-05-25", pageviews: 6700, visitors: 4200 },
    { date: "2023-05-26", pageviews: 6500, visitors: 4000 },
    { date: "2023-05-27", pageviews: 6000, visitors: 3700 },
    { date: "2023-05-28", pageviews: 5700, visitors: 3500 },
    { date: "2023-05-29", pageviews: 6200, visitors: 3800 },
    { date: "2023-05-30", pageviews: 6400, visitors: 3900 },
  ]

  const categoryData = [
    { category: "Politics", pageviews: 45600, percentage: 22 },
    { category: "Business", pageviews: 32400, percentage: 16 },
    { category: "Technology", pageviews: 28900, percentage: 14 },
    { category: "Sports", pageviews: 26500, percentage: 13 },
    { category: "Entertainment", pageviews: 22800, percentage: 11 },
    { category: "Health", pageviews: 18700, percentage: 9 },
    { category: "Science", pageviews: 16400, percentage: 8 },
    { category: "World", pageviews: 14200, percentage: 7 },
  ]

  const deviceData = [
    { type: "Mobile", value: 58 },
    { type: "Desktop", value: 32 },
    { type: "Tablet", value: 10 },
  ]

  const sourceData = [
    { source: "Direct", visitors: 42500, percentage: 32 },
    { source: "Organic Search", visitors: 38700, percentage: 29 },
    { source: "Social Media", visitors: 24600, percentage: 18 },
    { source: "Referral", visitors: 16800, percentage: 13 },
    { source: "Email", visitors: 10500, percentage: 8 },
  ]

  const topArticlesData = [
    {
      title: "Breaking News: Major Political Development",
      category: "Politics",
      views: 12450,
      comments: 345,
      shares: 2100,
      published: "2023-05-15",
    },
    {
      title: "Economic Forecast for the Coming Quarter",
      category: "Business",
      views: 8760,
      comments: 187,
      shares: 1450,
      published: "2023-05-18",
    },
    {
      title: "New Scientific Discovery Announced",
      category: "Science",
      views: 7890,
      comments: 210,
      shares: 1320,
      published: "2023-05-20",
    },
    {
      title: "Local Sports Team Wins Championship",
      category: "Sports",
      views: 9870,
      comments: 432,
      shares: 1870,
      published: "2023-05-22",
    },
    {
      title: "Celebrity Interview: Behind the Scenes",
      category: "Entertainment",
      views: 8540,
      comments: 276,
      shares: 1650,
      published: "2023-05-25",
    },
  ]

  // Chart configurations
  const trafficAreaConfig = {
    data: trafficData,
    xField: "date",
    yField: "pageviews",
    smooth: true,
    areaStyle: {
      fill: `l(270) 0:${isDark ? "rgba(16, 185, 129, 0.01)" : "rgba(16, 185, 129, 0.01)"} 1:${
        isDark ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.3)"
      }`,
    },
    line: {
      color: "#10b981",
    },
    xAxis: {
      label: {
        style: {
          fill: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)",
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)",
        },
      },
    },
  }

  const categoryColumnConfig = {
    data: categoryData,
    xField: "category",
    yField: "pageviews",
    color: "#8b5cf6",
    label: {
      position: "top",
      style: {
        fill: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)",
      },
    },
    xAxis: {
      label: {
        style: {
          fill: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)",
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)",
        },
      },
    },
  }

  const devicePieConfig = {
    data: deviceData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "element-active" }],
    legend: {
      position: "bottom",
    },
    color: ["#10b981", "#3b82f6", "#f59e0b"],
    statistic: {
      title: {
        style: {
          color: isDark ? "#ffffff" : "#000000",
        },
        content: "Devices",
      },
      content: {
        style: {
          color: isDark ? "#ffffff" : "#000000",
        },
      },
    },
  }

  const sourceColumnConfig = {
    data: sourceData,
    xField: "source",
    yField: "visitors",
    color: "#3b82f6",
    label: {
      position: "top",
      style: {
        fill: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)",
      },
    },
    xAxis: {
      label: {
        style: {
          fill: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)",
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)",
        },
      },
    },
  }

  const topArticlesColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <a href="#">{text}</a>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      sorter: (a: any, b: any) => a.views - b.views,
      render: (views: number) => views.toLocaleString(),
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      sorter: (a: any, b: any) => a.comments - b.comments,
      render: (comments: number) => comments.toLocaleString(),
    },
    {
      title: "Shares",
      dataIndex: "shares",
      key: "shares",
      sorter: (a: any, b: any) => a.shares - b.shares,
      render: (shares: number) => shares.toLocaleString(),
    },
    {
      title: "Published",
      dataIndex: "published",
      key: "published",
    },
  ]

  const exportMenu = (
    <Menu>
      <Menu.Item key="1" icon={<FileExcelOutlined />}>
        Export to Excel
      </Menu.Item>
      <Menu.Item key="2" icon={<FilePdfOutlined />}>
        Export to PDF
      </Menu.Item>
      <Menu.Item key="3" icon={<PrinterOutlined />}>
        Print Report
      </Menu.Item>
      <Menu.Item key="4" icon={<ShareAltOutlined />}>
        Share Report
      </Menu.Item>
    </Menu>
  )

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
          Analytics Reports
        </h1>
        <p style={{ color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.45)" }}>
          View detailed analytics and performance reports for your website
        </p>
      </div>

      <Card
        variant="borderless"
        style={{
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          background: isDark ? "#1f1f1f" : "#fff",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
          <Space>
            <RangePicker
              onChange={(dates) => {
                if (dates) {
                  setDateRange([dates[0]?.toDate() as Date, dates[1]?.toDate() as Date])
                } else {
                  setDateRange(null)
                }
              }}
            />
            <Select defaultValue="all" style={{ width: 150 }}>
              <Option value="all">All Categories</Option>
              <Option value="politics">Politics</Option>
              <Option value="business">Business</Option>
              <Option value="technology">Technology</Option>
              <Option value="sports">Sports</Option>
              <Option value="entertainment">Entertainment</Option>
            </Select>
            <Button icon={<ReloadOutlined />}>Refresh</Button>
          </Space>
          <Space>
            <Dropdown overlay={exportMenu} placement="bottomRight">
              <Button icon={<DownloadOutlined />}>Export</Button>
            </Dropdown>
          </Space>
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <LineChartOutlined /> Traffic Overview
              </span>
            }
            key="1"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <EnhancedCard variant="default">
                  <Statistic
                    title="Total Pageviews"
                    value={173500}
                    prefix={<EyeOutlined />}
                    valueStyle={{ color: "#10b981" }}
                  />
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
                    <RiseOutlined style={{ color: "#10b981", marginRight: "5px" }} />
                    <span style={{ color: "#10b981" }}>12.5% increase</span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
                        marginLeft: "5px",
                      }}
                    >
                      vs. last month
                    </span>
                  </div>
                </EnhancedCard>
              </Col>
              <Col xs={24} sm={8}>
                <EnhancedCard variant="default">
                  <Statistic
                    title="Unique Visitors"
                    value={105200}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: "#3b82f6" }}
                  />
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
                    <RiseOutlined style={{ color: "#3b82f6", marginRight: "5px" }} />
                    <span style={{ color: "#3b82f6" }}>8.3% increase</span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
                        marginLeft: "5px",
                      }}
                    >
                      vs. last month
                    </span>
                  </div>
                </EnhancedCard>
              </Col>
              <Col xs={24} sm={8}>
                <EnhancedCard variant="default">
                  <Statistic
                    title="Avg. Time on Site"
                    value="3:45"
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: "#8b5cf6" }}
                  />
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
                    <FallOutlined style={{ color: "#ef4444", marginRight: "5px" }} />
                    <span style={{ color: "#ef4444" }}>2.1% decrease</span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
                        marginLeft: "5px",
                      }}
                    >
                      vs. last month
                    </span>
                  </div>
                </EnhancedCard>
              </Col>
            </Row>

            <EnhancedCard title="Traffic Trend" variant="default" style={{ marginTop: "16px", height: "400px" }}>
              <Area {...trafficAreaConfig} height={300} />
            </EnhancedCard>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChartOutlined /> Content Performance
              </span>
            }
            key="2"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <EnhancedCard title="Category Performance" variant="default" style={{ height: "400px" }}>
                  <Column {...categoryColumnConfig} height={300} />
                </EnhancedCard>
              </Col>
              <Col xs={24} lg={12}>
                <EnhancedCard title="Top Articles" variant="default" style={{ height: "400px" }}>
                  <Table dataSource={topArticlesData} columns={topArticlesColumns} pagination={false} size="small" />
                </EnhancedCard>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              <Col xs={24}>
                <EnhancedCard title="Content Engagement Metrics" variant="default">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                      <Statistic
                        title="Avg. Read Time"
                        value="2:15"
                        suffix="minutes"
                        valueStyle={{ color: "#10b981" }}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic
                        title="Avg. Comments per Article"
                        value={12.5}
                        precision={1}
                        valueStyle={{ color: "#3b82f6" }}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic title="Social Shares" value={24680} valueStyle={{ color: "#8b5cf6" }} />
                    </Col>
                  </Row>
                </EnhancedCard>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <PieChartOutlined /> Audience
              </span>
            }
            key="3"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <EnhancedCard title="Device Distribution" variant="default" style={{ height: "400px" }}>
                  <Pie {...devicePieConfig} height={300} />
                </EnhancedCard>
              </Col>
              <Col xs={24} lg={12}>
                <EnhancedCard title="Traffic Sources" variant="default" style={{ height: "400px" }}>
                  <Column {...sourceColumnConfig} height={300} />
                </EnhancedCard>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              <Col xs={24}>
                <EnhancedCard title="Geographic Distribution" variant="default">
                  <Table
                    dataSource={[
                      { country: "United States", visitors: 42500, percentage: 40.4 },
                      { country: "India", visitors: 18700, percentage: 17.8 },
                      { country: "United Kingdom", visitors: 12400, percentage: 11.8 },
                      { country: "Canada", visitors: 8900, percentage: 8.5 },
                      { country: "Australia", visitors: 6800, percentage: 6.5 },
                      { country: "Germany", visitors: 5400, percentage: 5.1 },
                      { country: "France", visitors: 4200, percentage: 4.0 },
                      { country: "Others", visitors: 6300, percentage: 6.0 },
                    ]}
                    columns={[
                      { title: "Country", dataIndex: "country", key: "country" },
                      {
                        title: "Visitors",
                        dataIndex: "visitors",
                        key: "visitors",
                        render: (visitors: number) => visitors.toLocaleString(),
                      },
                      {
                        title: "Percentage",
                        dataIndex: "percentage",
                        key: "percentage",
                        render: (percentage: number) => `${percentage}%`,
                      },
                    ]}
                    pagination={false}
                  />
                </EnhancedCard>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <DollarOutlined /> Revenue
              </span>
            }
            key="4"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <EnhancedCard variant="default">
                  <Statistic
                    title="Total Revenue"
                    value={28450.75}
                    precision={2}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: "#10b981" }}
                  />
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
                    <RiseOutlined style={{ color: "#10b981", marginRight: "5px" }} />
                    <span style={{ color: "#10b981" }}>15.2% increase</span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
                        marginLeft: "5px",
                      }}
                    >
                      vs. last month
                    </span>
                  </div>
                </EnhancedCard>
              </Col>
              <Col xs={24} sm={8}>
                <EnhancedCard variant="default">
                  <Statistic
                    title="Ad Revenue"
                    value={18750.5}
                    precision={2}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: "#3b82f6" }}
                  />
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
                    <RiseOutlined style={{ color: "#3b82f6", marginRight: "5px" }} />
                    <span style={{ color: "#3b82f6" }}>12.8% increase</span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
                        marginLeft: "5px",
                      }}
                    >
                      vs. last month
                    </span>
                  </div>
                </EnhancedCard>
              </Col>
              <Col xs={24} sm={8}>
                <EnhancedCard variant="default">
                  <Statistic
                    title="Subscription Revenue"
                    value={9700.25}
                    precision={2}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: "#8b5cf6" }}
                  />
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
                    <RiseOutlined style={{ color: "#8b5cf6", marginRight: "5px" }} />
                    <span style={{ color: "#8b5cf6" }}>18.5% increase</span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
                        marginLeft: "5px",
                      }}
                    >
                      vs. last month
                    </span>
                  </div>
                </EnhancedCard>
              </Col>
            </Row>

            <EnhancedCard title="Revenue by Category" variant="default" style={{ marginTop: "16px" }}>
              <Table
                dataSource={[
                  { category: "Politics", adRevenue: 5250.75, subscriptionRevenue: 2800.5, total: 8051.25 },
                  { category: "Business", adRevenue: 4120.25, subscriptionRevenue: 1950.75, total: 6071.0 },
                  { category: "Technology", adRevenue: 3450.5, subscriptionRevenue: 1650.25, total: 5100.75 },
                  { category: "Sports", adRevenue: 2980.75, subscriptionRevenue: 1450.5, total: 4431.25 },
                  { category: "Entertainment", adRevenue: 2150.25, subscriptionRevenue: 1200.75, total: 3351.0 },
                  { category: "Health", adRevenue: 1800.0, subscriptionRevenue: 850.5, total: 2650.5 },
                ]}
                columns={[
                  { title: "Category", dataIndex: "category", key: "category" },
                  {
                    title: "Ad Revenue",
                    dataIndex: "adRevenue",
                    key: "adRevenue",
                    render: (revenue: number) => `$${revenue.toFixed(2)}`,
                  },
                  {
                    title: "Subscription Revenue",
                    dataIndex: "subscriptionRevenue",
                    key: "subscriptionRevenue",
                    render: (revenue: number) => `$${revenue.toFixed(2)}`,
                  },
                  {
                    title: "Total Revenue",
                    dataIndex: "total",
                    key: "total",
                    render: (revenue: number) => `$${revenue.toFixed(2)}`,
                  },
                ]}
                pagination={false}
              />
            </EnhancedCard>
          </TabPane>
        </Tabs>
      </Card>
    </>
  )
}
