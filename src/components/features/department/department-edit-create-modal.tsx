/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
} from "@/redux/features/department/departmentApi";
import { Department, TError } from "@/types";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import { useEffect } from "react";

interface DepartmentEditCreateModalInterface {
    editingDepartment: Department | null;
    open: boolean;
    close: () => void;
}

export default function DepartmentEditCreateModal({
    editingDepartment,
    open,
    close,
}: DepartmentEditCreateModalInterface) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            title: editingDepartment?.title,
            status: editingDepartment?.status,
        });
    }, [editingDepartment, form]);

    const [createDepartment, { isLoading: isCreating }] =
        useCreateDepartmentMutation();
    const [updateDepartment, { isLoading: isUpdating }] =
        useUpdateDepartmentMutation();

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const departmentData = {
                ...values,
                image: values.image || undefined,
            };

            if (editingDepartment) {
                const delta: Partial<Department> = {};
                if (values.title !== editingDepartment.title)
                    delta.title = values.title;
                if (values.status !== editingDepartment.status)
                    delta.status = values.status;

                if (Object.keys(delta).length > 0) {
                    await updateDepartment({
                        id: editingDepartment.id,
                        data: delta,
                    }).unwrap();
                    message.success(
                        `Department "${values.title}" has been updated`
                    );
                } else {
                    message.info("No changes detected");
                }
            } else {
                await createDepartment(departmentData).unwrap();
                message.success(
                    `Department "${values.title}" has been created`
                );
                form.resetFields();
            }

            close();
            form.resetFields();
        } catch (error) {
            message.warning(
                (error as TError)?.data?.message || "Operation failed"
            );
            console.error("Operation failed:", error);
        }
    };

    return (
        <Modal
            title={editingDepartment ? "Edit Department" : "Add New Department"}
            open={open}
            onOk={handleModalOk}
            onCancel={close}
            okButtonProps={{ loading: isCreating || isUpdating }}
            width={600}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="title"
                            label="Department Title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter department title",
                                },
                            ]}
                        >
                            <Input placeholder="Enter department title" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                        {
                            required: true,
                            message: "Please enter status",
                        },
                    ]}
                    initialValue={"active"}
                >
                    <Select placeholder="Select Status" options={[
                        {
                            label : "Active",
                            value: "active"
                        },
                        {
                            label : "Inactive",
                            value: "inactive"
                        },
                    ]} />
                </Form.Item>
            </Form>
        </Modal>
    );
}
