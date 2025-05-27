/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import {
  useDeleteDistrictMutation,
  useGetAllDistrictsQuery,
} from "@/redux/features/zone/districtsApi";
import { District } from "@/types";
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
import DistrictEditCreateModal from "@/components/features/districts/district-edit-create-modal";

export default function DistrictsPage() {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);

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
    data: districts,
    isLoading: isDistrictLoading,
    isFetching: isDistrictFetching,
  } = useGetAllDistrictsQuery(query);

  const [deleteDistrict, { isLoading: isDeleting }] =
    useDeleteDistrictMutation();

  const handleEdit = (record: District) => {
    setEditingDistrict(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record: District) => {
    try {
      await deleteDistrict(record?.id).unwrap();
      message.success(`${record?.name} has been deleted`);
    } catch (error) {
      message.error("Failed to delete district");
      console.error("Delete failed:", error);
    }
  };

  const handleCreate = () => {
    setEditingDistrict(null);
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
      render: (text: string) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "success" : "default"}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "ACTIVE" },
        { text: "Inactive", value: "INACTIVE" },
      ],
      onFilter: (value: any, record: District) => record.status === value,
    },
    {
      title: "Country ID",
      dataIndex: "country_id",
      key: "country_id",
      sorter: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (createdAt: string) =>
        new Date(createdAt).toLocaleDateString() || "-",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: true,
      render: (updatedAt: string) =>
        new Date(updatedAt).toLocaleDateString() || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: District) => (
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
              title="Are you sure you want to delete this district?"
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
          Districts
        </h1>
        <p
          style={{
            color: isDark
              ? "rgba(255, 255, 255, 0.65)"
              : "rgba(0, 0, 0, 0.45)",
          }}
        >
          Manage districts for organizing your content
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
                  placeholder="Search districts"
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
                  Add District
                </Button>
              </Space>
            </div>

            <Table<District>
              data={districts?.data || []}
              meta={districts?.meta ?? {}}
              columns={columns}
              isLoading={isDistrictLoading}
              page={page}
              limit={limit}
              setLimit={setLimit}
              setPage={setPage}
              setSortBy={setSortBy}
              setStatus={setStatus}
              setSortOrder={setSortOrder}
              isFetching={isDistrictFetching}
            />
          </Card>
        </Col>
      </Row>
      <DistrictEditCreateModal
        editingDistrict={editingDistrict}
        open={isModalVisible}
        close={() => setIsModalVisible(false)}
      />
    </>
  );
}