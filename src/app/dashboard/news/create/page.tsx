/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { GeneralSection } from "@/components/features/news/general-section";
import { MediaSection } from "@/components/features/news/media-section";
import { SEOSection } from "@/components/features/news/seo-section";
import { useTheme } from "@/components/theme-context";
import { EnumIds } from "@/constants/enum-ids";
import { useGetAllCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import { useCreateNewsMutation } from "@/redux/features/news/newsApi";
import { useGetAllTopicsQuery } from "@/redux/features/topic/topicApi";
import { useGetAllDistrictsQuery } from "@/redux/features/zone/districtsApi";
import { useGetAllDivisionsQuery } from "@/redux/features/zone/divisionApi";
import { useGetAllUnionsQuery } from "@/redux/features/zone/unionApi";
import { useGetAllUpazillasQuery } from "@/redux/features/zone/upazillaApi";
import { ErrorResponse, TFileDocument } from "@/types";

import {
    DeleteOutlined,
    FileTextOutlined,
    GlobalOutlined,
    PictureOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    message,
    Popconfirm,
    Row,
    Switch,
    Tabs,
    TabsProps,
    Tooltip,
} from "antd";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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

const { TextArea } = Input;

export default function CreateNewsPage() {
    const [form] = Form.useForm();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [loading, setLoading] = useState(false);
    const [bannerImage, setBannerImage] = useState<TFileDocument>();
    const [ogImage, setOgImage] = useState<TFileDocument>();
    const [editorContent, setEditorContent] = useState("<p></p>");

    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >(undefined);
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
        useGetAllCategoriesQuery({ limit: 999, status: "active" });

    const { data: topics, isLoading: isTopicLoading } = useGetAllTopicsQuery(
        {
            limit: 999,
            status: "active",
            category_id: selectedCategory,
        },
        { skip: !selectedCategory }
    );

    const { data: divisions, isLoading: isDivisionsLoading } =
        useGetAllDivisionsQuery(
            selectedCategory === EnumIds.across_the_country
                ? {
                      country_id: 172,
                      limit: 100,
                      sortBy: "name",
                      sortOrder: "asc",
                      status: "active",
                  }
                : {},
            { skip: selectedCategory !== EnumIds.across_the_country }
        );

    const { data: districts, isLoading: isDistrictsLoading } =
        useGetAllDistrictsQuery(
            selectedDivision
                ? {
                      division_id: selectedDivision,
                      limit: 500,
                      sortBy: "name",
                      sortOrder: "asc",
                      status: "active",
                  }
                : {},
            { skip: !selectedDivision }
        );

    const { data: upazillas, isLoading: isUpazillaLoading } =
        useGetAllUpazillasQuery(
            selectedDistrict
                ? {
                      district_id: selectedDistrict,
                      limit: 500,
                      sortBy: "name",
                      sortOrder: "asc",
                      status: "active",
                  }
                : {},
            { skip: !selectedDistrict }
        );

    const { data: unions, isLoading: isUnionLoading } = useGetAllUnionsQuery(
        selectedUpazilla
            ? {
                  upazilla_id: selectedUpazilla,
                  limit: 1000,
                  sortBy: "name",
                  sortOrder: "asc",
                  status: "active",
              }
            : {},
        { skip: !selectedUpazilla }
    );

    const [createNews, { isError, isSuccess, error, reset: resetMutation }] =
        useCreateNewsMutation();

    // Watch form fields
    const isBreaking = Form.useWatch("is_breaking", form);
    const isTopBreakingNews = Form.useWatch("is_top_breaking_news", form);

    // Reset dependent fields when is_breaking or is_top_breaking_news changes
    useEffect(() => {
        if (!isBreaking) {
            form.setFieldsValue({
                is_top_breaking_news: false,
                serial_number: undefined,
                top_serial_number: undefined,
            });
        } else if (!isTopBreakingNews) {
            form.setFieldsValue({
                top_serial_number: undefined,
            });
        }
    }, [isBreaking, isTopBreakingNews, form]);

    // Handle mutation status
    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse;
            message.error(
                errorResponse?.data?.message || "Failed to create news"
            );
            setLoading(false);
        } else if (isSuccess) {
            message.success("News created successfully!");
            form.resetFields();
            setEditorContent("");
            setOgImage(undefined);
            setBannerImage(undefined);
            setSelectedCategory(undefined);
            setSelectedDivision(undefined);
            setSelectedDistrict(undefined);
            setSelectedUpazilla(undefined);
            resetMutation();
            setLoading(false);
        }
    }, [isError, isSuccess, error, resetMutation, form]);

    const onFinish = async (values: any) => {
        setLoading(true);
        if (!editorContent) {
            message.error("অনুগ্রহ করে নিউজ কন্টেন্ট লিখুন।");
            setLoading(false);
            return;
        }
        if (!bannerImage) {
            message.error("অনুগ্রহ করে ব্যানার ইমেজ যোগ করুন।");
            setLoading(false);
            return;
        }
        values.details_html = editorContent;
        const {
            caption_title,
            thumb_image_width,
            thumb_image_height,
            banner_image_width,
            banner_image_height,
            ...rest
        } = values;
        const payload = {
            ...rest,
            banner_image: {
                ...bannerImage,
                caption_title: caption_title,
                thumb_image_size: {
                    width: thumb_image_width,
                    height: thumb_image_height,
                },
                large_image_size: {
                    width: banner_image_width,
                    height: banner_image_height,
                },
            },
        };
        await createNews(payload);
    };

    const onReset = () => {
        form.resetFields();
        setEditorContent("");
        setOgImage(undefined);
        setBannerImage(undefined);
        setSelectedCategory(undefined);
        setSelectedDivision(undefined);
        setSelectedDistrict(undefined);
        setSelectedUpazilla(undefined);
        resetMutation();
        message.info("Form has been reset");
    };

    const tabItems: TabsProps["items"] = [
        {
            key: "1",
            label: (
                <span>
                    <FileTextOutlined /> General
                </span>
            ),
            children: (
                <GeneralSection
                    form={form}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedDivision={selectedDivision}
                    setSelectedDivision={setSelectedDivision}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={setSelectedDistrict}
                    selectedUpazilla={selectedUpazilla}
                    setSelectedUpazilla={setSelectedUpazilla}
                    categories={categories?.data}
                    isCategoryLoading={isCategoryLoading}
                    topics={topics?.data}
                    isTopicLoading={isTopicLoading}
                    divisions={divisions?.data}
                    isDivisionsLoading={isDivisionsLoading}
                    districts={districts?.data}
                    isDistrictsLoading={isDistrictsLoading}
                    upazillas={upazillas?.data}
                    isUpazillaLoading={isUpazillaLoading}
                    unions={unions?.data}
                    isUnionLoading={isUnionLoading}
                />
            ),
        },
        {
            key: "2",
            label: (
                <span>
                    <PictureOutlined /> Media
                </span>
            ),
            children: (
                <MediaSection
                    form={form}
                    ogImage={ogImage}
                    bannerImage={bannerImage}
                    setBannerImage={setBannerImage}
                    setOgImage={setOgImage}
                />
            ),
        },
        {
            key: "3",
            label: (
                <span>
                    <GlobalOutlined /> SEO
                </span>
            ),
            children: <SEOSection />,
        },
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
                    Create News
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
                    <Row gutter={24}>
                        <Col xs={24} lg={17}>
                            <Form.Item
                                name="headline"
                                label="Headline"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the headline",
                                    },
                                ]}
                                tooltip="নিউজের শিরোনাম লিখুন। এটি সংক্ষিপ্ত এবং আকর্ষণীয় হওয়া উচিত।"
                            >
                                <Input
                                    placeholder="Enter headline"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="short_headline"
                                label="Short headline"
                                tooltip="নিউজের সংক্ষিপ্ত শিরোনাম লিখুন। এটি মূল শিরোনামের সংক্ষিপ্ত রূপ হবে।"
                            >
                                <Input placeholder="Enter Short headline" />
                            </Form.Item>

                            <Form.Item
                                name="slug"
                                label="Custom URL"
                                tooltip="নিউজের জন্য একটি কাস্টম URL লিখুন। এটি URL-ফ্রেন্ডলি হতে হবে।"
                            >
                                <Input placeholder="Enter custom url (URL-friendly)" />
                            </Form.Item>

                            <Form.Item
                                label="Content"
                                name="details_html"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please enter the article content",
                                    },
                                ]}
                                tooltip="নিউজের বিস্তারিত কন্টেন্ট লিখুন।"
                            >
                                <CKEditor
                                    onChange={(content: string) =>
                                        setEditorContent(content)
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                name="details"
                                label="Short Details"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please enter short details for the article",
                                    },
                                ]}
                                tooltip="নিউজের জন্য সংক্ষিপ্ত বিবরণ লিখুন অথবা কন্টেন্ট থেকে কপি করুন।"
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Enter a short details for the article"
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

                        <Col xs={24} lg={7}>
                            <Tabs defaultActiveKey="1" items={tabItems}></Tabs>
                            <Row
                                gutter={[16, 16]}
                                justify={"space-between"}
                                style={{ marginTop: 16 }}
                            >
                                <Col span={8}>
                                    <Form.Item
                                        name="status"
                                        label="Status"
                                        valuePropName="checked"
                                        getValueProps={(value) => ({
                                            checked: value === "published",
                                        })}
                                        getValueFromEvent={(checked) =>
                                            checked ? "published" : "draft"
                                        }
                                        initialValue={"published"}
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
                                        name="is_top_breaking_news"
                                        label="Top Breaking News"
                                        valuePropName="checked"
                                    >
                                        <Switch
                                            checkedChildren="Yes"
                                            unCheckedChildren="No"
                                            disabled={!isBreaking}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
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
                            justifyContent: "end",
                            gap: 20,
                        }}
                    >
                        <Tooltip title="রিসেট করলে ফর্মের সব তথ্য মুছে যাবে">
                            <Popconfirm
                                title="Are you sure you want to delete this news?"
                                onConfirm={onReset}
                                okText="Yes"
                                cancelText="No"
                                placement="left"
                            >
                                <Button
                                    type="dashed"
                                    danger
                                    icon={<DeleteOutlined />}
                                >
                                    Reset
                                </Button>
                            </Popconfirm>
                        </Tooltip>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                        >
                            Publish
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
