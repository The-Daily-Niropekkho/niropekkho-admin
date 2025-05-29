"use client";
import {
    useCreateUnionMutation,
    useUpdateUnionMutation,
} from "@/redux/features/zone/unionApi";
import { useGetAllUpazillasQuery } from "@/redux/features/zone/upazillaApi";
import { Union, Upazilla } from "@/types";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import React from "react";

interface UnionEditCreateModalProps {
    editingUnion: Union | null;
    open: boolean;
    close: () => void;
}

const UnionEditCreateModal: React.FC<UnionEditCreateModalProps> = ({
    editingUnion,
    open,
    close,
}) => {
    const [form] = Form.useForm();
    const [createUnion] = useCreateUnionMutation();
    const [updateUnion] = useUpdateUnionMutation();
    const [isLoading, setIsLoading] = React.useState(false);

    const {
        data: upazillas,
        isLoading: isUpazillasLoading,
        error: upazillasError,
    } = useGetAllUpazillasQuery({
            limit: 999,
            sortBy: "name",
            sortOrder: "asc",
        });

    React.useEffect(() => {
        if (upazillasError) {
            console.error("Error fetching upazillas:", upazillasError);
        }
    }, [upazillasError]);

    React.useEffect(() => {
        if (editingUnion) {
            form.setFieldsValue({
                upazilla_id: editingUnion.upazilla_id,
                name: editingUnion.name,
                bn_name: editingUnion.bn_name,
                url: editingUnion.url,
            });
        } else {
            form.resetFields();
        }
    }, [editingUnion, form]);

    const handleUpazillaChange = (upazillaId: number) => {
        const selectedUpazilla = upazillas?.data?.find(
            (upazilla: Upazilla) => upazilla.id === upazillaId
        );
        if (selectedUpazilla) {
            form.setFieldsValue({
                name: selectedUpazilla.name,
                bn_name: selectedUpazilla.bn_name,
            });
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const values = await form.validateFields();

            if (editingUnion) {
                await updateUnion({
                    id: editingUnion.id,
                    data: values,
                }).unwrap();
                message.success("Union updated successfully");
            } else {
                await createUnion(values).unwrap();
                message.success("Union created successfully");
            }

            close();
        } catch (error) {
            message.error("Failed to save Union");
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title={editingUnion ? "Edit Union" : "Create Union"}
            open={open}
            onOk={handleSubmit}
            onCancel={close}
            confirmLoading={isLoading}
            width={700}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="upazilla_id"
                            label="Upazilla"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select an Upazilla",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select an Upazilla"
                                loading={isUpazillasLoading}
                                disabled={isUpazillasLoading}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.children as unknown as string)
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                onChange={handleUpazillaChange}
                                notFoundContent={
                                    upazillasError
                                        ? "Error loading upazillas"
                                        : !upazillas?.data ||
                                          upazillas?.data?.length === 0
                                        ? "No data"
                                        : null
                                }
                            >
                                {upazillas?.data?.map(
                                    (upazilla: {
                                        id: number;
                                        name: string;
                                    }) => (
                                        <Select.Option
                                            key={upazilla.id}
                                            value={upazilla.id}
                                            label={upazilla.name}
                                        >
                                            {upazilla.name}
                                        </Select.Option>
                                    )
                                )}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Union Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Union name",
                                },
                            ]}
                        >
                            <Input placeholder="Enter union name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="bn_name"
                            label="Bangla Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Bangla name",
                                },
                            ]}
                        >
                            <Input placeholder="বাংলা নাম লিখুন" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="url"
                            label="URL"
                            rules={[
                                { required: false, message: "Please enter URL" }
                            ]}
                        >
                            <Input placeholder="https://example.com" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UnionEditCreateModal;
