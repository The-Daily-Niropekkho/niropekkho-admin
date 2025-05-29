"use client";
import {
  useCreateCountryMutation,
  useUpdateCountryMutation,
} from "@/redux/features/zone/countryApi";
import { Country } from "@/types";
import { Col, Form, Input, message, Modal, Row } from "antd";
import React from "react";

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
              name="country_code"
              label="Country Code"
              rules={[{ required: true, message: "Please enter Country code" }]}
            >
              <Input placeholder="Enter Country Code" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Country Name"
              rules={[{ required: true, message: "Please enter Country name" }]}
            >
              <Input placeholder="Enter Country Name"/>
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
              <Input placeholder="Enter Bangla Name"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="flag_url"
              label="Flag URL"
              rules={[
                { required: true, message: "Please enter URL" },
                { type: "url", message: "Please enter a valid URL" },
              ]}
            >
              <Input placeholder="eg: https://flagcdn.com/w320/bn.png"/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CountryEditCreateModal;