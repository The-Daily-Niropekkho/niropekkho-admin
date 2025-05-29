"use client";
import { useGetAllDistrictsQuery } from "@/redux/features/zone/districtsApi";
import {
    useCreateUpazillaMutation,
    useUpdateUpazillaMutation,
} from "@/redux/features/zone/upazillaApi";
import { Upazilla } from "@/types";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import React from "react";

interface UpazillaEditCreateModalProps {
    editingUpazilla: Upazilla | null;
    open: boolean;
    close: () => void;
}

const UpazillaEditCreateModal: React.FC<UpazillaEditCreateModalProps> = ({
    editingUpazilla,
    open,
    close,
}) => {
    const [form] = Form.useForm();
    const [createUpazilla] = useCreateUpazillaMutation();
    const [updateUpazilla] = useUpdateUpazillaMutation();
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (editingUpazilla) {
            form.setFieldsValue({
                district_id: editingUpazilla.district_id,
                name: editingUpazilla.name,
                bn_name: editingUpazilla.bn_name,
                url: editingUpazilla.url,
            });
        } else {
            form.resetFields();
        }
    }, [editingUpazilla, form]);

    const { data: districts, isLoading: isDistrictLoading } =
        useGetAllDistrictsQuery({
            limit: 999,
            sortBy: "name",
            sortOrder: "asc",
        });

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const values = await form.validateFields();

            if (editingUpazilla) {
                await updateUpazilla({
                    id: editingUpazilla.id,
                    data: values,
                }).unwrap();
                message.success("Upazilla updated successfully");
            } else {
                await createUpazilla(values).unwrap();
                message.success("Upazilla created successfully");
            }

            close();
        } catch {
            message.error("Failed to save upazilla");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title={editingUpazilla ? "Edit Upazilla" : "Create Upazilla"}
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
                            name="district_id"
                            label="District"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a district",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select a district"
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.children as unknown as string)
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                loading={isDistrictLoading}
                            >
                                {districts?.data?.map((district) => (
                                    <Select.Option
                                        key={district.id}
                                        value={district.id}
                                    >
                                        {district.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Upazilla Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter upazilla name",
                                },
                            ]}
                        >
                            <Input placeholder="Enter upazilla name" />
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
                                { required: true, message: "Please enter URL" },
                                {
                                    type: "url",
                                    message: "Please enter a valid URL",
                                },
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

export default UpazillaEditCreateModal;
