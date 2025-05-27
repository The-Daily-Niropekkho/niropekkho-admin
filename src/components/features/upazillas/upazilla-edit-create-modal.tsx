"use client";
import React from "react";
import { Upazilla } from "@/types";
import { Modal, Form, Input, message, Row, Col } from "antd";
import {
  useCreateUpazillaMutation,
  useUpdateUpazillaMutation,
} from "@/redux/features/zone/upazillaApi";

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
              label="District ID"
              rules={[{ required: true, message: "Please enter district ID" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Upazilla Name"
              rules={[{ required: true, message: "Please enter upazilla name" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="bn_name"
              label="Bangla Name"
              rules={[{ required: true, message: "Please enter Bangla name" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="url"
              label="URL"
              rules={[
                { required: true, message: "Please enter URL" },
                { type: "url", message: "Please enter a valid URL" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpazillaEditCreateModal;