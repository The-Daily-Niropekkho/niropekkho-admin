"use client";
import React from "react";
import { Union, Upazilla } from "@/types";
import { Modal, Form, Input, message, Row, Col, Select } from "antd";
import {
  useCreateUnionMutation,
  useUpdateUnionMutation,
} from "@/redux/features/zone/unionApi";
import { useGetAllUpazillasQuery } from "@/redux/features/zone/upazillaApi";

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

  // Fetch upazillas for the dropdown
  const { data: upazillas, isLoading: isUpazillasLoading, error: upazillasError } = useGetAllUpazillasQuery({});

  // Log API response for debugging
  React.useEffect(() => {
    if (upazillas) {
      console.log("Upazillas API Response:", upazillas);
    }
    if (upazillasError) {
      console.error("Error fetching upazillas:", upazillasError);
    }
  }, [upazillas, upazillasError]);

  // Set form values when editingUnion changes
  React.useEffect(() => {
    if (editingUnion) {
      form.setFieldsValue({
        upazilla_id: editingUnion.upazilla_id,
        name: editingUnion.name,
        bn_name: editingUnion.bn_name,
        url: editingUnion.url,
      });
    } else {
      form.resetFields();
    }
  }, [editingUnion, form]);

  // Handle upazilla selection to auto-fill name and bn_name
  const handleUpazillaChange = (upazillaId: number) => {
    const selectedUpazilla = upazillas?.data?.find((upazilla: Upazilla) => upazilla.id === upazillaId);
    if (selectedUpazilla) {
      form.setFieldsValue({
        name: selectedUpazilla.name,
        bn_name: selectedUpazilla.bn_name,
      });
    }
  };

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
    } catch (error) {
      message.error("Failed to save Union");
      console.error("Error:", error);
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
              label="Upazilla"
              rules={[{ required: true, message: "Please select an Upazilla" }]}
            >
              <Select
                placeholder="Select an Upazilla"
                loading={isUpazillasLoading}
                disabled={isUpazillasLoading}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                onChange={handleUpazillaChange}
                notFoundContent={
                  upazillasError ? "Error loading upazillas" :
                  !upazillas?.data || upazillas?.data?.length === 0 ? "No data" : null
                }
              >
                {upazillas?.data?.map((upazilla: { id: number; name: string }) => (
                  <Select.Option
                    key={upazilla.id}
                    value={upazilla.id}
                    label={upazilla.name}
                  >
                    {upazilla.name}
                  </Select.Option>
                ))}
              </Select>
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