"use client";
import React from "react";
import { District } from "@/types";
import { Modal, Form, Input, message, Row, Col } from "antd";
import {
  useCreateDistrictMutation,
  useUpdateDistrictMutation,
} from "@/redux/features/zone/districtsApi";

interface DistrictEditCreateModalProps {
  editingDistrict: District | null;
  open: boolean;
  close: () => void;
}

const DistrictEditCreateModal: React.FC<DistrictEditCreateModalProps> = ({
  editingDistrict,
  open,
  close,
}) => {
  const [form] = Form.useForm();
  const [createDistrict] = useCreateDistrictMutation();
  const [updateDistrict] = useUpdateDistrictMutation();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (editingDistrict) {
      form.setFieldsValue({
        country_id: editingDistrict.country_id,
        name: editingDistrict.name,
        bn_name: editingDistrict.bn_name,
        url: editingDistrict.url,
      });
    } else {
      form.resetFields();
    }
  }, [editingDistrict, form]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      if (editingDistrict) {
        await updateDistrict({
          id: editingDistrict.id,
          data: values,
        }).unwrap();
        message.success("District updated successfully");
      } else {
        await createDistrict(values).unwrap();
        message.success("District created successfully");
      }

      close();
    } catch {
      message.error("Failed to save district");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={editingDistrict ? "Edit District" : "Create District"}
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
              label="District Name"
              rules={[{ required: true, message: "Please enter district name" }]}
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

export default DistrictEditCreateModal;