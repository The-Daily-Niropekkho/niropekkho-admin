"use client";
import React, { useState, useEffect } from "react";
import { Poll, TFileDocument } from "@/types";
import {
  Modal,
  Form,
  Input,
  message,
  Row,
  Col,
  Upload,
  Button,
  Select,
  Space,
  Tag,
  
} from "antd";
import { UploadOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useCreatePollMutation,
  useUpdatePollMutation,
} from "@/redux/features/polls/pollsApi";
import { GlobalFilePicker } from "../media/global-file-picker";

const { Option } = Select;
const { TextArea } = Input;

interface BannerImage {
  url: string;
  originalUrl: string;
  filename: string;
  modifyFileName: string;
  mimetype: string;
  platform: string;
  path: string;
  cdn: string;
  size: number;
}

interface PollEditCreateModalProps {
  editingPoll?: Poll;
  open: boolean;
  pollImage?: BannerImage;
  setPollImage: (image: BannerImage | undefined) => void;
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

  useEffect(() => {
    if (editingPoll) {
      const initialOptions = editingPoll.options?.map((opt) => opt.label) || [];
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

  // Handle file selection from GlobalFilePicker
  const handleFileSelect = (selectedFiles: TFileDocument[]) => {
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const newBannerImage: BannerImage = {
        url: file.url,
        originalUrl: file.originalUrl || file.url,
        filename: file.filename || "",
        modifyFileName: file.filename || "",
        mimetype: file.mimetype,
        platform: file.platform || "cdn",
        path: file.path || "",
        cdn: file.cdn || "",
        size: file.size,
      };
      setPollImage(newBannerImage);
    }
    setOpenFilePicker(false);
  };

 
  const handleFileUpload = async (file: File) => {
    try {
     
      const formData = new FormData();
      formData.append("file", file);

    
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const fileData = await response.json();
      const newBannerImage: BannerImage = {
        url: fileData.url,
        originalUrl: fileData.url,
        filename: file.name,
        modifyFileName: file.name,
        mimetype: file.type || "image/jpeg",
        platform: "cdn",
        path: fileData.path || "",
        cdn: fileData.cdn || "",
        size: file.size,
      };
      setPollImage(newBannerImage);
      message.success("File uploaded successfully");
    } catch (error) {
      console.error("File upload error:", error);
      message.error("Failed to upload file");
    }
    return false;
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      const pollData: Omit<Poll, "id"> = {
        _id: "",
        title: values.title,
        description: values.description,
        status: values.status,
        slug: values.slug || "",
        banner_image: pollImage || {
          url: "",
          originalUrl: "",
          filename: "",
          modifyFileName: "",
          mimetype: "",
          platform: "",
          path: "",
          cdn: "",
          size: 0,
        },
        options: options.map((label) => ({ label })),
      };

      if (editingPoll && editingPoll._id) {
        await updatePoll({
          id: editingPoll._id,
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

  return (
    <Modal
      title={editingPoll ? "Edit Poll" : "Create Poll"}
      open={open}
      onOk={handleSubmit}
      onCancel={close}
      confirmLoading={isLoading}
      width={800}
      okText={editingPoll ? "Update" : "Create"}
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Poll Title"
              rules={[{ required: true, message: "Please enter poll title" }]}
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
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <TextArea rows={3} placeholder="Enter poll description" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="slug"
              label="Slug"
              rules={[{ required: true, message: "Please enter slug" }]}
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
                      : Promise.reject("Please add at least one option"),
                },
              ]}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
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
                      onClose={() => handleRemoveOption(option)}
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
              <Space direction="vertical">
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={handleFileUpload}
                  accept="image/*"
                >
                  {pollImage?.url ? (
                    <img
                      src={pollImage.url}
                      alt="Poll banner"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
                <Button
                  type="primary"
                  onClick={() => setOpenFilePicker(true)}
                  style={{ marginTop: 8 }}
                >
                  Choose from Media Library
                </Button>
                {pollImage?.url && (
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => setPollImage(undefined)}
                    style={{ marginTop: 8 }}
                  >
                    Remove Image
                  </Button>
                )}
              </Space>
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