"use client";
import { useGetAllCountriesQuery } from "@/redux/features/zone/countryApi";
import {
    useCreateDivisionMutation,
    useUpdateDivisionMutation,
} from "@/redux/features/zone/divisionApi";
import { Country, Division } from "@/types";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import React from "react";

interface DivisionEditCreateModalProps {
    editingDivision: Division | null;
    open: boolean;
    close: () => void;
}

const DivisionEditCreateModal: React.FC<DivisionEditCreateModalProps> = ({
    editingDivision,
    open,
    close,
}) => {
    const [form] = Form.useForm();
    const [createDivision] = useCreateDivisionMutation();
    const [updateDivision] = useUpdateDivisionMutation();
    const [isLoading, setIsLoading] = React.useState(false);

    const { data: countries, isLoading: isCountryLoading } =
        useGetAllCountriesQuery({
            limit: 999,
            sortBy: "name",
            sortOrder: "asc",
        });

    React.useEffect(() => {
        if (editingDivision) {
            form.setFieldsValue({
                country_id: editingDivision.country_id,
                name: editingDivision.name,
                bn_name: editingDivision.bn_name,
                url: editingDivision.url,
            });
        } else {
            form.resetFields();
        }
    }, [editingDivision, form]);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const values = await form.validateFields();

            if (editingDivision) {
                await updateDivision({
                    id: editingDivision.id,
                    data: values,
                }).unwrap();
                message.success("Division updated successfully");
            } else {
                await createDivision(values).unwrap();
                message.success("Division created successfully");
            }

            close();
        } catch (error) {
            message.error("Failed to save Division");
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title={editingDivision ? "Edit Division" : "Create Division"}
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
                            name="country_id"
                            label="Country"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a country",
                                },
                            ]}
                        >
                            <Select
                                options={countries?.data?.map(
                                    (country: Country) => ({
                                        label: country.name,
                                        value: country.country_code,
                                    })
                                )}
                                showSearch
                                placeholder="Select a country"
                                disabled={isCountryLoading}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Division Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter Division name",
                                },
                            ]}
                        >
                            <Input placeholder="Enter division name" />
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
                            <Input placeholder="Enter Bangla name" />
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

export default DivisionEditCreateModal;
