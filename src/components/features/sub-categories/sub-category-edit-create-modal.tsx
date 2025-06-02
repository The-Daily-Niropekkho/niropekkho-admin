/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import {
    useCreateSubcategoryMutation,
    useUpdateSubcategoryMutation,
} from "@/redux/features/categories/subcategoriesApi";
import { Category, Subcategory, TError, TFileDocument } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Col,
    Form,
    Input,
    message,
    Modal,
    Row,
    Select,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GlobalFilePicker } from "../media/global-file-picker";

interface SubcategoryEditCreateModalProps {
    editingSubcategory: Subcategory | null;
    open: boolean;
    close: () => void;
    subcategoryImage: TFileDocument | undefined;
    setSubcategoryImage: Dispatch<SetStateAction<TFileDocument | undefined>>;
}

export default function SubcategoryEditCreateModal({
    editingSubcategory,
    open,
    close,
    subcategoryImage,
    setSubcategoryImage,
}: SubcategoryEditCreateModalProps) {
    const [form] = Form.useForm();
    const [openFileUpload, setOpenFileUploader] = useState(false);

    const {
        data: categories,
        isLoading: isCategoryLoading,
        isFetching: isCategoryFetching,
    } = useGetAllCategoriesQuery({ limit: 9999 });

    useEffect(() => {
        form.setFieldsValue({
            title: editingSubcategory?.title,
            slug: editingSubcategory?.slug,
            description: editingSubcategory?.description,
            meta_title: editingSubcategory?.meta_title,
            meta_description: editingSubcategory?.meta_description,
            status: editingSubcategory?.status,
            position: editingSubcategory?.position,
            image: editingSubcategory?.image,
            category_id: editingSubcategory?.category_id,
        });
    }, [editingSubcategory, form]);

    const handleImageSelect = (files: TFileDocument[]) => {
        const selectedImage = files[0];
        setSubcategoryImage(selectedImage);
        form.setFieldsValue({ image: selectedImage.id });
        setOpenFileUploader(false);
    };

    const [createSubcategory, { isLoading: isCreating }] =
        useCreateSubcategoryMutation();
    const [updateSubcategory, { isLoading: isUpdating }] =
        useUpdateSubcategoryMutation();

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const subcategoryData = {
                ...values,
                image: values.image || undefined,
            };

            if (editingSubcategory) {
                const delta: Partial<Subcategory> = {};
                if (values.title !== editingSubcategory.title)
                    delta.title = values.title;
                if (values.slug !== editingSubcategory.slug)
                    delta.slug = values.slug;
                if (values.description !== editingSubcategory.description)
                    delta.description = values.description;
                if (values.meta_title !== editingSubcategory.meta_title)
                    delta.meta_title = values.meta_title;
                if (
                    values.meta_description !==
                    editingSubcategory.meta_description
                )
                    delta.meta_description = values.meta_description;
                if (values.status !== editingSubcategory.status)
                    delta.status = values.status;
                if (values.position !== editingSubcategory.position)
                    delta.position = values.position;
                if (values.image !== editingSubcategory.image)
                    delta.image = values.image;
                if (values.category_id !== editingSubcategory.category_id)
                    delta.category_id = values.category_id;

                if (Object.keys(delta).length > 0) {
                    await updateSubcategory({
                        id: editingSubcategory.id,
                        data: delta,
                    }).unwrap();
                    message.success(
                        `Subcategory "${values.title}" has been updated`
                    );
                } else {
                    message.info("No changes detected");
                }
            } else {
                await createSubcategory(subcategoryData).unwrap();
                message.success(
                    `Subcategory "${values.title}" has been created`
                );
                form.resetFields();
            }
            close();
            form.resetFields();
            setSubcategoryImage(undefined);
        } catch (error) {
            message.warning((error as TError)?.data?.message);
            console.error("Operation failed:", error);
        }
    };

    return (
        <Modal
            title={
                editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"
            }
            open={open}
            onOk={handleModalOk}
            onCancel={close}
            okButtonProps={{ loading: isCreating || isUpdating }}
            width={600}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="title"
                            label="Subcategory Title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter subcategory title",
                                },
                            ]}
                        >
                            <Input placeholder="Enter subcategory title" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="slug"
                            label="Slug"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter slug",
                                },
                            ]}
                        >
                            <Input placeholder="Enter slug" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="category_id"
                    label="Parent Category"
                    rules={[
                        { required: true, message: "Please select a category" },
                    ]}
                >
                    <Select
                        placeholder="Select a category"
                        loading={isCategoryLoading || isCategoryFetching}
                        showSearch
                        optionFilterProp="children"
                    >
                        {(categories?.data || []).map((cat: Category) => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={4} placeholder="Enter description" />
                </Form.Item>
                <Form.Item name="meta_title" label="Meta Title">
                    <Input placeholder="Enter meta title" />
                </Form.Item>
                <Form.Item name="meta_description" label="Meta Description">
                    <Input.TextArea
                        rows={4}
                        placeholder="Enter meta description"
                    />
                </Form.Item>

                <Row style={{ gap: 10 }}>
                    <Avatar
                        shape="square"
                        size={64}
                        src={fileObjectToLink(subcategoryImage || null)}
                        icon={<UserOutlined />}
                    />
                    <Form.Item name="image" label="Subcategory Image">
                        <Button
                            icon={<UploadOutlined />}
                            onClick={() => setOpenFileUploader(true)}
                        >
                            Upload Image
                        </Button>
                        {subcategoryImage && (
                            <Button
                                danger
                                onClick={() => {
                                    setSubcategoryImage(undefined);
                                    form.setFieldsValue({
                                        image: undefined,
                                    });
                                }}
                            >
                                Remove Image
                            </Button>
                        )}
                    </Form.Item>
                </Row>
            </Form>

            <GlobalFilePicker
                open={openFileUpload}
                onCancel={() => setOpenFileUploader(false)}
                fileTypes={["image/jpeg", "image/png"]}
                onSelect={handleImageSelect}
                multiple={false}
                initialSelected={subcategoryImage ? [subcategoryImage] : []}
            />
        </Modal>
    );
}
