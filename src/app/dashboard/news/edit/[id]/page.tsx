/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { GeneralSection } from "@/components/features/news/general-section";
import { MediaSection } from "@/components/features/news/media-section";
import { SEOSection } from "@/components/features/news/seo-section";
import { useTheme } from "@/components/theme-context";
import { EnumIds } from "@/constants/enum-ids";
import { useGetAllCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import {
    useGetNewsDetailsQuery,
    useUpdateNewsMutation,
} from "@/redux/features/news/newsApi";
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
    Spin,
    Switch,
    Tabs,
    TabsProps,
    Tooltip,
} from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Dynamically import the CKEditor component
const CKEditor = dynamic(() => import("@/components/ck-editor"), {
    ssr: false,
    loading: () => (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                background: "#f5f5f5",
            }}
        >
            <Spin size="large" />
        </div>
    ),
});

const { TextArea } = Input;

export default function EditNewsPage() {
    const [form] = Form.useForm();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { id } = useParams();
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [bannerImage, setBannerImage] = useState<TFileDocument>();
    const [ogImage, setOgImage] = useState<TFileDocument>();
    const [editorContent, setEditorContent] = useState<any>();
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
    const [changedValues, setChangedValues] = useState<any>({});

    const { data: news, isLoading: isNewsLoading } = useGetNewsDetailsQuery(
        id,
        {
            skip: !id,
            refetchOnMountOrArgChange: true,
        }
    );

    const { data: categories, isLoading: isCategoryLoading } =
        useGetAllCategoriesQuery([
            { name: "limit", value: 999 },
            { name: "status", value: "active" },
        ]);
    const { data: topics, isLoading: isTopicLoading } = useGetAllTopicsQuery([
        { name: "limit", value: 999 },
        { name: "status", value: "active" },
    ]);
    const { data: divisions, isLoading: isDivisionsLoading } =
        useGetAllDivisionsQuery(
            [
                { name: "country_id", value: 172 },
                { name: "limit", value: 100 },
                { name: "sortBy", value: "name" },
                { name: "sortOrder", value: "asc" },
                { name: "status", value: "active" },
            ],
            { skip: selectedCategory !== EnumIds.across_the_country }
        );
    const { data: districts, isLoading: isDistrictsLoading } =
        useGetAllDistrictsQuery(
            [
                { name: "division_id", value: selectedDivision },
                { name: "limit", value: 500 },
                { name: "sortBy", value: "name" },
                { name: "sortOrder", value: "asc" },
                { name: "status", value: "active" },
            ],
            { skip: !selectedDivision }
        );
    const { data: upazillas, isLoading: isUpazillaLoading } =
        useGetAllUpazillasQuery(
            [
                { name: "district_id", value: selectedDistrict },
                { name: "limit", value: 500 },
                { name: "sortBy", value: "name" },
                { name: "sortOrder", value: "asc" },
                { name: "status", value: "active" },
            ],
            { skip: !selectedDistrict }
        );
    const { data: unions, isLoading: isUnionLoading } = useGetAllUnionsQuery(
        [
            { name: "upazilla_id", value: selectedUpazilla },
            { name: "limit", value: 1000 },
            { name: "sortBy", value: "name" },
            { name: "sortOrder", value: "asc" },
            { name: "status", value: "active" },
        ],
        { skip: !selectedUpazilla }
    );

    const [updateNews, { isError, isSuccess, error, reset: resetMutation }] =
        useUpdateNewsMutation();

    const isBreaking = Form.useWatch("is_breaking", form);
    const isTopBreakingNews = Form.useWatch("is_top_breaking_news", form);

    useEffect(() => {
        if (news) {
            const initialValues = {
                ...form.getFieldsValue(),
                headline: news?.headline,
                short_headline: news?.short_headline,
                slug: news?.slug,
                details: news?.details,
                excerpt: news?.excerpt,
                reference: news?.reference,
                status: news?.status,
                is_breaking: Boolean(news?.breaking_news?.id),
                is_top_breaking_news: Boolean(news?.breaking_news?.is_top_breaking_news),
                category_id: news?.category_id,
                division_id: news?.division_id,
                district_id: news?.district_id,
                upazilla_id: news?.upazilla_id,
                union_id: news?.union_id,
                category_serial: news?.category_serial,
                home_serial: news?.home_serial,
                topics: news?.topics?.map((topic: any) => topic.id),
                tags: news?.tags,
                generic_reporter_id: news?.generic_reporter_id,
                reporter_id: news?.reporter_id,
                publish_date: news?.publish_date
                    ? dayjs(news?.publish_date)
                    : undefined,
                media_type: news?.media_type,
                meta_title: news?.meta_title,
                meta_description: news?.meta_description,
                og_title: news?.og_title,
                og_description: news?.og_description,
                caption_title: news?.banner_image?.caption_title,
                thumb_image_width: news?.banner_image?.thumb_image_size?.width,
                thumb_image_height:
                    news?.banner_image?.thumb_image_size?.height,
                banner_image_width: news?.banner_image?.large_image_size?.width,
                banner_image_height:
                    news?.banner_image?.large_image_size?.height,
            };

            form.setFieldsValue(initialValues);
            setEditorContent(news?.details_html || "");
            setBannerImage(news?.banner_image);
            setOgImage(news?.og_image);
            setSelectedCategory(news?.category_id);
            setSelectedDivision(news?.division_id);
            setSelectedDistrict(news?.district_id);
            setSelectedUpazilla(news?.upazilla_id);
        }
    }, [news, form]);

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

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse;
            message.error(
                errorResponse?.data?.message || "Failed to update news"
            );
            setLoading(false);
        } else if (isSuccess) {
            message.success("News updated successfully!");
            setLoading(false);
            resetMutation();
            router.push('/dashboard/news/all')
        }
    }, [isError, isSuccess, error, resetMutation, router]);

    const onFinish = async () => {
        setLoading(true);
        const {
            caption_title,
            banner_image_height,
            banner_image_width,
            thumb_image_height,
            thumb_image_width,
            ...rest
        } = changedValues;
        const payload: any = {
            ...rest,
        };

        // Always include the HTML content if it has changed
        if (editorContent !== news?.details_html) {
            payload.details_html = editorContent;
        }

        // Always include banner/OG image if changed
        if (
            changedValues.caption_title ||
            changedValues.banner_image_width ||
            changedValues.banner_image_height || (bannerImage !== news?.banner_image)
        ) {
            payload.banner_image = {
                ...bannerImage,
                caption_title:
                    caption_title ?? bannerImage?.caption_title,
                thumb_image_size: {
                    width:
                        (thumb_image_width ??
                            bannerImage?.thumb_image_size?.width) ||
                        800,
                    height:
                        (thumb_image_height ??
                            bannerImage?.thumb_image_size?.height) ||
                        450,
                },
                large_image_size: {
                    width:
                        (banner_image_width ??
                            bannerImage?.large_image_size?.width) ||
                        1200,
                    height:
                        (banner_image_height ??
                            bannerImage?.large_image_size?.height) ||
                        600,
                },
            };
        }

        if (ogImage !== news?.og_image) {
            payload.og_image = {
                ...ogImage,
            };
            
        }
        if (Object.keys(payload).length === 0) {
            message.info("No changes detected");
            setLoading(false);
            return;
        }
        await updateNews({ id: id, data: payload }).unwrap();
    };

    const onReset = () => {
        if (news) {
            form.setFieldsValue({
                headline: news.headline,
                short_headline: news.short_headline,
                slug: news.slug,
                details: news.details,
                excerpt: news.excerpt,
                reference: news.reference,
                status: news.status,
                is_breaking: news.is_breaking,
                is_top_breaking_news: news.is_top_breaking_news,
                category_id: news.category_id,
                division_id: news.division_id,
                district_id: news.district_id,
                upazilla_id: news.upazilla_id,
                union_id: news.union_id,
                category_serial: news.category_serial,
                home_serial: news.home_serial,
                topics: news.allTopics?.map((topic: any) => topic.id),
                tags: news.tags,
                generic_reporter_id: news.generic_reporter_id,
                reporter_id: news.reporter_id,
                publish_date: news.publish_date
                    ? dayjs(news.publish_date)
                    : undefined,
                media_type: news.media_type,
                meta_title: news.meta_title,
                meta_description: news.meta_description,
                og_title: news.og_title,
                og_description: news.og_description,
                banner_image: news.banner_image,
                og_image: news.og_image,
                caption_title: news.banner_image?.caption_title,
                thumb_image_width: news.banner_image?.thumb_image_size?.width,
                thumb_image_height: news.banner_image?.thumb_image_size?.height,
                banner_image_width: news.banner_image?.large_image_size?.width,
                banner_image_height:
                    news.banner_image?.large_image_size?.height,
            });
            setEditorContent(news.details_html || "");
            setBannerImage(news.banner_image);
            setOgImage(news.og_image);
            setSelectedCategory(news.category_id);
            setSelectedDivision(news.division_id);
            setSelectedDistrict(news.district_id);
            setSelectedUpazilla(news.upazilla_id);
            message.info("Form has been reset to original values");
        }
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

    if (isNewsLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

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
                    Edit News
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Update an existing news article with rich content and media.
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
                    onValuesChange={(changed) => {
                        setChangedValues((prev: any) => ({
                            ...prev,
                            ...changed,
                        }));
                    }}
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
                                    value={editorContent}
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
                        <Tooltip title="রিসেট করলে ফর্মটি মূল নিউজের তথ্যে ফিরে যাবে">
                            <Popconfirm
                                title="Are you sure you want to reset to original values?"
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
                            Update
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
