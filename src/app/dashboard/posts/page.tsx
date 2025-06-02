/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PostEditCreateModal from "@/components/features/posts/post-edit-create-modal";
import { useTheme } from "@/components/theme-context";
import Table from "@/components/ui/data-table";
import CustomImage from "@/components/ui/image";
import { useDebounced } from "@/hooks/use-debounce";
import {
    useDeletePostMutation,
    useGetAllPostsQuery,
} from "@/redux/features/posts/postsApi";
import { Post, TArgsParam, TError, TFileDocument } from "@/types";
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
    Tooltip
} from "antd";
import { useState } from "react";

export default function PostsPage() {
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const { isDark } = useTheme();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    const [postFile, setPostFile] = useState<TFileDocument | undefined>(
        undefined
    );

    const query: TArgsParam = {
        page,
        limit,
        sortBy,
        sortOrder,
    };

    const debouncedSearchTerm = useDebounced({
        searchQuery: searchText,
        delay: 600,
    });
    if (debouncedSearchTerm) query["searchTerm"] = debouncedSearchTerm;

    const { data: posts, isLoading, isFetching } = useGetAllPostsQuery(query);
    const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

    const handleEdit = (record: Post) => {
        setEditingPost(record);
        setPostFile(record.file ?? undefined);
        setIsModalVisible(true);
    };

    const handleDelete = async (record: Post) => {
        try {
            await deletePost(record?.id).unwrap();
            message.success(`${record?.head_line} has been deleted`);
        } catch (error) {
            message.error(
                (error as TError).data?.message || "Failed to delete post"
            );
        }
    };

    const handleCreate = () => {
        setEditingPost(null);
        setPostFile(undefined);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: "Thumbnail",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (media: TFileDocument) => <CustomImage src={media} width={80} height={80} />
        },
        {
            title: "File Type",
            dataIndex: "file_type",
            key: "file_type",
        },
        {
            title: "Media Type",
            dataIndex: "type",
            key: "type",
        },
        // {
        //     title: "Headline",
        //     dataIndex: "head_line",
        //     key: "head_line",
        //     sorter: true,
        // },
        // {
        //     title: "Slug",
        //     dataIndex: "slug",
        //     key: "slug",
        // },
        {
            title: "URL",
            dataIndex: "url",
            key: "url",
            render: (url: string) =>
                url ? (
                    <a href={url} target="_blank" rel="noreferrer">
                        {url}
                    </a>
                ) : (
                    "-"
                ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt: string) =>
                new Date(createdAt).toLocaleDateString() || "-",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Post) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Delete this post?"
                            onConfirm={() => handleDelete(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                disabled={isDeleting}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
                Posts
            </h1>
            <p style={{ color: isDark ? "#aaa" : "#555" }}>
                Manage all your video/photo posts
            </p>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card style={{ borderRadius: 8 }}>
                        <div
                            style={{
                                marginBottom: 16,
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Input
                                placeholder="Search posts"
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setPage(1);
                                }}
                                style={{ width: 250 }}
                            />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleCreate}
                            >
                                Add Post
                            </Button>
                        </div>

                        <Table<Post>
                            data={posts?.data || []}
                            meta={posts?.meta || {}}
                            columns={columns}
                            isLoading={isLoading}
                            isFetching={isFetching}
                            page={page}
                            limit={limit}
                            setPage={setPage}
                            setLimit={setLimit}
                            setSortBy={setSortBy}
                            setSortOrder={setSortOrder}
                        />
                    </Card>
                </Col>
            </Row>

            <PostEditCreateModal
                open={isModalVisible}
                editingPost={editingPost}
                postFile={postFile}
                setPostFile={setPostFile}
                close={() => setIsModalVisible(false)}
            />
        </>
    );
}
