/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTheme } from "@/components/theme-context";
import { useGetAllCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import { useGetAllTopicsQuery } from "@/redux/features/topic/topicApi";
import { useGetAllWriterUserQuery } from "@/redux/features/user/userApi";
import { useGetAllCountriesQuery } from "@/redux/features/zone/countryApi";
import { useGetAllDistrictsQuery } from "@/redux/features/zone/districtsApi";
import { useGetAllDivisionsQuery } from "@/redux/features/zone/divisionApi";
import { useGetAllUnionsQuery } from "@/redux/features/zone/unionApi";
import { useGetAllUpazillasQuery } from "@/redux/features/zone/upazillaApi";

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
    const [editorContent, setEditorContent] = useState(
        "<p>Scientists have developed a new solar panel that doubles efficiency...</p>"
    );
    const isDark = theme === "dark";

    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >(undefined);
    const [selectedCountry, setSelectedCountry] = useState<number | undefined>(
        undefined
    );
    const [selectedDivision, setSelectedDivision] = useState<
        number | undefined
    >(undefined);
    const [selectedDistrict, setSelectedDistrict] = useState<
        number | undefined
    >(undefined);
    const [selectedUpazilla, setSelectedUpazilla] = useState<
        number | undefined
    >(undefined);

    // Redux Queries
    const { data: categories, isLoading: isCategoryLoading } =
        useGetAllCategoriesQuery([
            {
                name: "limit",
                value: 999,
            },
        ]);
    const { data: topics, isLoading: isTopicLoading } = useGetAllTopicsQuery([
        {
            name: "limit",
            value: 999,
        },
    ]);
    const { data: countries, isLoading: isCountriesLoading } =
        useGetAllCountriesQuery(
            [
                {
                    name: "limit",
                    value: 999,
                },
                {
                    name: "sortBy",
                    value: "name",
                },
                {
                    name: "sortOrder",
                    value: "asc",
                },
            ],
            { skip: selectedCategory != "cmb21jjgj0005mhfc2lqjtaf0" }
        );
    const { data: divisions, isLoading: isDivisionsLoading } =
        useGetAllDivisionsQuery(
            [
                { name: "country_id", value: selectedCountry },
                {
                    name: "limit",
                    value: 100,
                },
                {
                    name: "sortBy",
                    value: "name",
                },
                {
                    name: "sortOrder",
                    value: "asc",
                },
            ],
            { skip: !selectedCountry }
        );
    const { data: districts, isLoading: isDistrictsLoading } =
        useGetAllDistrictsQuery(
            [
                { name: "division_id", value: selectedDivision },
                {
                    name: "limit",
                    value: 500,
                },
                {
                    name: "sortBy",
                    value: "name",
                },
                {
                    name: "sortOrder",
                    value: "asc",
                },
            ],
            { skip: !selectedDivision }
        );
    const { data: upazillas, isLoading: isUpazillaLoading } =
        useGetAllUpazillasQuery(
            [
                { name: "district_id", value: selectedDistrict },
                {
                    name: "limit",
                    value: 500,
                },
                {
                    name: "sortBy",
                    value: "name",
                },
                {
                    name: "sortOrder",
                    value: "asc",
                },
            ],
            { skip: !selectedDistrict }
        );
    const { data: unions, isLoading: isUnionLoading } = useGetAllUnionsQuery(
        [
            { name: "upazilla_id", value: selectedUpazilla },
            {
                name: "limit",
                value: 1000,
            },
            {
                name: "sortBy",
                value: "name",
            },
            {
                name: "sortOrder",
                value: "asc",
            },
        ],
        { skip: !selectedUpazilla }
    );
    const { data: writers, isLoading: isWriterLoading } =
        useGetAllWriterUserQuery(undefined);

    const onFinish = (values: any) => {
        setLoading(true);
        // Add the editor content to the form values
        values.details_html = editorContent;

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
        <div>
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
                >
                    <Row gutter={16}>
                        <Col xs={24} lg={16}>
                            <Form.Item
                                name="headline"
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

                            <Form.Item
                                name="short_headline"
                                label="Subheadline"
                            >
                                <Input placeholder="Enter subheadline" />
                            </Form.Item>

                            <Form.Item name="slug" label="Slug">
                                <Input placeholder="Enter slug (URL-friendly)" />
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
                                    onChange={(content: string) =>
                                        setEditorContent(content)
                                    }
                                />
                            </Form.Item>

                            <Form.Item name="details" label="Summary">
                                <TextArea
                                    rows={3}
                                    placeholder="Enter a short summary for the article"
                                />
                            </Form.Item>

                            <Form.Item name="excerpt" label="Excerpt">
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
                                        <Select
                                            placeholder="Select a category"
                                            disabled={isCategoryLoading}
                                            showSearch
                                            onChange={(value) =>
                                                setSelectedCategory(value)
                                            }
                                        >
                                            {categories?.data?.map(
                                                (category: any) => (
                                                    <Option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.title}
                                                    </Option>
                                                )
                                            )}
                                        </Select>
                                    </Form.Item>
                                    {selectedCategory ==
                                        "cmb21jjgj0005mhfc2lqjtaf0" && (
                                        <>
                                            <Form.Item
                                                name="country_id"
                                                label="Country"
                                            >
                                                <Select
                                                    placeholder="Select a country"
                                                    disabled={
                                                        isCountriesLoading
                                                    }
                                                    showSearch
                                                    onChange={(value) =>
                                                        setSelectedCountry(
                                                            value
                                                        )
                                                    }
                                                >
                                                    {countries?.data?.map(
                                                        (country: any) => (
                                                            <Option
                                                                key={country.id}
                                                                value={
                                                                    country.id
                                                                }
                                                            >
                                                                {
                                                                    country.bn_name
                                                                }
                                                            </Option>
                                                        )
                                                    )}
                                                </Select>
                                            </Form.Item>
                                            <div className="grid grid-cols-2 gap-x-5">
                                                <Form.Item
                                                    name="division_id"
                                                    label="Division"
                                                >
                                                    <Select
                                                        placeholder="Select a division"
                                                        disabled={
                                                            isDivisionsLoading ||
                                                            !selectedCountry
                                                        }
                                                        showSearch
                                                        onChange={(value) =>
                                                            setSelectedDivision(
                                                                value
                                                            )
                                                        }
                                                    >
                                                        {divisions?.data?.map(
                                                            (division: any) => (
                                                                <Option
                                                                    key={
                                                                        division.id
                                                                    }
                                                                    value={
                                                                        division.id
                                                                    }
                                                                >
                                                                    {
                                                                        division.bn_name
                                                                    }
                                                                </Option>
                                                            )
                                                        )}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    name="district_id"
                                                    label="District"
                                                >
                                                    <Select
                                                        placeholder="Select a district"
                                                        disabled={
                                                            isDistrictsLoading ||
                                                            !selectedDivision
                                                        }
                                                        showSearch
                                                        onChange={(value) =>
                                                            setSelectedDistrict(
                                                                value
                                                            )
                                                        }
                                                    >
                                                        {districts?.data?.map(
                                                            (district: any) => (
                                                                <Option
                                                                    key={
                                                                        district.id
                                                                    }
                                                                    value={
                                                                        district.id
                                                                    }
                                                                >
                                                                    {
                                                                        district.bn_name
                                                                    }
                                                                </Option>
                                                            )
                                                        )}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    name="upazilla_id"
                                                    label="Upazilla"
                                                >
                                                    <Select
                                                        placeholder="Select an upazilla"
                                                        disabled={
                                                            isUpazillaLoading ||
                                                            !selectedDistrict
                                                        }
                                                        showSearch
                                                        onChange={(value) =>
                                                            setSelectedUpazilla(
                                                                value
                                                            )
                                                        }
                                                    >
                                                        {upazillas?.data?.map(
                                                            (upazilla: any) => (
                                                                <Option
                                                                    key={
                                                                        upazilla.id
                                                                    }
                                                                    value={
                                                                        upazilla.id
                                                                    }
                                                                >
                                                                    {
                                                                        upazilla.bn_name
                                                                    }
                                                                </Option>
                                                            )
                                                        )}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    name="union_id"
                                                    label="Union"
                                                >
                                                    <Select
                                                        placeholder="Select a union"
                                                        disabled={
                                                            isUnionLoading ||
                                                            !selectedUpazilla
                                                        }
                                                        showSearch
                                                    >
                                                        {unions?.data?.map(
                                                            (union: any) => (
                                                                <Option
                                                                    key={
                                                                        union.id
                                                                    }
                                                                    value={
                                                                        union.id
                                                                    }
                                                                >
                                                                    {
                                                                        union.bn_name
                                                                    }
                                                                </Option>
                                                            )
                                                        )}
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                        </>
                                    )}
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="category_serial"
                                                label="Category Position"
                                            >
                                                <Select
                                                    placeholder="Select a category position"
                                                    allowClear
                                                >
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
                                        <Col span={12}>
                                            <Form.Item
                                                name="home_serial"
                                                label="Home Position"
                                            >
                                                <Select
                                                    placeholder="Select a home position"
                                                    allowClear
                                                >
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

                                    <Form.Item name="topic_id" label="Topic">
                                        <Select
                                            placeholder="Select a topic"
                                            allowClear
                                            mode="tags"
                                            disabled={isTopicLoading}
                                        >
                                            {topics?.data?.map((topic: any) => (
                                                <Option
                                                    key={topic.id}
                                                    value={topic.id}
                                                >
                                                    {topic.title}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

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
                                        <Select
                                            placeholder="Select a reporter"
                                            showSearch
                                            disabled={isWriterLoading}
                                        >
                                            {writers?.data?.map(
                                                (reporter: any) => (
                                                    <Option
                                                        key={reporter.id}
                                                        value={reporter.id}
                                                    >
                                                        {`${reporter.writer.first_name} ${reporter.writer.last_name}`}
                                                    </Option>
                                                )
                                            )}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="publish_date"
                                        label="Publish Date"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select a publish date",
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            showTime
                                            style={{ width: "100%" }}
                                            placeholder="Select date and time"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="media_type"
                                        label="Media Type"
                                    >
                                        <Select placeholder="Select media type">
                                            <Option value="online">
                                                Online
                                            </Option>
                                            <Option value="print">Print</Option>
                                            <Option value="both">Both</Option>
                                        </Select>
                                    </Form.Item>

                                    <Row gutter={8}>
                                        <Col span={8}>
                                            <Form.Item
                                                name="status"
                                                label="Status"
                                                valuePropName="checked"
                                            >
                                                <Switch
                                                    checkedChildren="Published"
                                                    unCheckedChildren="Draft"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="is_breaking"
                                                label="Breaking News"
                                                valuePropName="checked"
                                            >
                                                <Switch
                                                    checkedChildren="Yes"
                                                    unCheckedChildren="No"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="is_featured"
                                                label="Featured"
                                                valuePropName="checked"
                                            >
                                                <Switch
                                                    checkedChildren="Yes"
                                                    unCheckedChildren="No"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={8}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="is_scheduled"
                                                label="Scheduled"
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
                                        name="banner_image"
                                        label="Banner Image"
                                        valuePropName="fileList"
                                        getValueFromEvent={normFile}
                                    >
                                        <Upload
                                            name="banner_image"
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
                                        name="og_image"
                                        label="OG Image URL"
                                    >
                                        <Input placeholder="Enter OG image URL" />
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
                                        name="meta_title"
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

                                    <Form.Item name="og_title" label="OG Title">
                                        <Input placeholder="Enter OG title" />
                                    </Form.Item>

                                    <Form.Item
                                        name="og_description"
                                        label="OG Description"
                                    >
                                        <TextArea
                                            rows={4}
                                            placeholder="Enter OG description"
                                        />
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
        </div>
    );
}
