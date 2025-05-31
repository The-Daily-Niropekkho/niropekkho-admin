/* eslint-disable @typescript-eslint/no-explicit-any */
import { GlobalFilePicker } from "@/components/features/media/global-file-picker";
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
} from "@/redux/features/categories/categoriesApi";
import { Category, TError, TFileDocument } from "@/types";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface EpaperCategoryEditCreateModalInterface {
    editingCategory: Category | null;
    open: boolean;
    close: () => void;
    categoryImage: TFileDocument | undefined;
    setCategoryImage: Dispatch<SetStateAction<TFileDocument | undefined>>;
}

export default function EpaperCategoryEditCreateModal({
    editingCategory,
    open,
    close,
    categoryImage,
    setCategoryImage,
}: EpaperCategoryEditCreateModalInterface) {
    const [openFileUpload, setOpenFileUploader] = useState<boolean>(false);

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            title: editingCategory?.title,
            status: editingCategory?.status,
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
                if (values.status !== editingCategory.status)
                    delta.status = values.status;

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
            message.warning((error as TError)?.data?.message);

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
                            name="status"
                            label="Status"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select status",
                                },
                            ]}
                        >
                            <Select showSearch placeholder="Select a Status">
                                <Select.Option value="active">
                                    Active
                                </Select.Option>
                                <Select.Option value="inactive">
                                    Inactive
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
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
