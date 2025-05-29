"use client";
import React from "react";
import { Union } from "@/types";
import { Modal, Form, Input, message, Row, Col } from "antd";
import {
   useCreateUnionMutation,
    useUpdateUnionMutation
} from "@/redux/features/zone/unionApi";

interface UnionEditCreateModalProps {
  editingUnion: Union | null;
  open: boolean;
  close: () => void;
}

const UnionEditCreateModal: React.FC<UnionEditCreateModalProps> = ({
  editingUnion,
  open,
  close,
}) => {
  const [form] = Form.useForm();
  const [createUnion] = useCreateUnionMutation();
  const [updateUnion] = useUpdateUnionMutation();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (editingUnion) {
      form.setFieldsValue({
        district_id: editingUnion.upazilla_id,
        name: editingUnion.name,
        bn_name: editingUnion.bn_name,
        url: editingUnion.url,
      });
    } else {
      form.resetFields();
    }
  }, [editingUnion, form]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      if (editingUnion) {
        await updateUnion({
          id: editingUnion.id,
          data: values,
        }).unwrap();
        message.success("Union updated successfully");
      } else {
        await createUnion(values).unwrap();
        message.success("Union created successfully");
      }

      close();
    } catch {
      message.error("Failed to save Union");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={editingUnion ? "Edit Union" : "Create Union"}
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
              name="upazilla_id"
              label="Upazilla ID"
              rules={[{ required: true, message: "Please enter Upazilla ID" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Union Name"
              rules={[{ required: true, message: "Please enter Union name" }]}
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

export default UnionEditCreateModal;