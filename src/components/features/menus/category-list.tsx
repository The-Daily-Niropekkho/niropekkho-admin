/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useTheme } from "@/components/theme-context"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { Button, Modal, Space, Table, Tag, message } from "antd"
import type { ColumnsType } from "antd/es/table"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  status: string
  postCount: number
}

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

const CategoryList = ({ categories, onEdit, onDelete }: CategoryListProps) => {
  const { isDark } = useTheme()

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone. Posts in this category will not be deleted.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        onDelete(id)
        message.success("Category deleted successfully")
      },
    })
  }

  const columns: ColumnsType<Category> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Category) => <div style={{ fontWeight: 500 }}>{text}</div>,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (text: string) => (
        <code
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: isDark ? "#374151" : "#f3f4f6",
          }}
        >
          {text}
        </code>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Posts",
      dataIndex: "postCount",
      key: "postCount",
      render: (count: number) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "success" : "default"}>{status === "active" ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Category) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ]

  return <Table columns={columns} dataSource={categories} rowKey="id" pagination={{ pageSize: 10 }} />
}

export default CategoryList
