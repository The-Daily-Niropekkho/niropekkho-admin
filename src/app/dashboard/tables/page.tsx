"use client"
import { useState } from "react"
import { Card, Table, Button, Input, Space, Tag, Modal, message } from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  FilterOutlined,
} from "@ant-design/icons"
import { useTheme } from "@/components/theme-context"

export default function TablesPage() {
  const [searchText, setSearchText] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Sample data
  const dataSource = Array.from({ length: 100 }, (_, i) => ({
    key: i.toString(),
    id: `PRD-${1000 + i}`,
    name: `Product ${i + 1}`,
    category: ["Electronics", "Clothing", "Home", "Books", "Sports"][Math.floor(Math.random() * 5)],
    price: (Math.random() * 1000).toFixed(2),
    stock: Math.floor(Math.random() * 100),
    status: ["In Stock", "Low Stock", "Out of Stock"][Math.floor(Math.random() * 3)],
    created: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
  }))

  const filteredData = dataSource.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.id.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase()),
  )

  const handleEdit = (record: any) => {
    message.info(`Editing ${record.name}`)
  }

  const handleDelete = (record: any) => {
    setSelectedRecord(record)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    message.success(`${selectedRecord.name} has been deleted`)
    setIsDeleteModalOpen(false)
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: any, b: any) => a.id.localeCompare(b.id),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Electronics", value: "Electronics" },
        { text: "Clothing", value: "Clothing" },
        { text: "Home", value: "Home" },
        { text: "Books", value: "Books" },
        { text: "Sports", value: "Sports" },
      ],
      onFilter: (value: any, record: any) => record.category.indexOf(value) === 0,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: string) => `$${price}`,
      sorter: (a: any, b: any) => Number.parseFloat(a.price) - Number.parseFloat(b.price),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a: any, b: any) => a.stock - b.stock,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = ""
        if (status === "In Stock") {
          color = "success"
        } else if (status === "Low Stock") {
          color = "warning"
        } else {
          color = "error"
        }
        return <Tag color={color}>{status}</Tag>
      },
      filters: [
        { text: "In Stock", value: "In Stock" },
        { text: "Low Stock", value: "Low Stock" },
        { text: "Out of Stock", value: "Out of Stock" },
      ],
      onFilter: (value: any, record: any) => record.status.indexOf(value) === 0,
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
      sorter: (a: any, b: any) => new Date(a.created).getTime() - new Date(b.created).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: string, record: any) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: isDark ? "#fff" : "#000",
          }}
        >
          Data Tables
        </h1>
        <p style={{ color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.45)" }}>
          Manage and organize your data with advanced filtering and sorting options.
        </p>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          background: isDark ? "#1f1f1f" : "#fff",
        }}
      >
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <Space wrap>
            <Input
              placeholder="Search products"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Button icon={<FilterOutlined />}>Filter</Button>
          </Space>
          <Space wrap>
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Product
            </Button>
          </Space>
        </div>
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        {selectedRecord && (
          <p>
            Are you sure you want to delete <strong>{selectedRecord.name}</strong>? This action cannot be undone.
          </p>
        )}
      </Modal>
    </>
  )
}
