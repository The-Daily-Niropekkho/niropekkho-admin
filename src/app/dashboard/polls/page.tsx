/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PollEditCreateModal from "@/components/features/polls/poll-edit-create-modal";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import {
  useDeletePollMutation,
  useGetAllPollsQuery,
} from "@/redux/features/polls/pollsApi";
import { Poll, TFileDocument } from "@/types";
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
import { useState } from "react";

export default function PollsPage() {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [status, setStatus] = useState<string | undefined>(undefined);

  const [pollImage, setPollImage] = useState<TFileDocument | undefined>(undefined);

  const query = [
    { name: "searchTerm", value: searchText },
    { name: "limit", value: limit },
    { name: "page", value: page },
    { name: "sortBy", value: sortBy },
    { name: "sortOrder", value: sortOrder },
    { name: "status", value: status },
  ];

  const {
    data: polls,
    isLoading: isPollLoading,
    isFetching: isPollFetching,
  } = useGetAllPollsQuery(query);

  const [deletePoll, { isLoading: isDeleting }] = useDeletePollMutation();

  const handleEdit = (record: Poll) => {
    setEditingPoll(record);
    setPollImage(
      record.banner_image
        ? {
          url: record.banner_image.url,
          originalUrl: record.banner_image.originalUrl ?? "",
          filename: record.banner_image.filename,
          modifyFileName: record.banner_image.modifyFileName,
          mimetype: record.banner_image.mimetype,
          platform: record.banner_image.platform,
          path: record.banner_image.path,
          cdn: record.banner_image.cdn,
          size: record.banner_image.size,
          // Add any other properties from TFileDocument as needed
          ...(record.banner_image as any),
        }
        : undefined
    );
    setIsModalVisible(true);
  };

  const handleDelete = async (record: Poll) => {
    try {
      await deletePoll(record?.id).unwrap();
      message.success(`${record?.title} has been deleted`);
    } catch (error) {
      message.error("Failed to delete poll");
      console.error("Delete failed:", error);
    }
  };

  const handleCreate = () => {
    setEditingPoll(null);
    setPollImage(undefined);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
      render: (text: string) => (
        <div style={{ fontWeight: 500 }}>{text}</div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "-",
    },
    {
      title: "Options",
      dataIndex: "options",
      key: "options",
      render: (options: any[]) => (
        <div>
          {options?.map((opt, index) => (
            <Tag key={index} style={{ marginBottom: 4 }}>
              {opt.label}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "publish" ? "success" : "default"}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Published", value: "publish" },
        { text: "Draft", value: "draft" },
      ],
      onFilter: (value: any, record: Poll) => record.status === value,
    },
    {
      title: "Total Votes",
      dataIndex: "totalVotes",
      key: "totalVotes",
      sorter: true,
      render: (votes: number) => votes || 0,
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
      render: (_: any, record: Poll) => (
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
              title="Are you sure you want to delete this poll?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
              placement="left"
              disabled={isDeleting}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
                disabled={isDeleting}
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
          Polls
        </h1>
        <p
          style={{
            color: isDark
              ? "rgba(255, 255, 255, 0.65)"
              : "rgba(0, 0, 0, 0.45)",
          }}
        >
          Manage polls for engaging with your audience
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
                  placeholder="Search polls"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setPage(1);
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
                  Add Poll
                </Button>
              </Space>
            </div>

            <Table<Poll>
              data={polls?.data || []}
              meta={polls?.meta ?? {}}
              columns={columns}
              isLoading={isPollLoading}
              page={page}
              limit={limit}
              setLimit={setLimit}
              setPage={setPage}
              setSortBy={setSortBy}
              setStatus={setStatus}
              setSortOrder={setSortOrder}
              isFetching={isPollFetching}
            />
          </Card>
        </Col>
      </Row>
      <PollEditCreateModal
        editingPoll={editingPoll}
        open={isModalVisible}
        pollImage={pollImage as any}
       setPollImage={setPollImage as any}
        close={() => setIsModalVisible(false)}
      />
    </>
  );
}