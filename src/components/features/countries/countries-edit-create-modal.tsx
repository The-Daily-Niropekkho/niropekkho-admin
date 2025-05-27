"use client";
import React from "react";
import { Country } from "@/types";
import { Modal, Form, Input, message, Row, Col } from "antd";
import {
  useCreateCountryMutation,
  useUpdateCountryMutation,
} from "@/redux/features/zone/countryApi";

interface CountryEditCreateModalProps {
  editingCountry: Country | null;
  open: boolean;
  close: () => void;
}

const CountryEditCreateModal: React.FC<CountryEditCreateModalProps> = ({
  editingCountry,
  open,
  close,
}) => {
  const [form] = Form.useForm();
  const [createCountry] = useCreateCountryMutation();
  const [updateCountry] = useUpdateCountryMutation();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (editingCountry) {
      form.setFieldsValue({
    
        name: editingCountry.name,
        bn_name: editingCountry.bn_name,
        flag_url: editingCountry.flag_url,
        country_code: editingCountry.country_code,
      });
    } else {
      form.resetFields();
    }
  }, [editingCountry, form]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      if (editingCountry) {
        await updateCountry({
          id: editingCountry.id,
          data: values,
        }).unwrap();
        message.success("Country updated successfully");
      } else {
        await createCountry(values).unwrap();
        message.success("Country created successfully");
      }

      close();
    } catch {
      message.error("Failed to save Country");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={editingCountry ? "Edit Country" : "Create Country"}
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
              label="Country Name"
              rules={[{ required: true, message: "Please enter Country name" }]}
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

export default CountryEditCreateModal;