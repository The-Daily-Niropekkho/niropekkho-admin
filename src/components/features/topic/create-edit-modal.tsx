/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllCategoriesQuery } from "@/redux/features/categories/categoriesApi";
import {
    useCreateTopicMutation,
    useUpdateTopicMutation,
} from "@/redux/features/topic/topicApi";
import { Category, TError, Topic } from "@/types";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import { useEffect } from "react";

interface TopicEditCreateModalInterface {
    editingTopic: Topic | null;
    categoryId?: string;
    open: boolean;
    close: () => void;
}

export default function TopicEditCreateModal({
    editingTopic,
    open,
    close,
    categoryId
}: TopicEditCreateModalInterface) {
    const [form] = Form.useForm();
    const {
        data: categories,
        isLoading: isCategoryLoading,
        isFetching: isCategoryFetching,
    } = useGetAllCategoriesQuery({ limit: 9999 });

    useEffect(() => {
        form.setFieldsValue({
            category_id: editingTopic?.category_id || categoryId,
            title: editingTopic?.title,
            slug: editingTopic?.slug,
            description: editingTopic?.description, 
            meta_title: editingTopic?.meta_title,
            meta_description: editingTopic?.meta_description,
            status: editingTopic?.status,
            position: editingTopic?.position,
        });
    }, [categoryId, editingTopic, form]);

    const [createTopic, { isLoading: isCreating }] = useCreateTopicMutation();
    const [updateTopic, { isLoading: isUpdating }] = useUpdateTopicMutation();

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const topicData = {
                ...values,
                image: values.image || undefined,
            };

            if (editingTopic) {
                // Calculate delta: only include changed fields
                const delta: Partial<Topic> = {};
                if (values.title !== editingTopic.title)
                    delta.title = values.title;
                if (values.slug !== editingTopic.slug) delta.slug = values.slug;
                if (values.description !== editingTopic.description)
                    delta.description = values.description;
                if (values.meta_title !== editingTopic.meta_title)
                    delta.meta_title = values.meta_title;
                if (values.meta_description !== editingTopic.meta_description)
                    delta.meta_description = values.meta_description;
                if (values.status !== editingTopic.status)
                    delta.status = values.status;
                if (values.position !== editingTopic.position)
                    delta.position = values.position;
                if (values.category_id !== editingTopic.category_id)
                    delta.category_id = values.category_id;

                if (Object.keys(delta).length > 0) {
                    await updateTopic({
                        id: editingTopic.id,
                        data: delta,
                    }).unwrap();
                    message.success(`Topic "${values.title}" has been updated`);
                } else {
                    message.info("No changes detected");
                }
            } else {
                await createTopic(topicData).unwrap();
                message.success(`Topic "${values.title}" has been created`);
                form.resetFields();
            }
            close();
            form.resetFields();
        } catch (error) {
            message.warning((error as TError)?.data?.message);

            console.error("Operation failed:", error);
        }
    };
    return (
        <Modal
            title={editingTopic ? "Edit Topic" : "Add New Topic"}
            open={open}
            onOk={handleModalOk}
            onCancel={() => {
                close();
            }}
            okButtonProps={{ loading: isCreating || isUpdating }}
            width={600}
        >
            <Form form={form} layout="vertical">
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
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="title"
                            label="Topic Title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter topic title",
                                },
                            ]}
                        >
                            <Input placeholder="Enter topic title" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="slug"
                            label="Slug"
                            rules={[
                                {
                                    required: false,
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
            </Form>
        </Modal>
    );
}
