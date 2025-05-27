"use client";
import React from "react";
import { Division } from "@/types";
import { Modal, Form, Input, message, Row, Col } from "antd";
import {
  useCreateDivisionMutation,
  useUpdateDivisionMutation,
} from "@/redux/features/zone/divisionApi";

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
    } catch {
      message.error("Failed to save Division");
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
              label="Country ID"
              rules={[{ required: true, message: "Please enter country ID" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Division Name"
              rules={[{ required: true, message: "Please enter Division name" }]}
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

export default DivisionEditCreateModal;