/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTheme } from "@/components/theme-context";
import {
    useCreatePollMutation,
    useUpdatePollMutation,
} from "@/redux/features/polls/pollsApi";
import { Poll, TFileDocument } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import {
    DeleteOutlined,
    EditOutlined,
    PictureOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Button,
    Col,
    Form,
    Input,
    message,
    Modal,
    Row,
    Select,
    Space,
    Typography,
} from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GlobalFilePicker } from "../media/global-file-picker";

const { Option } = Select;
const { TextArea } = Input;

type LocalPollOption = {
    id?: string;
    label: string;
};

interface PollEditCreateModalProps {
    editingPoll?: Poll;
    open: boolean;
    pollImage?: TFileDocument;
    setPollImage: (image: TFileDocument | undefined) => void;
    close: () => void;
}

const PollEditCreateModal: React.FC<PollEditCreateModalProps> = ({
    editingPoll,
    open,
    pollImage,
    setPollImage,
    close,
}) => {
    const [form] = Form.useForm();
    const [createPoll] = useCreatePollMutation();
    const [updatePoll] = useUpdatePollMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<LocalPollOption[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [openFilePicker, setOpenFilePicker] = useState(false);
    const [editingOption, setEditingOption] = useState<string | null>(null);
    const [editInputValue, setEditInputValue] = useState("");

    const { isDark } = useTheme();

    useEffect(() => {
        if (editingPoll) {
            form.setFieldsValue({
                title: editingPoll.title,
                description: editingPoll.description,
                status: editingPoll.status,
                slug: editingPoll.slug,
            });

            setOptions(
                editingPoll.options?.map((opt) => ({
                    id: opt.id,
                    label: opt.label,
                })) || []
            );

            setPollImage(editingPoll.banner_image);
        } else {
            form.resetFields();
            setOptions([]);
            setPollImage(undefined);
        }
    }, [editingPoll, form, setPollImage]);

    const handleAddOption = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !options.some((opt) => opt.label === trimmed)) {
            setOptions([...options, { label: trimmed }]);
            setInputValue("");
        }
    };

    const handleDeleteOption = (labelToRemove: string) => {
        setOptions(options.filter((opt) => opt.label !== labelToRemove));
        if (editingOption === labelToRemove) {
            setEditingOption(null);
            setEditInputValue("");
        }
    };

    const handleEditOption = (option: LocalPollOption) => {
        setEditingOption(option.label);
        setEditInputValue(option.label);
    };

    const handleSaveEdit = (originalLabel: string) => {
        const trimmed = editInputValue.trim();
        if (
            trimmed &&
            !options.some(
                (opt) => opt.label === trimmed && opt.label !== originalLabel
            )
        ) {
            setOptions(
                options.map((opt) =>
                    opt.label === originalLabel
                        ? { ...opt, label: trimmed }
                        : opt
                )
            );
            setEditingOption(null);
            setEditInputValue("");
        } else if (trimmed === originalLabel) {
            setEditingOption(null);
            setEditInputValue("");
        }
    };

    const handleCancelEdit = () => {
        setEditingOption(null);
        setEditInputValue("");
    };

    const handleFileSelect = (selectedFiles: TFileDocument[]) => {
        if (selectedFiles.length > 0) {
            setPollImage(selectedFiles[0]);
        }
        setOpenFilePicker(false);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const values = await form.validateFields();
            const changedFields: any = {};
            const initialValues = {
                title: editingPoll?.title,
                description: editingPoll?.description,
                status: editingPoll?.status,
                slug: editingPoll?.slug,
            };

            Object.entries(values).forEach(([key, value]) => {
                if (value !== (initialValues as any)[key]) {
                    changedFields[key] = value;
                }
            });

            const initialOptionMap = new Map(
                (editingPoll?.options || []).map((opt) => [opt.label, opt])
            );

            const currentLabels = options.map((opt) => opt.label);
            const originalLabels = Array.from(initialOptionMap.keys());

            const newOptions = options
                .filter((opt) => !opt.id && !initialOptionMap.has(opt.label))
                .map((opt) => ({ label: opt.label }));

            const unchangedOptions = options
                .filter((opt) => opt.id)
                .map((opt) => ({ id: opt.id, label: opt.label }));

            const finalOptions = [...unchangedOptions, ...newOptions];

            if (
                newOptions.length > 0 ||
                currentLabels.length !== originalLabels.length ||
                !currentLabels.every((label) => originalLabels.includes(label))
            ) {
                changedFields.options = finalOptions;
            }

            if (
                pollImage &&
                (!editingPoll?.banner_image ||
                    pollImage !== editingPoll.banner_image)
            ) {
                changedFields.banner_image = pollImage;
            }

            if (Object.keys(changedFields).length === 0) {
                message.info("No changes detected.");
                setIsLoading(false);
                return;
            }

            if (editingPoll?.id) {
                await updatePoll({
                    id: editingPoll.id,
                    data: changedFields,
                }).unwrap();
                message.success("Poll updated successfully");
            } else {
                await createPoll({
                    ...values,
                    banner_image_id: pollImage?.id,
                    options: finalOptions,
                }).unwrap();
                message.success("Poll created successfully");
            }

            close();
        } catch (error) {
            console.error("Error saving poll:", error);
            message.error("Failed to save poll");
        } finally {
            setIsLoading(false);
        }
    };

    const uploadBoxStyle: React.CSSProperties = {
        width: "100%",
        height: 100,
        border: `1px dashed ${isDark ? "#444" : "#d9d9d9"}`,
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
        background: isDark ? "#2A3441" : "#fafafa",
        color: isDark ? "#aaa" : "#999",
    };

    return (
        <Modal
            title={editingPoll ? "Edit Poll" : "Create Poll"}
            open={open}
            onOk={handleSubmit}
            onCancel={close}
            confirmLoading={isLoading}
            okText={editingPoll ? "Update" : "Create"}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="title"
                            label="Poll Title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter poll title",
                                },
                            ]}
                        >
                            <Input placeholder="Enter poll title" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="description" label="Description">
                            <TextArea
                                rows={3}
                                placeholder="Enter poll description"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="slug" label="Slug">
                            <Input placeholder="Enter poll slug" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Poll Options"
                            required
                            rules={[
                                {
                                    validator: () =>
                                        options.length > 0
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                  "Please add at least one option"
                                              ),
                                },
                            ]}
                        >
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                <Space.Compact style={{ width: "100%" }}>
                                    <Input
                                        value={inputValue}
                                        onChange={(e) =>
                                            setInputValue(e.target.value)
                                        }
                                        placeholder="Enter an option"
                                        onPressEnter={handleAddOption}
                                    />
                                    <Button
                                        type="primary"
                                        onClick={handleAddOption}
                                        icon={<PlusOutlined />}
                                    >
                                        Add
                                    </Button>
                                </Space.Compact>
                                <div style={{ marginTop: 8 }}>
                                    {options.map((option) => (
                                        <div
                                            key={option.id || option.label}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: 8,
                                            }}
                                        >
                                            {editingOption === option.label ? (
                                                <Space.Compact
                                                    style={{ width: "100%" }}
                                                >
                                                    <Input
                                                        value={editInputValue}
                                                        onChange={(e) =>
                                                            setEditInputValue(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Edit option"
                                                        onPressEnter={() =>
                                                            handleSaveEdit(
                                                                option.label
                                                            )
                                                        }
                                                    />
                                                    <Button
                                                        type="primary"
                                                        onClick={() =>
                                                            handleSaveEdit(
                                                                option.label
                                                            )
                                                        }
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        onClick={
                                                            handleCancelEdit
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Space.Compact>
                                            ) : (
                                                <>
                                                    <Typography.Text
                                                        style={{
                                                            flex: 1,
                                                            marginRight: 8,
                                                        }}
                                                    >
                                                        {option.label}
                                                    </Typography.Text>
                                                    <Button
                                                        icon={<EditOutlined />}
                                                        onClick={() =>
                                                            handleEditOption(
                                                                option
                                                            )
                                                        }
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    <Button
                                                        icon={
                                                            <DeleteOutlined />
                                                        }
                                                        onClick={() =>
                                                            handleDeleteOption(
                                                                option.label
                                                            )
                                                        }
                                                        danger
                                                    />
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="status"
                            label="Status"
                            initialValue="publish"
                            rules={[{ required: true }]}
                        >
                            <Select>
                                <Option value="publish">Published</Option>
                                <Option value="draft">Draft</Option>
                                <Option value="archived">Archived</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Banner Image">
                            <div
                                onClick={() => setOpenFilePicker(true)}
                                style={{
                                    ...uploadBoxStyle,
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                {pollImage ? (
                                    <>
                                        <Image
                                            src={fileObjectToLink(pollImage)}
                                            alt="Banner"
                                            width={120}
                                            height={80}
                                            style={{
                                                objectFit: "cover",
                                                borderRadius: 8,
                                            }}
                                        />
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPollImage(undefined);
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                                background: "#fff",
                                                borderRadius: "50%",
                                                padding: "2px 6px",
                                                fontSize: 12,
                                                cursor: "pointer",
                                                boxShadow:
                                                    "0 0 3px rgba(0,0,0,0.3)",
                                            }}
                                        >
                                            ✕
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <PictureOutlined
                                            style={{
                                                fontSize: 24,
                                                color: isDark ? "#888" : "#999",
                                            }}
                                        />
                                        <Typography.Text
                                            style={{
                                                fontSize: 12,
                                                color: isDark ? "#ccc" : "#666",
                                            }}
                                        >
                                            Upload Banner
                                        </Typography.Text>
                                    </>
                                )}
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <GlobalFilePicker
                open={openFilePicker}
                onCancel={() => setOpenFilePicker(false)}
                onSelect={handleFileSelect}
            />
        </Modal>
    );
};

export default PollEditCreateModal;
