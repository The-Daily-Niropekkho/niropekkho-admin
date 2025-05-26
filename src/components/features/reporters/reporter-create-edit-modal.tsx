/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    useCreateGenericReporterMutation,
    useUpdateGenericReporterMutation,
} from "@/redux/features/reporter/reporterApi"; // hypothetical API hooks
import { GenericReporter, TError, TFileDocument } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Form, Input, message, Modal, Row } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GlobalFilePicker } from "../media/global-file-picker";

interface ReporterCreateEditModalInterface {
    editingReporter: GenericReporter | null;
    open: boolean;
    close: () => void;
    reporterImage: TFileDocument | undefined;
    setReporterImage: Dispatch<SetStateAction<TFileDocument | undefined>>;
}

export default function ReporterCreateEditModal({
    editingReporter,
    open,
    close,
    reporterImage,
    setReporterImage,
}: ReporterCreateEditModalInterface) {
    const [openFileUpload, setOpenFileUploader] = useState<boolean>(false);
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            name: editingReporter?.name,
            designation: editingReporter?.designation,
            photo: editingReporter?.photo,
        });
        if (editingReporter?.photo) {
            setReporterImage(editingReporter.photo);
        }
    }, [editingReporter, form]);

    const handleImageSelect = (files: TFileDocument[]) => {
        const selectedImage = files[0];
        setReporterImage(selectedImage);
        form.setFieldsValue({ photo: selectedImage });
        setOpenFileUploader(false);
    };

    const [createReporter, { isLoading: isCreating }] =
        useCreateGenericReporterMutation();
    const [updateReporter, { isLoading: isUpdating }] =
        useUpdateGenericReporterMutation();

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const reporterData = {
                name: values.name,
                designation: values.designation,
                photo: reporterImage || undefined,
            };

            if (editingReporter) {
                const delta: Partial<GenericReporter> = {};
                if (values.name !== editingReporter.name)
                    delta.name = values.name;
                if (values.designation !== editingReporter.designation)
                    delta.designation = values.designation;
                if (reporterImage?.url !== editingReporter.photo?.url)
                    delta.photo = reporterImage;

                if (Object.keys(delta).length > 0) {
                    await updateReporter({
                        id: editingReporter.id, // Ensure your backend uses `id`
                        data: delta,
                    }).unwrap();
                    message.success(
                        `Reporter "${values.name}" has been updated`
                    );
                } else {
                    message.info("No changes detected");
                }
            } else {
                await createReporter(reporterData).unwrap();
                message.success(`Reporter "${values.name}" has been created`);
                form.resetFields();
            }

            close();
            setReporterImage(undefined);
        } catch (error) {
            message.warning(
                (error as TError)?.data?.message || "Operation failed"
            );
            console.error("Operation failed:", error);
        }
    };

    return (
        <Modal
            title={editingReporter ? "Edit Reporter" : "Add New Reporter"}
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
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter reporter's name",
                                },
                            ]}
                        >
                            <Input placeholder="Enter reporter's name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="designation"
                            label="Designation"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter designation",
                                },
                            ]}
                        >
                            <Input placeholder="Enter designation" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row align="middle" style={{ gap: 12 }}>
                    <Avatar
                        shape="square"
                        size={64}
                        src={fileObjectToLink(reporterImage || null)}
                        icon={<UserOutlined />}
                    />
                    <Form.Item name="photo" label="Profile Photo">
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
                onSelect={handleImageSelect}
                multiple={false}
                initialSelected={reporterImage ? [reporterImage] : []}
            />
        </Modal>
    );
}
