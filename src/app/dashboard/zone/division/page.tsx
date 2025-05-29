/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import {
  useDeleteDivisionMutation,
  useGetAllDivisionsQuery,
} from "@/redux/features/zone/divisionApi";

import { Division } from "@/types";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Popconfirm,
  Row,
  Space,
  Tag,
  Tooltip,
} from "antd";
import DivisionEditCreateModal from "@/components/features/divisions/divisions-edit-create-modal";
import Link from "next/link";

export default function DivisionsPage() {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [status, setStatus] = useState<string | undefined>(undefined);

  const query = [
    { name: "searchTerm", value: searchText },
    { name: "limit", value: limit },
    { name: "page", value: page },
    { name: "sortBy", value: sortBy },
    { name: "sortOrder", value: sortOrder },
    { name: "status", value: status },
  ];

  const {
    data: Divisions,
    isLoading: isDivisionLoading,
    isFetching: isDivisionFetching,
  } = useGetAllDivisionsQuery(query);

  

  const [deleteDivision, { isLoading: isDeleting }] =
    useDeleteDivisionMutation();

  const handleEdit = (record: Division) => {
    setEditingDivision(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record: Division) => {
    try {
      await deleteDivision(record?.id).unwrap();
      message.success(`${record?.name} has been deleted`);
    } catch (error) {
      message.error("Failed to delete Division");
      console.error("Delete failed:", error);
    }
  };

  const handleCreate = () => {
    setEditingDivision(null);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text: string) => (
        <div style={{ fontWeight: 500 }}>{text}</div>
      ),
    },
    {
      title: "Bangla Name",
      dataIndex: "bn_name",
      key: "bn_name",
      sorter: true,
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (text: string) =>
        text ? (
          <Link
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: isDark ? "#40a9ff" : "#1890ff",
              textDecoration: "none",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = isDark ? "#69b1ff" : "#40a9ff")}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = isDark ? "#40a9ff" : "#1890ff")}
          >
            {text}
          </Link>
        ) : (
          <div style={{ color: isDark ? "#b3b3b3" : "#8c8c8c" }}>-</div>
        ),
    },
    {
                    title: "Status",
                    dataIndex: "status",
                    key: "status",
                    render: (status: string) => (
                        <Tag color={status === "active" ? "success" : "default"}>
                            {status.toUpperCase()}
                        </Tag>
                    ),
                    filters: [
                        { text: "Active", value: "active" },
                        { text: "Inactive", value: "inactive" },
                    ],
                    onFilter: (value: any, record: Division) => record.status === value,
                },
    {
      title: "Country ID",
      dataIndex: "country_id",
      key: "country_id",
      sorter: true,
      hidden: true,
    },
    {
      title: "Country Name",
      dataIndex: "country_id",
      key: "country_id",
      sorter: true,
      render: (country_id: number) => {
        const divisionMap: { [key: number]: string } = {
          172: "বাংলাদেশ"
        };
        return (
          <div style={{ color: isDark ? "#d9d9d9" : "#595959" }}>
            {divisionMap[country_id] || "-"}
          </div>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (createdAt: string) =>
        new Date(createdAt).toLocaleDateString() || "-",
      hidden: true,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: true,
      render: (updatedAt: string) =>
        new Date(updatedAt).toLocaleDateString() || "-",
      hidden: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Division) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this Division?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
              placement="left"
              disabled={record.is_deleted || isDeleting}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
                disabled={record.is_deleted || isDeleting}
                loading={isDeleting}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

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
          Divisions
        </h1>
        <p
          style={{
            color: isDark
              ? "rgba(255, 255, 255, 0.65)"
              : "rgba(0, 0, 0, 0.45)",
          }}
        >
          Manage Divisions for organizing your content
        </p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            variant="borderless"
            style={{
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              background: isDark ? "#1f1f1f" : "#fff",
            }}
          >
            <div
              style={{
                marginBottom: 16,
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <Space wrap>
                <Input
                  placeholder="Search Divisions"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setPage(1); // Reset to first page on search
                  }}
                  style={{ width: 250 }}
                />
              </Space>
              <Space wrap>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  Add Division
                </Button>
              </Space>
            </div>

            <Table<Division>
              data={Divisions?.data || []}
              meta={Divisions?.meta ?? {}}
              columns={columns}
              isLoading={isDivisionLoading}
              page={page}
              limit={limit}
              setLimit={setLimit}
              setPage={setPage}
              setSortBy={setSortBy}
              setStatus={setStatus}
              setSortOrder={setSortOrder}
              isFetching={isDivisionFetching}
            />
          </Card>
        </Col>
      </Row>
      <DivisionEditCreateModal
        editingDivision={editingDivision}
        open={isModalVisible}
        close={() => setIsModalVisible(false)}
      />
    </>
  );
}