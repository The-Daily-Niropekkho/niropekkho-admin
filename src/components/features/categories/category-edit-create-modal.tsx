/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
} from "@/redux/features/categories/categoriesApi";
import { Category, TError, TFileDocument } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Form, Input, message, Modal, Row } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GlobalFilePicker } from "../media/global-file-picker";

interface CategoryEditCreateModalInterface {
    editingCategory: Category | null;
    open: boolean;
    close: () => void;
    categoryImage: TFileDocument | undefined;
    setCategoryImage: Dispatch<SetStateAction<TFileDocument | undefined>>;
}

export default function CategoryEditCreateModal({
    editingCategory,
    open,
    close,
    categoryImage,
    setCategoryImage,
}: CategoryEditCreateModalInterface) {
    const [openFileUpload, setOpenFileUploader] = useState<boolean>(false);

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            title: editingCategory?.title,
            slug: editingCategory?.slug,
            description: editingCategory?.description,
            meta_title: editingCategory?.meta_title,
            meta_description: editingCategory?.meta_description,
            status: editingCategory?.status,
            position: editingCategory?.position,
            image: editingCategory?.image,
        });
    }, [editingCategory, form]);

    const handleimageSelect = (files: TFileDocument[]) => {
        const selectedImage = files[0];
        setCategoryImage(selectedImage);
        form.setFieldsValue({ image: selectedImage.id });
        setOpenFileUploader(false);
    };

    const [createCategory, { isLoading: isCreating }] =
        useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] =
        useUpdateCategoryMutation();

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const categoryData = {
                ...values,
                image: values.image || undefined,
            };

            if (editingCategory) {
                // Calculate delta: only include changed fields
                const delta: Partial<Category> = {};
                if (values.title !== editingCategory.title)
                    delta.title = values.title;
                if (values.slug !== editingCategory.slug)
                    delta.slug = values.slug;
                if (values.description !== editingCategory.description)
                    delta.description = values.description;
                if (values.meta_title !== editingCategory.meta_title)
                    delta.meta_title = values.meta_title;
                if (
                    values.meta_description !== editingCategory.meta_description
                )
                    delta.meta_description = values.meta_description;
                if (values.status !== editingCategory.status)
                    delta.status = values.status;
                if (values.position !== editingCategory.position)
                    delta.position = values.position;
                if (values.image !== editingCategory.image)
                    delta.image = values.image;

                if (Object.keys(delta).length > 0) {
                    await updateCategory({
                        id: editingCategory.id,
                        data: delta,
                    }).unwrap();
                    message.success(
                        `Category "${values.title}" has been updated`
                    );
                } else {
                    message.info("No changes detected");
                }
            } else {
                await createCategory(categoryData).unwrap();
                message.success(`Category "${values.title}" has been created`);
                form.resetFields();
            }
            close();
            form.resetFields();
            setCategoryImage(undefined);
        } catch (error) {
            message.warning(
                (error as TError)?.data?.message
            );

            console.error("Operation failed:", error);
        }
    };
    return (
        <Modal
            title={editingCategory ? "Edit Category" : "Add New Category"}
            open={open}
            onOk={handleModalOk}
            onCancel={() => {
                close();
                setCategoryImage(undefined);
                form.resetFields();
            }}
            okButtonProps={{ loading: isCreating || isUpdating }}
            width={600}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="title"
                            label="Category Title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter category title",
                                },
                            ]}
                        >
                            <Input placeholder="Enter category title" />
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
                        src={fileObjectToLink(categoryImage || null)}
                        icon={<UserOutlined />}
                    />
                    <Form.Item name="image" label="Profile Image">
                        <Button
                            icon={<UploadOutlined />}
                            onClick={() => setOpenFileUploader(true)}
                        >
                            Upload Profile Image
                        </Button>
                    </Form.Item>
                </Row>
            </Form>
            <GlobalFilePicker
                open={openFileUpload}
                onCancel={() => setOpenFileUploader(false)}
                fileTypes={["image/jpeg", "image/png"]}
                onSelect={handleimageSelect}
                multiple={false}
                initialSelected={categoryImage ? [categoryImage] : []}
            />
        </Modal>
    );
}
