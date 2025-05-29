"use client";
import {
    useCreateDistrictMutation,
    useUpdateDistrictMutation,
} from "@/redux/features/zone/districtsApi";
import { useGetAllDivisionsQuery } from "@/redux/features/zone/divisionApi";
import { District, Division } from "@/types";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";

interface DistrictEditCreateModalProps {
    editingDistrict: District | null;
    open: boolean;
    close: () => void;
}

const DistrictEditCreateModal: React.FC<DistrictEditCreateModalProps> = ({
    editingDistrict,
    open,
    close,
}) => {
    const [form] = Form.useForm();
    const [createDistrict] = useCreateDistrictMutation();
    const [updateDistrict] = useUpdateDistrictMutation();
    const [isLoading, setIsLoading] = useState(false);

    const { data: divisions, isLoading: isDivisionsLoading } =
        useGetAllDivisionsQuery({ limit: 999 });

    useEffect(() => {
        if (editingDistrict) {
            form.setFieldsValue({
                division_id: editingDistrict.division_id,
                name: editingDistrict.name,
                bn_name: editingDistrict.bn_name,
                url: editingDistrict.url,
            });
        } else {
            form.resetFields();
        }
    }, [editingDistrict, form]);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const values = await form.validateFields();

            const action = editingDistrict
                ? updateDistrict({ id: editingDistrict.id, data: values })
                : createDistrict(values);

            await action.unwrap();
            message.success(
                `District ${
                    editingDistrict ? "updated" : "created"
                } successfully`
            );
            close();
        } catch {
            message.error("Failed to save district");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title={editingDistrict ? "Edit District" : "Create District"}
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
                            name="division_id"
                            label="Division"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a Division",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select a division"
                                showSearch
                                loading={isDivisionsLoading}
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    String(option?.label ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            >
                                {divisions?.data?.map((division: Division) => (
                                    <Select.Option
                                        key={division.id}
                                        value={division.id}
                                        label={division.name}
                                    >
                                        {division.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter name",
                                },
                            ]}
                        >
                            <Input placeholder="Enter District name" />
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
                            <Input placeholder="Enter District Bangla name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="url"
                            label="URL"
                            rules={[
                                { required: true, message: "Please enter URL" },
                                {
                                    type: "url",
                                    message: "Please enter a valid URL",
                                },
                            ]}
                        >
                            <Input placeholder="Enter a URL" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default DistrictEditCreateModal;
