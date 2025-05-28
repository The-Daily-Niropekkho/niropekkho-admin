/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import {
  useDeleteUpazillaMutation,
  useGetAllUpazillasQuery,
} from "@/redux/features/zone/upazillaApi";
import { Upazilla } from "@/types";
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
import UpazillaEditCreateModal from "@/components/features/upazillas/upazilla-edit-create-modal";
import Link from "next/link";

export default function UpazillasPage() {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUpazilla, setEditingUpazilla] = useState<Upazilla | null>(null);

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
    data: upazillas,
    isLoading: isUpazillaLoading,
    isFetching: isUpazillaFetching,
  } = useGetAllUpazillasQuery(query);

  const [deleteUpazilla, { isLoading: isDeleting }] =
    useDeleteUpazillaMutation();

  const handleEdit = (record: Upazilla) => {
    setEditingUpazilla(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record: Upazilla) => {
    try {
      await deleteUpazilla(record?.id).unwrap();
      message.success(`${record?.name} has been deleted`);
    } catch (error) {
      message.error("Failed to delete upazilla");
      console.error("Delete failed:", error);
    }
  };

  const handleCreate = () => {
    setEditingUpazilla(null);
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
      title: "District ID",
      dataIndex: "district_id",
      key: "district_id",
      sorter: true,
      hidden: true
    },
    {
      title:"District Name",
      dataIndex:"district_id",
      key: "district_id",
      render: (division_id: number) => {
        const divisionMap: { [key: number]: string } = {
  1:  "কুমিল্লা",         // Cumilla
  2:  "ফেনী",             // Feni
  3:  "ব্রাহ্মণবাড়িয়া",   // Brahmanbaria
  4:  "রাঙ্গামাটি",        // Rangamati
  5:  "নোয়াখালী",        // Noakhali
  6:  "চাঁদপুর",           // Chandpur
  7:  "লক্ষ্মীপুর",        // Lakshmipur
  8:  "চট্টগ্রাম",         // Chattogram
  9:  "কক্সবাজার",        // Cox’s Bazar
  10: "খাগড়াছড়ি",        // Khagrachhari
  11: "বান্দরবান",        // Bandarban

  12: "সিরাজগঞ্জ",        // Sirajganj
  13: "পাবনা",            // Pabna
  14: "বগুড়া",            // Bogura
  15: "রাজশাহী",         // Rajshahi
  16: "নাটোর",           // Natore
  17: "জয়পুরহাট",        // Joypurhat
  18: "চাঁপাইনবাবগঞ্জ",   // Chapainawabganj
  19: "নওগাঁ",            // Naogaon
  20: "যশোর",            // Jessore
  21: "সাতক্ষীরা",       // Satkhira
  22: "মেহেরপুর",        // Meherpur
  23: "নড়াইল",           // Narail
  24: "চুয়াডাঙ্গা",       // Chuadanga
  25: "কুষ্টিয়া",         // Kushtia
  26: "মাগুরা",           // Magura
  27: "খুলনা",            // Khulna
  28: "বাগেরহাট",         // Bagerhat
  29: "ঝিনাইদহ",         // Jhenaidah
  30: "ঝালকাঠি",         // Jhalokati
  31: "পটুয়াখালী",       // Patuakhali
  32: "পিরোজপুর",        // Pirojpur
  33: "বরিশাল",          // Barishal
  34: "ভোলা",            // Bhola
  35: "বরগুনা",          // Barguna

  36: "সিলেট",           // Sylhet
  37: "মৌলভীবাজার",     // Maulvibazar
  38: "হবিগঞ্জ",          // Habiganj
  39: "সুনামগঞ্জ",       // Sunamganj

  40: "নরসিংদী",        // Narsingdi
  41: "গাজীপুর",         // Gazipur
  42: "শরিয়তপুর",       // Shariatpur
  43: "নারায়ণগঞ্জ",      // Narayanganj
  44: "টাঙ্গাইল",         // Tangail
  45: "কিশোরগঞ্জ",      // Kishoreganj
  46: "মানিকগঞ্জ",       // Manikganj
  47: "ঢাকা",            // Dhaka
  48: "মুন্সিগঞ্জ",       // Munshiganj
  49: "রাজবাড়ী",         // Rajbari
  50: "মাদারীপুর",       // Madaripur
  51: "গোপালগঞ্জ",       // Gopalganj
  52: "ফরিদপুর",         // Faridpur

  53: "পঞ্চগড়",         // Panchagarh
  54: "দিনাজপুর",        // Dinajpur
  55: "লালমনিরহাট",     // Lalmonirhat
  56: "নীলফামারী",      // Nilphamari
  57: "গাইবান্ধা",       // Gaibandha
  58: "ঠাকুরগাঁও",       // Thakurgaon
  59: "রংপুর",          // Rangpur
  60: "কুড়িগ্রাম",       // Kurigram
  61: "শেরপুর",          // Sherpur
  62: "ময়মনসিংহ",       // Mymensingh
  63: "জামালপুর",        // Jamalpur
  64: "নেত্রকোণা"        // Netrokona
        };
        return (
          <div style={{ color: isDark ? "#d9d9d9" : "#595959" }}>
            {divisionMap[division_id] || "-"}
          </div>
        );
      },
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
                        onFilter: (value: any, record: Upazilla) => record.status === value,
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
      render: (_: any, record: Upazilla) => (
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
              title="Are you sure you want to delete this upazilla?"
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
          Upazillas
        </h1>
        <p
          style={{
            color: isDark
              ? "rgba(255, 255, 255, 0.65)"
              : "rgba(0, 0, 0, 0.45)",
          }}
        >
          Manage upazillas for organizing your content
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
                  placeholder="Search upazillas"
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
                  Add Upazilla
                </Button>
              </Space>
            </div>

            <Table<Upazilla>
              data={upazillas?.data || []}
              meta={upazillas?.meta ?? {}}
              columns={columns}
              isLoading={isUpazillaLoading}
              page={page}
              limit={limit}
              setLimit={setLimit}
              setPage={setPage}
              setSortBy={setSortBy}
              setStatus={setStatus}
              setSortOrder={setSortOrder}
              isFetching={isUpazillaFetching}
            />
          </Card>
        </Col>
      </Row>
      <UpazillaEditCreateModal
        editingUpazilla={editingUpazilla}
        open={isModalVisible}
        close={() => setIsModalVisible(false)}
      />
    </>
  );
}