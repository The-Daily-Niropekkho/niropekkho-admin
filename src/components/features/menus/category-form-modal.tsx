"use client"

import { useTheme } from "@/components/theme-context"
import { Form, Input, Modal, Switch } from "antd"
import { useEffect } from "react"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  status: string
  postCount: number
}

interface CategoryFormModalProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (values: Omit<Category, "id" | "postCount">) => void
  initialValues?: Category | null
  title: string
}

const CategoryFormModal = ({ visible, onCancel, onSubmit, initialValues, title }: CategoryFormModalProps) => {
  const [form] = Form.useForm()
  const { isDark } = useTheme()

  useEffect(() => {
    if (visible) {
      form.resetFields()
      if (initialValues) {
        form.setFieldsValue(initialValues)
      }
    }
  }, [visible, initialValues, form])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values)
      form.resetFields()
    })
  }

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? "Update" : "Create"}
      afterClose={() => form.resetFields()}
      className={isDark ? "dark-theme-modal" : ""}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          initialValues || {
            status: "active",
          }
        }
      >
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: "Please enter category name" }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            { required: true, message: "Please enter slug" },
            {
              pattern: /^[a-z0-9-]+$/,
              message: "Slug can only contain lowercase letters, numbers, and hyphens",
            },
          ]}
        >
          <Input placeholder="Enter slug (e.g. technology-news)" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Enter category description" />
        </Form.Item>

        <Form.Item name="status" label="Status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CategoryFormModal
