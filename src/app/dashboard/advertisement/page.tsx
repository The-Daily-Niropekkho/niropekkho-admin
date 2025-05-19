/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card as EnhancedCard } from "@/components/ant";
import { useTheme } from "@/components/theme-context";
import { Area } from "@ant-design/charts";
import {
    BarChartOutlined,
    DeleteOutlined,
    DollarOutlined,
    EditOutlined,
    EyeOutlined,
    FileImageOutlined,
    LineChartOutlined,
    LinkOutlined,
    PictureOutlined,
    PlusOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Progress,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Upload,
} from "antd";
import { useState } from "react";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function AdvertisementPage() {
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAd, setEditingAd] = useState<any>(null);
    const [form] = Form.useForm();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Sample data
    const adsData = [
        {
            id: 1,
            name: "Homepage Banner",
            type: "banner",
            position: "header",
            impressions: 45678,
            clicks: 1245,
            ctr: "2.73%",
            status: "active",
            startDate: "2023-05-01",
            endDate: "2023-06-30",
            revenue: 1250.75,
        },
        {
            id: 2,
            name: "Sidebar Ad",
            type: "sidebar",
            position: "sidebar",
            impressions: 32456,
            clicks: 876,
            ctr: "2.70%",
            status: "active",
            startDate: "2023-05-10",
            endDate: "2023-06-10",
            revenue: 780.5,
        },
        {
            id: 3,
            name: "In-Article Ad",
            type: "in-article",
            position: "content",
            impressions: 28765,
            clicks: 654,
            ctr: "2.27%",
            status: "active",
            startDate: "2023-05-15",
            endDate: "2023-07-15",
            revenue: 920.25,
        },
        {
            id: 4,
            name: "Footer Banner",
            type: "banner",
            position: "footer",
            impressions: 18976,
            clicks: 432,
            ctr: "2.28%",
            status: "inactive",
            startDate: "2023-04-01",
            endDate: "2023-05-01",
            revenue: 540.0,
        },
        {
            id: 5,
            name: "Pop-up Ad",
            type: "popup",
            position: "overlay",
            impressions: 15432,
            clicks: 765,
            ctr: "4.96%",
            status: "active",
            startDate: "2023-05-20",
            endDate: "2023-06-20",
            revenue: 1100.0,
        },
        {
            id: 6,
            name: "Category Page Banner",
            type: "banner",
            position: "category-header",
            impressions: 12543,
            clicks: 321,
            ctr: "2.56%",
            status: "active",
            startDate: "2023-05-05",
            endDate: "2023-07-05",
            revenue: 650.75,
        },
        {
            id: 7,
            name: "Mobile Sticky Ad",
            type: "sticky",
            position: "mobile-bottom",
            impressions: 34567,
            clicks: 987,
            ctr: "2.86%",
            status: "active",
            startDate: "2023-05-12",
            endDate: "2023-06-12",
            revenue: 870.25,
        },
        {
            id: 8,
            name: "Video Pre-roll",
            type: "video",
            position: "video-player",
            impressions: 8765,
            clicks: 432,
            ctr: "4.93%",
            status: "active",
            startDate: "2023-05-15",
            endDate: "2023-06-15",
            revenue: 1450.0,
        },
        {
            id: 9,
            name: "Newsletter Ad",
            type: "newsletter",
            position: "email",
            impressions: 5432,
            clicks: 321,
            ctr: "5.91%",
            status: "scheduled",
            startDate: "2023-06-01",
            endDate: "2023-07-01",
            revenue: 580.5,
        },
        {
            id: 10,
            name: "Interstitial Ad",
            type: "interstitial",
            position: "fullscreen",
            impressions: 4321,
            clicks: 234,
            ctr: "5.42%",
            status: "inactive",
            startDate: "2023-04-15",
            endDate: "2023-05-15",
            revenue: 920.0,
        },
    ];

    // Revenue data for chart
    const revenueData = [
        { date: "2023-05-01", revenue: 120 },
        { date: "2023-05-02", revenue: 140 },
        { date: "2023-05-03", revenue: 135 },
        { date: "2023-05-04", revenue: 155 },
        { date: "2023-05-05", revenue: 165 },
        { date: "2023-05-06", revenue: 180 },
        { date: "2023-05-07", revenue: 170 },
        { date: "2023-05-08", revenue: 190 },
        { date: "2023-05-09", revenue: 210 },
        { date: "2023-05-10", revenue: 205 },
        { date: "2023-05-11", revenue: 220 },
        { date: "2023-05-12", revenue: 240 },
        { date: "2023-05-13", revenue: 230 },
        { date: "2023-05-14", revenue: 245 },
        { date: "2023-05-15", revenue: 260 },
        { date: "2023-05-16", revenue: 270 },
        { date: "2023-05-17", revenue: 255 },
        { date: "2023-05-18", revenue: 265 },
        { date: "2023-05-19", revenue: 280 },
        { date: "2023-05-20", revenue: 295 },
        { date: "2023-05-21", revenue: 285 },
        { date: "2023-05-22", revenue: 300 },
        { date: "2023-05-23", revenue: 310 },
        { date: "2023-05-24", revenue: 305 },
        { date: "2023-05-25", revenue: 320 },
        { date: "2023-05-26", revenue: 330 },
        { date: "2023-05-27", revenue: 325 },
        { date: "2023-05-28", revenue: 340 },
        { date: "2023-05-29", revenue: 350 },
        { date: "2023-05-30", revenue: 345 },
    ];

    const filteredData = adsData.filter(
        (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.type.toLowerCase().includes(searchText.toLowerCase()) ||
            item.position.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleEdit = (record: any) => {
        setEditingAd(record);
        form.setFieldsValue({
            name: record.name,
            type: record.type,
            position: record.position,
            status: record.status,
            dateRange: [record.startDate, record.endDate].map(
                (date) => new Date(date)
            ),
        });
        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        message.success(`Advertisement with ID ${id} has been deleted`);
    };

    const handleCreate = () => {
        setEditingAd(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields()
            .then((values) => {
                if (editingAd) {
                    message.success(
                        `Advertisement "${values.name}" has been updated`
                    );
                } else {
                    message.success(
                        `Advertisement "${values.name}" has been created`
                    );
                }
                setIsModalVisible(false);
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a: any, b: any) => a.name.localeCompare(b.name),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            filters: [
                { text: "Banner", value: "banner" },
                { text: "Sidebar", value: "sidebar" },
                { text: "In-Article", value: "in-article" },
                { text: "Popup", value: "popup" },
                { text: "Sticky", value: "sticky" },
                { text: "Video", value: "video" },
                { text: "Newsletter", value: "newsletter" },
                { text: "Interstitial", value: "interstitial" },
            ],
            onFilter: (value: any, record: any) => record.type === value,
            render: (type: string) => {
                let color = "";
                switch (type) {
                    case "banner":
                        color = "blue";
                        break;
                    case "sidebar":
                        color = "green";
                        break;
                    case "in-article":
                        color = "purple";
                        break;
                    case "popup":
                        color = "red";
                        break;
                    case "sticky":
                        color = "orange";
                        break;
                    case "video":
                        color = "cyan";
                        break;
                    case "newsletter":
                        color = "geekblue";
                        break;
                    case "interstitial":
                        color = "magenta";
                        break;
                    default:
                        color = "default";
                }
                return <Tag color={color}>{type.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Position",
            dataIndex: "position",
            key: "position",
            filters: [
                { text: "Header", value: "header" },
                { text: "Sidebar", value: "sidebar" },
                { text: "Content", value: "content" },
                { text: "Footer", value: "footer" },
                { text: "Overlay", value: "overlay" },
            ],
            onFilter: (value: any, record: any) => record.position === value,
        },
        {
            title: "Impressions",
            dataIndex: "impressions",
            key: "impressions",
            sorter: (a: any, b: any) => a.impressions - b.impressions,
            render: (impressions: number) => impressions.toLocaleString(),
        },
        {
            title: "Clicks",
            dataIndex: "clicks",
            key: "clicks",
            sorter: (a: any, b: any) => a.clicks - b.clicks,
            render: (clicks: number) => clicks.toLocaleString(),
        },
        {
            title: "CTR",
            dataIndex: "ctr",
            key: "ctr",
            sorter: (a: any, b: any) =>
                Number.parseFloat(a.ctr) - Number.parseFloat(b.ctr),
        },
        {
            title: "Revenue",
            dataIndex: "revenue",
            key: "revenue",
            sorter: (a: any, b: any) => a.revenue - b.revenue,
            render: (revenue: number) => `$${revenue.toFixed(2)}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "";
                switch (status) {
                    case "active":
                        color = "success";
                        break;
                    case "inactive":
                        color = "default";
                        break;
                    case "scheduled":
                        color = "processing";
                        break;
                    default:
                        color = "default";
                }
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
            filters: [
                { text: "Active", value: "active" },
                { text: "Inactive", value: "inactive" },
                { text: "Scheduled", value: "scheduled" },
            ],
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="View">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure you want to delete this advertisement?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                            placement="left"
                        >
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // Chart configuration
    const areaConfig = {
        data: revenueData,
        xField: "date",
        yField: "revenue",
        smooth: true,
        areaStyle: {
            fill: `l(270) 0:${
                isDark ? "rgba(16, 185, 129, 0.01)" : "rgba(16, 185, 129, 0.01)"
            } 1:${
                isDark ? "rgba(16, 185, 129, 0.3)" : "rgba(16, 185, 129, 0.3)"
            }`,
        },
        line: {
            color: "#10b981",
        },
        xAxis: {
            label: {
                style: {
                    fill: isDark
                        ? "rgba(255, 255, 255, 0.65)"
                        : "rgba(0, 0, 0, 0.65)",
                },
            },
        },
        yAxis: {
            label: {
                style: {
                    fill: isDark
                        ? "rgba(255, 255, 255, 0.65)"
                        : "rgba(0, 0, 0, 0.65)",
                },
                formatter: (v: string) => `$${v}`,
            },
        },
    };

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
                    Advertisement Management
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage and track your advertisements and campaigns
                </p>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <EnhancedCard variant="default">
                        <Statistic
                            title="Total Revenue"
                            value={8063.0}
                            precision={2}
                            prefix={<DollarOutlined />}
                            suffix="USD"
                            valueStyle={{ color: "#10b981" }}
                        />
                        <div style={{ marginTop: "10px" }}>
                            <Progress percent={85} strokeColor="#10b981" />
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: isDark
                                        ? "rgba(255, 255, 255, 0.45)"
                                        : "rgba(0, 0, 0, 0.45)",
                                }}
                            >
                                85% of monthly target
                            </div>
                        </div>
                    </EnhancedCard>
                </Col>
                <Col xs={24} md={8}>
                    <EnhancedCard variant="default">
                        <Statistic
                            title="Total Impressions"
                            value={206935}
                            prefix={<EyeOutlined />}
                            valueStyle={{ color: "#3b82f6" }}
                        />
                        <div style={{ marginTop: "10px" }}>
                            <Progress percent={72} strokeColor="#3b82f6" />
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: isDark
                                        ? "rgba(255, 255, 255, 0.45)"
                                        : "rgba(0, 0, 0, 0.45)",
                                }}
                            >
                                72% of monthly target
                            </div>
                        </div>
                    </EnhancedCard>
                </Col>
                <Col xs={24} md={8}>
                    <EnhancedCard variant="default">
                        <Statistic
                            title="Average CTR"
                            value={3.46}
                            precision={2}
                            prefix={<BarChartOutlined />}
                            suffix="%"
                            valueStyle={{ color: "#8b5cf6" }}
                        />
                        <div style={{ marginTop: "10px" }}>
                            <Progress percent={92} strokeColor="#8b5cf6" />
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: isDark
                                        ? "rgba(255, 255, 255, 0.45)"
                                        : "rgba(0, 0, 0, 0.45)",
                                }}
                            >
                                92% of monthly target
                            </div>
                        </div>
                    </EnhancedCard>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col xs={24} lg={16}>
                    <EnhancedCard
                        title="Revenue Trend (Last 30 Days)"
                        variant="default"
                        extra={
                            <Space>
                                <Button
                                    size="small"
                                    icon={<LineChartOutlined />}
                                >
                                    View Details
                                </Button>
                            </Space>
                        }
                        style={{ marginBottom: "16px", height: "350px" }}
                    >
                        <Area {...areaConfig} height={250} />
                    </EnhancedCard>

                    <Card
                        variant="borderless"
                        style={{
                            borderRadius: "8px",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            background: isDark ? "#1f1f1f" : "#fff",
                        }}
                    >
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="All Advertisements" key="1">
                                <div
                                    style={{
                                        marginBottom: 16,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        flexWrap: "wrap",
                                        gap: 8,
                                    }}
                                >
                                    <Space wrap>
                                        <Input
                                            placeholder="Search advertisements"
                                            prefix={<SearchOutlined />}
                                            value={searchText}
                                            onChange={(e) =>
                                                setSearchText(e.target.value)
                                            }
                                            style={{ width: 250 }}
                                        />
                                        <Select
                                            defaultValue="all"
                                            style={{ width: 150 }}
                                        >
                                            <Option value="all">
                                                All Types
                                            </Option>
                                            <Option value="banner">
                                                Banner
                                            </Option>
                                            <Option value="sidebar">
                                                Sidebar
                                            </Option>
                                            <Option value="in-article">
                                                In-Article
                                            </Option>
                                            <Option value="popup">Popup</Option>
                                        </Select>
                                    </Space>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={handleCreate}
                                    >
                                        Add Advertisement
                                    </Button>
                                </div>
                                <Table
                                    dataSource={filteredData}
                                    columns={columns}
                                    rowKey="id"
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showTotal: (total, range) =>
                                            `${range[0]}-${range[1]} of ${total} items`,
                                    }}
                                    scroll={{ x: "max-content" }}
                                />
                            </TabPane>
                            <TabPane tab="Active" key="2">
                                <Table
                                    dataSource={filteredData.filter(
                                        (ad) => ad.status === "active"
                                    )}
                                    columns={columns}
                                    rowKey="id"
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showTotal: (total, range) =>
                                            `${range[0]}-${range[1]} of ${total} items`,
                                    }}
                                    scroll={{ x: "max-content" }}
                                />
                            </TabPane>
                            <TabPane tab="Scheduled" key="3">
                                <Table
                                    dataSource={filteredData.filter(
                                        (ad) => ad.status === "scheduled"
                                    )}
                                    columns={columns}
                                    rowKey="id"
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showTotal: (total, range) =>
                                            `${range[0]}-${range[1]} of ${total} items`,
                                    }}
                                    scroll={{ x: "max-content" }}
                                />
                            </TabPane>
                            <TabPane tab="Inactive" key="4">
                                <Table
                                    dataSource={filteredData.filter(
                                        (ad) => ad.status === "inactive"
                                    )}
                                    columns={columns}
                                    rowKey="id"
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showTotal: (total, range) =>
                                            `${range[0]}-${range[1]} of ${total} items`,
                                    }}
                                    scroll={{ x: "max-content" }}
                                />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <EnhancedCard
                        title="Top Performing Ads"
                        variant="default"
                        style={{ marginBottom: "16px" }}
                    >
                        <Table
                            dataSource={adsData
                                .sort(
                                    (a, b) =>
                                        Number.parseFloat(
                                            b.ctr.replace("%", "")
                                        ) -
                                        Number.parseFloat(
                                            a.ctr.replace("%", "")
                                        )
                                )
                                .slice(0, 5)}
                            pagination={false}
                            showHeader={false}
                            columns={[
                                {
                                    title: "Name",
                                    dataIndex: "name",
                                    key: "name",
                                    render: (text: string, record: any) => (
                                        <div>
                                            <div style={{ fontWeight: 500 }}>
                                                {text}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: isDark
                                                        ? "rgba(255, 255, 255, 0.45)"
                                                        : "rgba(0, 0, 0, 0.45)",
                                                }}
                                            >
                                                {record.type} •{" "}
                                                {record.position}
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    title: "CTR",
                                    dataIndex: "ctr",
                                    key: "ctr",
                                    align: "right" as const,
                                    render: (ctr: string) => (
                                        <Tag
                                            color="success"
                                            style={{ marginRight: 0 }}
                                        >
                                            {ctr}
                                        </Tag>
                                    ),
                                },
                            ]}
                        />
                    </EnhancedCard>

                    <EnhancedCard
                        title="Ad Positions Performance"
                        variant="default"
                        style={{ marginBottom: "16px" }}
                    >
                        {[
                            {
                                position: "Header",
                                ctr: "3.2%",
                                color: "#10b981",
                            },
                            {
                                position: "Sidebar",
                                ctr: "2.7%",
                                color: "#3b82f6",
                            },
                            {
                                position: "In-Article",
                                ctr: "2.3%",
                                color: "#8b5cf6",
                            },
                            {
                                position: "Footer",
                                ctr: "1.8%",
                                color: "#f59e0b",
                            },
                            {
                                position: "Popup",
                                ctr: "4.9%",
                                color: "#ef4444",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                style={{ marginBottom: index < 4 ? "12px" : 0 }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "4px",
                                    }}
                                >
                                    <span>{item.position}</span>
                                    <span>{item.ctr}</span>
                                </div>
                                <Progress
                                    percent={Number.parseFloat(item.ctr) * 20}
                                    strokeColor={item.color}
                                    showInfo={false}
                                />
                            </div>
                        ))}
                    </EnhancedCard>

                    <EnhancedCard title="Quick Actions" variant="default">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                block
                                onClick={handleCreate}
                            >
                                Create New Ad
                            </Button>
                            <Button icon={<BarChartOutlined />} block>
                                View Reports
                            </Button>
                            <Button icon={<DollarOutlined />} block>
                                Revenue Settings
                            </Button>
                            <Button icon={<FileImageOutlined />} block>
                                Ad Templates
                            </Button>
                        </Space>
                    </EnhancedCard>
                </Col>
            </Row>

            <Modal
                title={
                    editingAd ? "Edit Advertisement" : "Add New Advertisement"
                }
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Advertisement Name"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please enter advertisement name",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter advertisement name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select type",
                                    },
                                ]}
                            >
                                <Select placeholder="Select type">
                                    <Option value="banner">Banner</Option>
                                    <Option value="sidebar">Sidebar</Option>
                                    <Option value="in-article">
                                        In-Article
                                    </Option>
                                    <Option value="popup">Popup</Option>
                                    <Option value="sticky">Sticky</Option>
                                    <Option value="video">Video</Option>
                                    <Option value="newsletter">
                                        Newsletter
                                    </Option>
                                    <Option value="interstitial">
                                        Interstitial
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="position"
                                label="Position"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select position",
                                    },
                                ]}
                            >
                                <Select placeholder="Select position">
                                    <Option value="header">Header</Option>
                                    <Option value="sidebar">Sidebar</Option>
                                    <Option value="content">Content</Option>
                                    <Option value="footer">Footer</Option>
                                    <Option value="overlay">Overlay</Option>
                                    <Option value="category-header">
                                        Category Header
                                    </Option>
                                    <Option value="mobile-bottom">
                                        Mobile Bottom
                                    </Option>
                                    <Option value="video-player">
                                        Video Player
                                    </Option>
                                    <Option value="email">Email</Option>
                                    <Option value="fullscreen">
                                        Fullscreen
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                initialValue="active"
                            >
                                <Select placeholder="Select status">
                                    <Option value="active">Active</Option>
                                    <Option value="inactive">Inactive</Option>
                                    <Option value="scheduled">Scheduled</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="dateRange"
                        label="Campaign Duration"
                        rules={[
                            {
                                required: true,
                                message: "Please select date range",
                            },
                        ]}
                    >
                        <RangePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Image Upload" key="1">
                            <Form.Item name="image" label="Advertisement Image">
                                <Upload
                                    name="image"
                                    listType="picture-card"
                                    maxCount={1}
                                    beforeUpload={() => false}
                                >
                                    <div>
                                        <PictureOutlined />
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </TabPane>
                        <TabPane tab="HTML Code" key="2">
                            <Form.Item name="htmlCode" label="HTML Code">
                                <Input.TextArea
                                    rows={6}
                                    placeholder="Enter HTML code"
                                />
                            </Form.Item>
                        </TabPane>
                        <TabPane tab="External Link" key="3">
                            <Form.Item
                                name="externalLink"
                                label="External Link"
                            >
                                <Input
                                    prefix={<LinkOutlined />}
                                    placeholder="https://example.com/ad"
                                />
                            </Form.Item>
                        </TabPane>
                    </Tabs>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="targetUrl" label="Target URL">
                                <Input
                                    prefix={<LinkOutlined />}
                                    placeholder="https://example.com/landing-page"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="advertiser" label="Advertiser">
                                <Input placeholder="Enter advertiser name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="pricing" label="Pricing Model">
                                <Select placeholder="Select pricing model">
                                    <Option value="cpc">
                                        Cost Per Click (CPC)
                                    </Option>
                                    <Option value="cpm">
                                        Cost Per Mille (CPM)
                                    </Option>
                                    <Option value="cpa">
                                        Cost Per Action (CPA)
                                    </Option>
                                    <Option value="fixed">Fixed Price</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="price" label="Price">
                                <Input
                                    prefix="$"
                                    suffix="USD"
                                    placeholder="0.00"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
}
