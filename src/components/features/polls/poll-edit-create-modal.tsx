"use client";
import { useTheme } from "@/components/theme-context";
import {
  useCreatePollMutation,
  useUpdatePollMutation,
} from "@/redux/features/polls/pollsApi";
import { Poll, TFileDocument } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import { PictureOutlined, PlusOutlined } from "@ant-design/icons";
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
  Tag,
  Typography,
} from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GlobalFilePicker } from "../media/global-file-picker";

const { Option } = Select;
const { TextArea } = Input;

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
    const [options, setOptions] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [openFilePicker, setOpenFilePicker] = useState(false);

    const { isDark } = useTheme();

    useEffect(() => {
        if (editingPoll) {
            const initialOptions =
                editingPoll.options?.map((opt) => opt.label) || [];
            form.setFieldsValue({
                title: editingPoll.title,
                description: editingPoll.description,
                status: editingPoll.status,
                slug: editingPoll.slug,
            });
            setOptions(initialOptions);
            setPollImage(editingPoll.banner_image);
        } else {
            form.resetFields();
            setOptions([]);
            setPollImage(undefined);
        }
    }, [editingPoll, form, setPollImage]);

    const handleAddOption = () => {
        if (inputValue && !options.includes(inputValue)) {
            setOptions([...options, inputValue]);
            setInputValue("");
        }
    };

    const handleRemoveOption = (optionToRemove: string) => {
        setOptions(options.filter((option) => option !== optionToRemove));
    };
    const handleFileSelect = (selectedFiles: TFileDocument[]) => {
        if (selectedFiles.length > 0) {
            const file = selectedFiles[0];
            setPollImage(file);
        }
        setOpenFilePicker(false);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const values = await form.validateFields();

            const pollData = {
                title: values.title,
                description: values.description,
                status: values.status,
                slug: values.slug || "",
                banner_image: pollImage,
                options: options.map((label) => ({ label })),
            };

            if (editingPoll && editingPoll.id) {
                await updatePoll({
                    id: editingPoll.id,
                    data: pollData,
                }).unwrap();
                message.success("Poll updated successfully");
            } else {
                await createPoll(pollData).unwrap();
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
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[
                                {
                                    required: false,
                                    message: "Please enter description",
                                },
                            ]}
                        >
                            <TextArea
                                rows={3}
                                placeholder="Enter poll description"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
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
                                        <Tag
                                            key={option}
                                            closable
                                            onClose={() =>
                                                handleRemoveOption(option)
                                            }
                                            style={{ marginBottom: 8 }}
                                        >
                                            {option}
                                        </Tag>
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
                                                form.setFieldsValue({
                                                    banner_image: null,
                                                });
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
