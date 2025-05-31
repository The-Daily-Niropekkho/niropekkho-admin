/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GlobalFilePicker } from "@/components/features/media/global-file-picker";
import { useTheme } from "@/components/theme-context";
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
} from "@/redux/features/categories/categoriesApi";
import { EpaperPage, TError, TFileDocument } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import { PictureOutlined } from "@ant-design/icons";
import { Col, DatePicker, Form, message, Modal, Row, Select, Typography } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const { Text } = Typography;

interface EpaperPageEditCreateModalInterface {
    editingPage: EpaperPage | null;
    open: boolean;
    close: () => void;
    pageImage: TFileDocument | undefined;
    setPageImage: Dispatch<SetStateAction<TFileDocument | undefined>>;
}

export default function EpaperPageEditCreateModal({
    editingPage,
    open,
    close,
    pageImage,
    setPageImage,
}: EpaperPageEditCreateModalInterface) {
    const [openFileUpload, setOpenFileUploader] = useState<boolean>(false);
    const [form] = Form.useForm();
    const { isDark } = useTheme();
    const [categories] = useState([
        "প্রথম পাতা",
        "খবর",
        "বাণিজ্য",
        "নগর-মহানগর",
        "গ্রাম বাংলা",
        "সম্পাদকীয়",
        "আন্তর্জাতিক",
        "ফিচার",
        "খেলাধুলা",
        "শেষ পাতা",
        "সাহিত্য",
    ]);

    useEffect(() => {
        form.setFieldsValue({
            edition: editingPage?.edition,
            category: editingPage?.category,
            page_number: editingPage?.page_number,
        });
    }, [editingPage, form]);

    const handleImageSelect = (files: TFileDocument[]) => {
        const selectedImage = files[0];
        setPageImage(selectedImage);
        form.setFieldsValue({ image: selectedImage });
        setOpenFileUploader(false);
    };

    const handleImageRemove = () => {
        setPageImage(undefined);
        form.setFieldsValue({ image: undefined });
    };

    const [createCategory, { isLoading: isCreating }] =
        useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] =
        useUpdateCategoryMutation();

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const pageData = {
                ...values,
                image: values.image || undefined,
            };

            if (editingPage) {
                const delta: Partial<EpaperPage> = {};
                if (values.edition !== editingPage.edition)
                    delta.edition = values.edition;
                if (values.category !== editingPage.category)
                    delta.category = values.category;
                if (values.page_number !== editingPage.page_number)
                    delta.page_number = values.page_number;

                if (Object.keys(delta).length > 0) {
                    await updateCategory({
                        id: editingPage.id,
                        data: delta,
                    }).unwrap();
                    message.success(`Page info has been updated`);
                } else {
                    message.info("No changes detected");
                }
            } else {
                console.log(pageData);
                
                // await createCategory(pageData).unwrap();
                message.success(`New epaper page has been created`);
                form.resetFields();
            }
            close();
            form.resetFields();
            setPageImage(undefined);
        } catch (error) {
            message.warning((error as TError)?.data?.message);
            console.error("Operation failed:", error);
        }
    };

    const uploadBoxStyle: React.CSSProperties = {
        width: "100%",
        height: "400px",
        border: `1px dashed ${isDark ? "#444" : "#d9d9d9"}`,
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
        background: isDark ? "#2A3441" : "#fafafa",
        color: isDark ? "#aaa" : "#999",
    };

    return (
        <Modal
            title={editingPage ? "Edit Epaper Page" : "Add New Epaper Page"}
            open={open}
            onOk={handleModalOk}
            onCancel={close}
            okButtonProps={{ loading: isCreating || isUpdating }}
            width={650}
        >
            <Form form={form} layout="vertical" style={{margin: "20px 0"}}>
                <Row gutter={[32, 32]}>
                    <Col span={12}>
                        <Form.Item
                            name="image"
                            label="Upload Page (13 inch X 21 inch, max 5MB)"
                            rules={[
                                {
                                    required: true,
                                    message: "Please upload page image",
                                },
                            ]}
                        >
                            <div
                                onClick={() => setOpenFileUploader(true)}
                                style={{
                                    ...uploadBoxStyle,
                                    position: "relative",
                                }}
                            >
                                {pageImage ? (
                                    <>
                                        <Image
                                            src={fileObjectToLink(pageImage)}
                                            alt="Banner"
                                            width={230}
                                            height={80}
                                            style={{
                                                objectFit: "cover",
                                                borderRadius: 8,
                                            }}
                                        />
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleImageRemove();
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                                background: "#fff",
                                                borderRadius: "50%",
                                                padding: "2px 6px",
                                                fontSize: 12,
                                                cursor: "pointer",
                                                boxShadow:
                                                    "0 0 3px rgba(0,0,0,0.3)",
                                            }}
                                        >
                                            ✕
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <PictureOutlined
                                            style={{
                                                fontSize: 24,
                                                color: isDark ? "#888" : "#999",
                                            }}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: isDark ? "#ccc" : "#666",
                                            }}
                                        >
                                            Upload Page Image
                                        </Text>
                                    </>
                                )}
                            </div>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="edition"
                                    label="Select Edition"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select edition",
                                        },
                                    ]}
                                >
                                    <Select placeholder="দৈনিক">
                                        <Select.Option value="দৈনিক">
                                            দৈনিক
                                        </Select.Option>
                                        <Select.Option value="সাপ্তাহিক">
                                            সাপ্তাহিক
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    name="category"
                                    label="Select Category"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select category",
                                        },
                                    ]}
                                >
                                    <Select placeholder="--Select Category--">
                                        {categories.map((cat) => (
                                            <Select.Option
                                                key={cat}
                                                value={cat}
                                            >
                                                {cat}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    name="page_number"
                                    label="Select Page Number"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select page number",
                                        },
                                    ]}
                                >
                                    <Select placeholder="--Select Page Number--">
                                        {Array.from(
                                            { length: 20 },
                                            (_, i) => i + 1
                                        ).map((num) => (
                                            <Select.Option
                                                key={num}
                                                value={num}
                                            >{`Page ${num
                                                .toString()
                                                .padStart(
                                                    2,
                                                    "0"
                                                )}`}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="publish_date"
                                    label="Select Date"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select publish date",
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        format="YYYY-MM-DD"
                                        placeholder="Select Publish Date"
                                        defaultValue={dayjs()}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>

            <GlobalFilePicker
                open={openFileUpload}
                onCancel={() => setOpenFileUploader(false)}
                fileTypes={["image/jpeg", "image/png"]}
                onSelect={handleImageSelect}
                multiple={false}
                initialSelected={pageImage ? [pageImage] : []}
            />
        </Modal>
    );
}
