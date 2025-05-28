"use client";
import React from "react";
import { Division } from "@/types";
import { Modal, Form, Input, message, Row, Col, Select } from "antd";
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

  // Static country data (no API dependency)
  const staticCountries = [
    { id: 172, name: "Bangladesh" },
    { id: 116, name: "India" },
    { id: 146, name: "Pakistan" },
    { id: 231, name: "Sri Lanka" },
    { id: 198, name: "Nepal" },
  ];

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
    } catch (error) {
      message.error("Failed to save Division");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sort countries by ID to ensure "ID-wise" display
  const sortedCountries = [...staticCountries].sort((a, b) => a.id - b.id);

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
              label="Country"
              rules={[{ required: true, message: "Please select a country" }]}
            >
              <Select
                placeholder="Select a country"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent={!sortedCountries.length ? "No data" : null}
              >
                {sortedCountries.map((country: { id: number; name: string }) => (
                  <Select.Option
                    key={country.id}
                    value={country.id}
                    label={country.name}
                  >
                    {country.name}
                  </Select.Option>
                ))}
              </Select>
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