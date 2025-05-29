"use client";
import { useGetAllCountriesQuery } from "@/redux/features/zone/countryApi";
import {
  useCreateDivisionMutation,
  useUpdateDivisionMutation,
} from "@/redux/features/zone/divisionApi";
import { Country, Division } from "@/types";
import { Col, Form, Input, message, Modal, Row, Select } from "antd";
import React from "react";

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

  const { data: countries, isLoading: isCountryLoading } = useGetAllCountriesQuery({});

  React.useEffect(() => {
    if (editingDivision) {
      form.setFieldsValue({
        country_id: editingDivision.country_id, // Ensure this matches the server's expected field
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

      // Ensure country_id is sent as the correct type (e.g., numeric ID or code)
      const payload = {
        ...values,
        country_id: values.country_id, // Adjust if server expects a different field name (e.g., country_code)
      };

      if (editingDivision) {
        await updateDivision({
          id: editingDivision.id,
          data: payload,
        }).unwrap();
        message.success("Division updated successfully");
      } else {
        await createDivision(payload).unwrap();
        message.success("Division created successfully");
      }

      close();
    } catch (error: unknown) {
      // Enhanced error handling to log server response
      let errorMessage = "Failed to save Division";
      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string } }).data === "object" &&
        (error as { data?: { message?: string } }).data !== null &&
        "message" in (error as { data?: { message?: string } }).data!
      ) {
        errorMessage =
          ((error as { data?: { message?: string } }).data as { message?: string }).message ||
          "Failed to save Division";
      }
      message.error(errorMessage);
      console.error("Error:", error);
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
              label="Country"
              rules={[{ required: true, message: "Please select a country" }]}
            >
              <Select
                placeholder="Select a country"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                disabled={isCountryLoading}
              >
                {countries?.data?.map((country: Country) => (
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