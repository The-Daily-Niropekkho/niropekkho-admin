"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnumIds } from "@/constants/enum-ids";
import { useGetAllGenericReportersQuery } from "@/redux/features/reporter/reporterApi";
import { useGetAllWriterUserQuery } from "@/redux/features/user/userApi";
import {
    Category,
    District,
    Division,
    TFileDocument,
    Topic,
    Union,
    Upazilla,
    User,
} from "@/types";
import { PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    FormInstance,
    Row,
    Select,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CategoryEditCreateModal from "../categories/category-edit-create-modal";
import ReporterCreateEditModal from "../reporters/reporter-create-edit-modal";
import TopicEditCreateModal from "../topic/create-edit-modal";

const { Option } = Select;

interface GeneralSectionProps {
    form: FormInstance<any>;
    selectedCategory: number | string | undefined;
    setSelectedCategory: Dispatch<SetStateAction<string | undefined>>;
    selectedDivision: number | string | undefined;
    setSelectedDivision: Dispatch<SetStateAction<number | undefined>>;
    selectedDistrict: number | string | undefined;
    setSelectedDistrict: Dispatch<SetStateAction<number | undefined>>;
    selectedUpazilla: number | string | undefined;
    setSelectedUpazilla: Dispatch<SetStateAction<number | undefined>>;
    categories: Category[] | undefined;
    isCategoryLoading: boolean;
    topics: Topic[] | undefined;
    isTopicLoading: boolean;
    divisions: Division[] | undefined;
    isDivisionsLoading: boolean;
    districts: District[] | undefined;
    isDistrictsLoading: boolean;
    upazillas: Upazilla[] | undefined;
    isUpazillaLoading: boolean;
    unions: Union[] | undefined;
    isUnionLoading: boolean;
}

export const GeneralSection = ({
    form,
    selectedCategory,
    setSelectedCategory,
    selectedDivision,
    setSelectedDivision,
    selectedDistrict,
    setSelectedDistrict,
    selectedUpazilla,
    setSelectedUpazilla,
    categories,
    isCategoryLoading,
    topics,
    isTopicLoading,
    divisions,
    isDivisionsLoading,
    districts,
    isDistrictsLoading,

    upazillas,
    isUpazillaLoading,
    unions,
    isUnionLoading,
}: GeneralSectionProps) => {
    const { data: writers, isLoading: isWriterLoading } =
        useGetAllWriterUserQuery([{ name: "status", value: "active" }]);
    const { data: genericReporter, isLoading: isGenericReporterLoading } =
        useGetAllGenericReportersQuery([{ name: "status", value: "active" }]);
    const [isTopicModalVisible, setIsTopicModalVisible] = useState(false);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [isReporterModalVisible, setIsReporterModalVisible] = useState(false);
    const [categoryImage, setCategoryImage] = useState<
        TFileDocument | undefined
    >(undefined);
    const [reporterImage, setReporterImage] = useState<
        TFileDocument | undefined
    >(undefined);

    // Watch form fields
    const genericReporterId = Form.useWatch("generic_reporter_id", form);
    const reporterId = Form.useWatch("reporter_id", form);

    // Reset and disable fields based on selection
    useEffect(() => {
        if (genericReporterId) {
            form.setFieldsValue({ reporter_id: undefined });
        } else if (reporterId) {
            form.setFieldsValue({ generic_reporter_id: undefined });
        }
    }, [genericReporterId, reporterId, form]);

    // Custom validator to ensure at least one reporter is selected
    const validateReporter = (
        _: any,
        value: any,
        callback: (error?: string) => void
    ) => {
        const otherField =
            _.field === "generic_reporter_id"
                ? "reporter_id"
                : "generic_reporter_id";
        const otherValue = form.getFieldValue(otherField);
        if (!value && !otherValue) {
            callback("Please select either a Generic Reporter or a Reporter");
        } else {
            callback();
        }
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
        <>
            <Form.Item
                name="category_id"
                label="Category"
                rules={[
                    { required: true, message: "Please select a category" },
                ]}
            >
                <Select
                    placeholder="Select a category"
                    disabled={isCategoryLoading}
                    showSearch
                    onChange={(value) => setSelectedCategory(value)}
                    popupRender={(menu) => (
                        <>
                            <div style={{ padding: "4px" }}>
                                <Button
                                    type="default"
                                    icon={<PlusOutlined />}
                                    onClick={() =>
                                        setIsCategoryModalVisible(true)
                                    }
                                    style={{ width: "100%", textAlign: "left" }}
                                >
                                    Add Category
                                </Button>
                            </div>
                            <Divider style={{ margin: "2px 0" }} />
                            {menu}
                        </>
                    )}
                >
                    {categories?.map((category: Category) => (
                        <Option key={category.id} value={category.id}>
                            {category.title}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            {selectedCategory == EnumIds.across_the_country && (
                <div className="grid grid-cols-2 gap-x-5">
                    <Form.Item name="division_id" label="Division">
                        <Select
                            placeholder="Select a division"
                            disabled={isDivisionsLoading || !selectedCategory}
                            showSearch
                            onChange={(value) => setSelectedDivision(value)}
                        >
                            {divisions?.map((division: Division) => (
                                <Option key={division.id} value={division.id}>
                                    {division.bn_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="district_id" label="District">
                        <Select
                            placeholder="Select a district"
                            disabled={isDistrictsLoading || !selectedDivision}
                            showSearch
                            onChange={(value) => setSelectedDistrict(value)}
                        >
                            {districts?.map((district: District) => (
                                <Option key={district.id} value={district.id}>
                                    {district.bn_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="upazilla_id" label="Upazilla">
                        <Select
                            placeholder="Select an upazilla"
                            disabled={isUpazillaLoading || !selectedDistrict}
                            showSearch
                            onChange={(value) => setSelectedUpazilla(value)}
                        >
                            {upazillas?.map((upazilla: Upazilla) => (
                                <Option key={upazilla.id} value={upazilla.id}>
                                    {upazilla.bn_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="union_id" label="Union">
                        <Select
                            placeholder="Select a union"
                            disabled={isUnionLoading || !selectedUpazilla}
                            showSearch
                        >
                            {unions?.map((union: Union) => (
                                <Option key={union.id} value={union.id}>
                                    {union.bn_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
            )}
            <Row gutter={8}>
                <Col span={12}>
                    <Form.Item name="category_serial" label="Category Position">
                        <Select
                            placeholder="Select a category position"
                            allowClear
                        >
                            {Array.from({ length: 20 }, (_, i) => i+1).map(
                                (position) => (
                                    <Option key={position} value={position}>
                                        {position}
                                    </Option>
                                )
                            )}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="home_serial" label="Home Position">
                        <Select placeholder="Select a home position" allowClear>
                            {Array.from({ length: 20 }, (_, i) => i+1).map(
                                (position) => (
                                    <Option key={position} value={position}>
                                        {position}
                                    </Option>
                                )
                            )}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="topics" label="Topic">
                <Select
                    placeholder="Select a topic"
                    allowClear
                    mode="multiple"
                    disabled={isTopicLoading}
                    popupRender={(menu) => (
                        <>
                            <div style={{ padding: "4px" }}>
                                <Button
                                    type="default"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsTopicModalVisible(true)}
                                    style={{ width: "100%", textAlign: "left" }}
                                >
                                    Add Topic
                                </Button>
                            </div>
                            <Divider style={{ margin: "2px 0" }} />
                            {menu}
                        </>
                    )}
                >
                    {topics?.map((topic: Topic) => (
                        <Option key={topic.id} value={topic.id}>
                            {topic.title}
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

            <Row gutter={8}>
                <Col span={12}>
                    <Form.Item
                        name="generic_reporter_id"
                        label="Generic Reporter"
                        rules={[{ validator: validateReporter }]}
                    >
                        <Select
                            placeholder="Select a reporter"
                            showSearch
                            disabled={isGenericReporterLoading || !!reporterId}
                            popupRender={(menu) => (
                                <>
                                    <div style={{ padding: "4px" }}>
                                        <Button
                                            type="default"
                                            icon={<PlusOutlined />}
                                            onClick={() =>
                                                setIsReporterModalVisible(true)
                                            }
                                            style={{
                                                width: "100%",
                                                textAlign: "left",
                                            }}
                                        >
                                            Add Reporter
                                        </Button>
                                    </div>
                                    <Divider style={{ margin: "2px 0" }} />
                                    {menu}
                                </>
                            )}
                            allowClear
                        >
                            {genericReporter?.data?.map((reporter: any) => (
                                <Option key={reporter.id} value={reporter.id}>
                                    {reporter?.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="reporter_id"
                        label="Reporter"
                        rules={[{ validator: validateReporter }]}
                    >
                        <Select
                            placeholder="Select a reporter"
                            showSearch
                            disabled={isWriterLoading || !!genericReporterId}
                            allowClear
                        >
                            {writers?.data?.map((reporter: User) => (
                                <Option key={reporter.id} value={reporter.id}>
                                    {`${reporter?.writer?.first_name} ${reporter?.writer?.last_name}`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                name="publish_date"
                label="Publish Date"
                rules={[
                    { required: true, message: "Please select a publish date" },
                ]}
            >
                <DatePicker
                    showTime
                    style={{ width: "100%" }}
                    placeholder="Select date and time"
                    format="YYYY-MM-DD HH:mm:ss"
                />
            </Form.Item>

            <Form.Item
                name="media_type"
                label="Media Type"
                rules={[
                    { required: true, message: "Please select a media type" },
                ]}
            >
                <Select placeholder="Select media type">
                    <Option value="online">Online</Option>
                    <Option value="print">Print</Option>
                    <Option value="both">Both</Option>
                </Select>
            </Form.Item>
            <TopicEditCreateModal
                editingTopic={null}
                open={isTopicModalVisible}
                close={() => setIsTopicModalVisible(false)}
            />
            <CategoryEditCreateModal
                open={isCategoryModalVisible}
                close={() => setIsCategoryModalVisible(false)}
                editingCategory={null}
                categoryImage={categoryImage}
                setCategoryImage={setCategoryImage}
            />
            <ReporterCreateEditModal
                editingReporter={null}
                open={isReporterModalVisible}
                close={() => setIsReporterModalVisible(false)}
                reporterImage={reporterImage}
                setReporterImage={setReporterImage}
            />
        </>
    );
};
