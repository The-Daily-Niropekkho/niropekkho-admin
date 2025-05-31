/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
    useGetContactDetailsQuery,
    useUpdateContactMutation,
} from "@/redux/features/contact/contactApi";
import { Contact, ErrorResponse } from "@/types";
import { Button, Col, Form, Input, message, Row } from "antd";
import { useEffect, useState } from "react";

const { TextArea } = Input;

type FormValues = {
    editor_name: string;
    chairperson: string;
    executive_editor: string;
    email: string;
    address: string;
    phone: string;
    phoneTwo: string;
    website: string;
    map: string;
    latitude?: string;
    longitude?: string;
};

export default function GeneralSettingsTab() {
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(false);

    const {
        data: contactData,
        isLoading,
        isFetching,
        isError,
        error,
    } = useGetContactDetailsQuery(undefined);

    const [updateContact] = useUpdateContactMutation();

    // Set initial data to form
    useEffect(() => {
        if (contactData?.[0]) {
            setFormFieldsFromData(contactData[0]);
        }
    }, [contactData]);

    useEffect(() => {
        if (isError) {
            const err = error as ErrorResponse;
            message.error(
                err?.data?.message || "Failed to Get Contact Details"
            );
        }
    }, [isError, error]);

    const setFormFieldsFromData = (data: Contact) => {
        form.setFieldsValue({
            editor_name: data.editor_name || "",
            chairperson: data.chairperson || "",
            executive_editor: data.executive_editor || "",
            email: data.email || "",
            address: data.address || "",
            phone: data.phone || "",
            phoneTwo: data.phoneTwo || "",
            website: data.website || "",
            map: data.map || "",
            latitude: data.latitude?.toString() || "",
            longitude: data.longitude?.toString() || "",
        });
    };

    const buildContactUpdatePayload = (
        values: FormValues
    ): Partial<Contact> => ({
        editor_name: values.editor_name,
        chairperson: values.chairperson,
        executive_editor: values.executive_editor,
        email: values.email,
        address: values.address,
        phone: values.phone,
        phoneTwo: values.phoneTwo,
        website: values.website,
        map: values.map,
        latitude: values.latitude ? parseFloat(values.latitude) : undefined,
        longitude: values.longitude ? parseFloat(values.longitude) : undefined,
    });

    const onFinish = async (values: FormValues) => {
        if (!contactData?.[0]?.id) return;
        setLoading(true);
        try {
            const payload = buildContactUpdatePayload(values);
            await updateContact({
                id: contactData[0].id,
                data: payload,
            }).unwrap();

            message.success("Contact settings updated successfully!");
        } catch (err) {
            const e = err as ErrorResponse;
            message.error(
                e?.data?.message || "Failed to update contact settings."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={isLoading || isFetching}
        >
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="editor_name"
                        label="Editor & Publisher"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the name",
                            },
                        ]}
                    >
                        <Input placeholder="Editor & Publisher" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="chairperson"
                        label="Chairperson of the Editorial Board"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the name",
                            },
                        ]}
                    >
                        <Input placeholder="Chairperson of the Editorial Board" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="executive_editor"
                        label="Executive Editor / Managing Editor"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the name",
                            },
                        ]}
                    >
                        <Input placeholder="Executive Editor / Managing Editor" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                type: "email",
                                message: "Enter valid email",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true }]}
            >
                <TextArea rows={3} placeholder="Office address" />
            </Form.Item>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="phone"
                        label="Primary Phone"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="phoneTwo"
                        label="Secondary Phone"
                        rules={[{ required: false }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="website"
                        label="Website"
                        rules={[
                            {
                                required: true,
                                type: "url",
                                message: "Enter valid URL",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="map"
                        label="Map Embed URL"
                        rules={[{ type: "url", message: "Enter valid URL" }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="latitude"
                        label="Latitude"
                        rules={[
                            {
                                pattern: /^-?\d*\.?\d+$/,
                                message: "Invalid latitude",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="longitude"
                        label="Longitude"
                        rules={[
                            {
                                pattern: /^-?\d*\.?\d+$/,
                                message: "Invalid longitude",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Save Contact Settings
                </Button>
            </Form.Item>
        </Form>
    );
}
