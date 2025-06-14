import {
    useCreatePostMutation,
    useUpdatePostMutation,
} from "@/redux/features/posts/postsApi";
import { Post, TError, TFileDocument } from "@/types";
import { ObjectCleaner } from "@/utils/object-cleaner";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Select,
    message,
} from "antd";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GlobalFilePicker } from "../media/global-file-picker";

interface PostEditCreateModalProps {
    editingPost: Post | null;
    open: boolean;
    close: () => void;
    postFile: TFileDocument | undefined;
    setPostFile: Dispatch<SetStateAction<TFileDocument | undefined>>;
}

export default function PostEditCreateModal({
    editingPost,
    open,
    close,
    postFile,
    setPostFile,
}: PostEditCreateModalProps) {
    const [openFileUpload, setOpenFileUpload] = useState(false);
    const [openThumbnailUpload, setOpenThumbnailUpload] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState<
        TFileDocument | undefined
    >(editingPost?.thumbnail ?? undefined);

    const [form] = Form.useForm();
    const [fileType, setFileType] = useState<string | undefined>(
        editingPost?.file_type
    );

    const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

    useEffect(() => {
        form.setFieldsValue({
            head_line: editingPost?.head_line,
            short_head: editingPost?.short_head,
            slug: editingPost?.slug,
            serial_number: editingPost?.homeData?.serial_number ?? 0,
            url: editingPost?.url,
            file_type: editingPost?.file_type,
            type: editingPost?.type,
            file: editingPost?.file,
            thumbnail: editingPost?.thumbnail,
        });
        setFileType(editingPost?.file_type);
        setThumbnailFile(editingPost?.thumbnail ?? undefined);
    }, [editingPost, form]);

    const handleFileSelect = (files: TFileDocument[]) => {
        const selectedFile = files[0];
        setPostFile(selectedFile);
        form.setFieldsValue({ file: selectedFile });
        setOpenFileUpload(false);
    };

    const handleThumbnailSelect = (files: TFileDocument[]) => {
        const selectedThumb = files[0];
        setThumbnailFile(selectedThumb);
        form.setFieldsValue({ thumbnail: selectedThumb });
        setOpenThumbnailUpload(false);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const postData = {
                ...values,
                file: values.file || undefined,
                url: values.url || undefined,
                serial_number: values?.serial_number || undefined,
                thumbnail: values.thumbnail || undefined,
            };

            if (fileType === "custom" && !postData.file) {
                message.warning("Please select a file.");
                return;
            }

            if (fileType !== "custom" && !postData.url) {
                message.warning("Please enter a URL.");
                return;
            }

            if (
                fileType === "custom" &&
                form.getFieldValue("type") === "video" &&
                !thumbnailFile
            ) {
                message.warning("Please upload a thumbnail for the video.");
                return;
            }

            if (editingPost) {
                const delta: Partial<Post> = {};
                for (const key in postData) {
                    if (
                        postData[key as keyof Post] !==
                        editingPost[key as keyof Post]
                    ) {
                        delta[key as keyof Post] = postData[key as keyof Post];
                    }
                }

                // 🛠 Fix: Force thumbnail comparison using ID
                const newThumb = form.getFieldValue("thumbnail");
                if (newThumb?.id !== editingPost?.thumbnail?.id) {
                    delta.thumbnail = newThumb;
                }

                if (Object.keys(delta).length > 0) {
                    const cleaner = new ObjectCleaner(delta);
                    cleaner.clean();
                    const finalData = cleaner.getResult();

                    await updatePost({
                        id: editingPost.id,
                        data: finalData,
                    }).unwrap();
                    message.success(`Post has been updated`);
                } else {
                    message.info("No changes detected");
                }
            } else {
                const clenaer = new ObjectCleaner(postData);
                clenaer.clean();
                await createPost(clenaer.getResult()).unwrap();
                message.success(`Post has been created`);
                form.resetFields();
            }

            close();
            setPostFile(undefined);
            setThumbnailFile(undefined);
        } catch (error) {
            message.warning(
                (error as TError)?.data?.message || "Failed to save post"
            );
        }
    };

    return (
        <Modal
            title={editingPost ? "Edit Post" : "Add New Post"}
            open={open}
            onOk={handleModalOk}
            onCancel={close}
            okButtonProps={{ loading: isCreating || isUpdating }}
            width={600}
        >
            <Form form={form} layout="vertical">
                {/* <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="head_line"
                            label="Headline"
                            rules={[
                                {
                                    required: false,
                                    message: "Please enter headline",
                                },
                            ]}
                        >
                            <Input placeholder="Enter headline" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="short_head" label="Short Headline">
                            <Input placeholder="Enter short headline" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="slug"
                            label="Slug"
                            rules={[
                                {
                                    required: false,
                                    message: "Please enter slug",
                                },
                            ]}
                        >
                            <Input placeholder="Enter slug" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="serial_number" label="Serial Number">
                            <Input
                                type="number"
                                placeholder="Enter serial number"
                            />
                        </Form.Item>
                    </Col>
                </Row> */}

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="file_type"
                            label="File Type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select file type",
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select file type"
                                onChange={(value) => {
                                    setFileType(value);
                                    if (value === "custom") {
                                        form.setFieldsValue({ url: undefined });
                                    } else {
                                        form.setFieldsValue({
                                            file: undefined,
                                            thumbnail: undefined,
                                        });
                                        setPostFile(undefined);
                                        setThumbnailFile(undefined);
                                    }
                                }}
                            >
                                <Select.Option value="custom">
                                    Custom
                                </Select.Option>
                                <Select.Option value="youtube">
                                    YouTube
                                </Select.Option>
                                <Select.Option value="facebook">
                                    Facebook
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="type"
                            label="Media Type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select media type",
                                },
                            ]}
                            initialValue={"video"}
                        >
                            <Select placeholder="Select media type">
                                <Select.Option value="video">
                                    Video
                                </Select.Option>
                                {/* <Select.Option value="photo">Photo</Select.Option> */}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="serial_number" label="Serial Number">
                            <Select
                                options={[
                                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                                    14, 15, 16, 17, 18, 19, 20,
                                ].map((position) => {
                                    return {
                                        label: position,
                                        value: position,
                                    };
                                })}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {fileType === "custom" ? (
                    <Form.Item name="file" label="Media File">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                            }}
                        >
                            {postFile ? (
                                postFile.file_type === "video" ? (
                                    <video
                                        width={120}
                                        height={80}
                                        controls
                                        style={{
                                            objectFit: "cover",
                                            borderRadius: 4,
                                        }}
                                    >
                                        <source
                                            src={postFile.url}
                                            type="video/mp4"
                                        />
                                        Your browser does not support the video
                                        tag.
                                    </video>
                                ) : (
                                    <Image
                                        src={postFile.url}
                                        alt="Media Preview"
                                        width={80}
                                        height={80}
                                        style={{
                                            objectFit: "cover",
                                            borderRadius: 4,
                                        }}
                                    />
                                )
                            ) : (
                                <Avatar
                                    shape="square"
                                    size={64}
                                    icon={<UserOutlined />}
                                    style={{ background: "#f0f0f0" }}
                                />
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    onClick={() => setOpenFileUpload(true)}
                                >
                                    Upload File
                                </Button>
                                {postFile && (
                                    <Button
                                        danger
                                        size="small"
                                        onClick={() => {
                                            setPostFile(undefined);
                                            form.setFieldsValue({
                                                file: undefined,
                                            });
                                        }}
                                    >
                                        Remove File
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Form.Item>
                ) : (
                    <Form.Item name="url" label="Media URL">
                        <Input placeholder="https://..." />
                    </Form.Item>
                )}

                {fileType !== "youtube" &&
                    form.getFieldValue("type") === "video" && (
                        <Form.Item name="thumbnail" label="Thumbnail Image">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                }}
                            >
                                {thumbnailFile?.originalUrl ? (
                                    <Image
                                        src={thumbnailFile.originalUrl}
                                        alt="Thumbnail Preview"
                                        width={80}
                                        height={80}
                                        style={{
                                            objectFit: "cover",
                                            borderRadius: 4,
                                        }}
                                    />
                                ) : (
                                    <Avatar
                                        shape="square"
                                        size={64}
                                        icon={<UserOutlined />}
                                        style={{ background: "#f0f0f0" }}
                                    />
                                )}

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                    }}
                                >
                                    <Button
                                        icon={<UploadOutlined />}
                                        onClick={() =>
                                            setOpenThumbnailUpload(true)
                                        }
                                    >
                                        Upload Thumbnail
                                    </Button>
                                    {thumbnailFile && (
                                        <Button
                                            danger
                                            size="small"
                                            onClick={() => {
                                                setThumbnailFile(undefined);
                                                form.setFieldsValue({
                                                    thumbnail: undefined,
                                                });
                                            }}
                                        >
                                            Remove Thumbnail
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Form.Item>
                    )}
            </Form>

            {/* Media File Picker */}
            <GlobalFilePicker
                open={openFileUpload}
                onCancel={() => setOpenFileUpload(false)}
                fileTypes={["video/mp4"]}
                // fileTypes={["image/jpeg", "image/png", "video/mp4"]}
                onSelect={handleFileSelect}
                multiple={false}
                initialSelected={postFile ? [postFile] : []}
            />

            {/* Thumbnail Picker */}
            <GlobalFilePicker
                open={openThumbnailUpload}
                onCancel={() => setOpenThumbnailUpload(false)}
                fileTypes={["image/jpeg", "image/png", "image/webp"]}
                onSelect={handleThumbnailSelect}
                multiple={false}
                initialSelected={thumbnailFile ? [thumbnailFile] : []}
            />
        </Modal>
    );
}
