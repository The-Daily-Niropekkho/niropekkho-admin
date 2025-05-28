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
  Typography,

} from "antd";
import DistrictEditCreateModal from "@/components/features/districts/district-edit-create-modal";
import Link from "next/link";

const { Title, Text } = Typography;

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

  const [deleteDistrict, { isLoading: isDeleting }] = useDeleteDistrictMutation();

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
        <div style={{ fontWeight: 500, color: isDark ? "#fff" : "#1a1a1a" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Bangla Name",
      dataIndex: "bn_name",
      key: "bn_name",
      sorter: true,
      render: (text: string) => (
        <div style={{ color: isDark ? "#d9d9d9" : "#595959" }}>{text}</div>
      ),
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
                onFilter: (value: any, record: District) => record.status === value,
            },
    {
      title: "Division ID",
      dataIndex: "division_id",
      key: "division_id",
      sorter: true,
      hidden: true,
    },
    {
      title: "Division Name",
      dataIndex: "division_id",
      key: "division_name",
      sorter: true,
      render: (division_id: number) => {
        const divisionMap: { [key: number]: string } = {
          1: "চট্টগ্রাম", // Chattogram
          2: "রাজশাহী", // Rajshahi
          3: "খুলনা", // Khulna
          4: "বরিশাল", // Barisal
          5: "সিলেট", // Sylhet
          6: "ঢাকা", // Dhaka
          7: "রংপুর", // Rangpur
          8: "ময়মনসিংহ", // Mymensingh
        };
        return (
          <div style={{ color: isDark ? "#d9d9d9" : "#595959" }}>
            {divisionMap[division_id] || "-"}
          </div>
        );
      },
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
      render: (_: any, record: District) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
              style={{
                color: isDark ? "#40a9ff" : "#1890ff",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
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
                style={{
                  color: isDark ? "#ff4d4f" : "#f5222d",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = isDark ? "rgba(255, 77, 79, 0.2)" : "rgba(245, 34, 45, 0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div >
      <div style={{ marginBottom: "24px" }}>
        <Title
          level={3}
          style={{
            fontWeight: 700,
            color: isDark ? "#fff" : "#1a1a1a",
            marginBottom: "8px",
          }}
        >
          Districts
        </Title>
        <Text
          style={{
            color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.45)",
            fontSize: "14px",
          }}
        >
          Manage districts for organizing your content
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              boxShadow: isDark ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.1)",
              background: isDark ? "#1f1f1f" : "#fff",
              transition: "all 0.3s",
            }}
            styles={{
              body: {
                padding: "24px",
              },
            }}
          >
            <div
              style={{
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <Input
                placeholder="Search districts"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setPage(1); // Reset to first page on search
                }}
                style={{
                  width: "300px",
                  borderRadius: "8px",
                  background: isDark ? "#2d2d2d" : "#f5f5f5",
                  transition: "all 0.3s",
                }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
                style={{
                  borderRadius: "8px",
                  padding: "0 20px",
                  background: isDark ? "#40a9ff" : "#1890ff",
                  border: "none",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = isDark ? "#69b1ff" : "#40a9ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = isDark ? "#40a9ff" : "#1890ff")
                }
              >
                Add District
              </Button>
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
              //setMediaType={setMediaType}
            />
          </Card>
        </Col>
      </Row>
      <DistrictEditCreateModal
        editingDistrict={editingDistrict}
        open={isModalVisible}
        close={() => setIsModalVisible(false)}
      />
    </div>
  );
}