"use client";
import { useTheme } from "@/components/theme-context";
import {
    ClockCircleOutlined,
    CloseOutlined,
    EyeOutlined,
    FileTextOutlined,
    GlobalOutlined,
    PictureOutlined,
    SaveOutlined,
    SendOutlined,
} from "@ant-design/icons";
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
} from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import the CKEditor component
const CKEditor = dynamic(() => import("@/components/ck-editor"), {
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
});

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

export default function CreateNewsPage() {
    const [form] = Form.useForm();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [editorContent, setEditorContent] = useState("");
    const isDark = theme === "dark";

    const onFinish = (values: any) => {
        setLoading(true);

        // Add the editor content to the form values
        values.content = editorContent;

        console.log("Form values:", values);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            message.success("News article created successfully!");
        }, 1500);
    };

    const onReset = () => {
        form.resetFields();
        setEditorContent("");
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

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
    ];

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
    ];

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
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Create and publish a new news article with rich content and
                    media.
                </p>
            </div>

            <Card
                variant="borderless"
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
                        publish_status: true,
                        is_latest_news: false,
                        is_breaking_news: false,
                        is_top_breaking_news: false,
                    }}
                >
                    <Row gutter={16}>
                        <Col xs={24} lg={16}>
                            <Form.Item
                                name="head_line"
                                label="Headline"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the headline",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Enter headline"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item name="short_head" label="Subheadline">
                                <Input placeholder="Enter subheadline" />
                            </Form.Item>
                            <Form.Item name="custom_url" label="Custom Url">
                                <Input placeholder="Enter custom url" />
                            </Form.Item>

                            <Form.Item
                                name="details_html"
                                label="Content"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please enter the article content",
                                    },
                                ]}
                            >
                                <CKEditor
                                    onChange={(content) =>
                                        setEditorContent(content)
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                name="excerpt"
                                label="Excerpt"
                                rules={[
                                    {
                                        required: false,
                                        message: "Please enter an excerpt",
                                    },
                                ]}
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Enter a short excerpt for the article"
                                />
                            </Form.Item>
                            <Form.Item name="reference" label="Reference">
                                <Input placeholder="Enter reference" />
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
                                        name="category_id"
                                        label="Category"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select a category",
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Select a category">
                                            {categories.map((category) => (
                                                <Option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="category_serial"
                                                label="Category Position"
                                                rules={[
                                                    {
                                                        required: false,
                                                        message:
                                                            "Please select a category position",
                                                    },
                                                ]}
                                            >
                                                <Select placeholder="Select a category position" allowClear>
                                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((position) => (
                                                        <Option
                                                            key={position}
                                                            value={position}
                                                        >
                                                            {position}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="home_serial"
                                                label="Home Position"
                                                rules={[
                                                    {
                                                        required: false,
                                                        message:
                                                            "Please select a home position",
                                                    },
                                                ]}
                                            >
                                                <Select placeholder="Select a home position" allowClear>
                                                    {[
                                                        0, 1, 2, 3, 4, 5, 6, 7,
                                                        8, 9, 10,
                                                    ].map((position) => (
                                                        <Option
                                                            key={position}
                                                            value={position}
                                                        >
                                                            {position}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="topic_id"
                                                label="Topic"
                                                rules={[
                                                    {
                                                        required: false,
                                                        message:
                                                            "Please select a topic",
                                                    },
                                                ]}
                                            >
                                                <Select placeholder="Select a topic" allowClear>
                                                    {categories.map((topic) => (
                                                        <Option
                                                            key={topic}
                                                            value={topic}
                                                        >
                                                            {topic}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="topic_position"
                                                label="Topic Position"
                                                rules={[
                                                    {
                                                        required: false,
                                                        message:
                                                            "Please select a topic position",
                                                    },
                                                ]}
                                            >
                                                <Select placeholder="Select a topic position" allowClear>
                                                    {[
                                                        0, 1, 2, 3, 4, 5, 6, 7,
                                                        8, 9, 10,
                                                    ].map((position) => (
                                                        <Option
                                                            key={position}
                                                            value={position}
                                                        >
                                                            {position}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item name="post_tag" label="Tags">
                                        <Select
                                            mode="tags"
                                            placeholder="Select or create tags"
                                        >
                                            {tags.map((tag) => (
                                                <Option key={tag} value={tag}>
                                                    {tag}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="reporter_id"
                                        label="Reporter"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select a reporter",
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Select a reporter">
                                            <Option value="John Doe">
                                                John Doe
                                            </Option>
                                            <Option value="Jane Smith">
                                                Jane Smith
                                            </Option>
                                            <Option value="Robert Johnson">
                                                Robert Johnson
                                            </Option>
                                            <Option value="Sarah Wilson">
                                                Sarah Wilson
                                            </Option>
                                            <Option value="Michael Brown">
                                                Michael Brown
                                            </Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="publish_date"
                                        label="Publish Date"
                                    >
                                        <DatePicker
                                            showTime
                                            style={{ width: "100%" }}
                                            placeholder="Select date and time"
                                        />
                                    </Form.Item>

                                    <Row gutter={8}>
                                        <Col span={6}>
                                            <Form.Item
                                                name="publish_status"
                                                label="Status"
                                                valuePropName="checked"
                                            >
                                                <Switch
                                                    checkedChildren="Published"
                                                    unCheckedChildren="Draft"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name="is_latest_news"
                                                label="Latest News"
                                                valuePropName="checked"
                                            >
                                                <Switch
                                                    checkedChildren="Yes"
                                                    unCheckedChildren="No"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name="is_breaking_news"
                                                label="Breaking"
                                                valuePropName="checked"
                                            >
                                                <Switch
                                                    checkedChildren="Yes"
                                                    unCheckedChildren="No"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name="is_top_breaking_news"
                                                label="Top Breaking"
                                                valuePropName="checked"
                                            >
                                                <Switch
                                                    checkedChildren="Yes"
                                                    unCheckedChildren="No"
                                                />
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
                                        <Upload
                                            name="featuredImage"
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

                                    <Form.Item
                                        name="gallery"
                                        label="Image Gallery"
                                        valuePropName="fileList"
                                        getValueFromEvent={normFile}
                                    >
                                        <Upload
                                            name="gallery"
                                            listType="picture-card"
                                            multiple
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

                                <TabPane
                                    tab={
                                        <span>
                                            <GlobalOutlined /> SEO
                                        </span>
                                    }
                                    key="3"
                                >
                                    <Form.Item
                                        name="seo_title"
                                        label="Meta Title"
                                    >
                                        <Input placeholder="Enter meta title" />
                                    </Form.Item>

                                    <Form.Item
                                        name="meta_description"
                                        label="Meta Description"
                                    >
                                        <TextArea
                                            rows={4}
                                            placeholder="Enter meta description"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="meta_keyword"
                                        label="Meta Keywords"
                                    >
                                        <Select
                                            mode="tags"
                                            placeholder="Enter keywords"
                                        >
                                            <Option value="news">news</Option>
                                            <Option value="article">
                                                article
                                            </Option>
                                            <Option value="breaking">
                                                breaking
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>

                    <Divider
                        style={{
                            borderColor: isDark
                                ? "rgba(255, 255, 255, 0.1)"
                                : "rgba(0, 0, 0, 0.06)",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Space>
                            <Button icon={<EyeOutlined />}>Preview</Button>
                            <Button icon={<ClockCircleOutlined />}>
                                Save as Draft
                            </Button>
                        </Space>
                        <Space>
                            <Button icon={<CloseOutlined />} onClick={onReset}>
                                Reset
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={loading}
                            >
                                Save
                            </Button>
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                style={{ background: "#10b981" }}
                            >
                                Publish
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </>
    );
}
