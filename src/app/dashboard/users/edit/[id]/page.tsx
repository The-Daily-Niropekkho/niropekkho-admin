"use client";

import { GlobalFilePicker } from "@/components/features/media/global-file-picker";
import { useTheme } from "@/components/theme-context";
import {
    useGetSingleUserQuery,
    useUpdateUserMutation,
} from "@/redux/features/user/userApi";
import { ErrorResponse, TFileDocument } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { SerializedError } from "@reduxjs/toolkit";
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Flex,
    Form,
    Input,
    message,
    Row,
    Select,
    Space,
    Spin,
} from "antd";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FormValues {
    email: string;
    user_type: string;
    status: string;
    account_type: string;
    is_email_verified: boolean;
    first_name: string;
    last_name: string;
    nick_name?: string;
    mobile?: string;
    gender?: string;
    date_of_birth?: string;
    designation?: string;
    blood_group?: string;
    address_line_one?: string;
    zip_code?: string;
    document_type?: string;
    document_id_no?: string;
    about?: string;
    profile_image?: TFileDocument;
}

export default function EditUserPage() {
    const [form] = Form.useForm();
    const router = useRouter();
    const params = useParams();
    const userId = params.id;
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [profileImage, setProfileImage] = useState<TFileDocument | undefined>(
        undefined
    );
    const [openFileUpload, setOpenFileUploader] = useState<boolean>(false);

    // Fetch single user data
    const {
        data: user,
        isLoading: isFetching,
        error,
    } = useGetSingleUserQuery(userId, {
        skip: !userId,
    });
    const [
        updateUser,
        {
            isSuccess: isUpdateSuccess,
            isError: isUpdateError,
            error: updateError,
            isLoading: isUpdating,
            reset: resetMutation,
        },
    ] = useUpdateUserMutation();

    // State to track changed values
    const [changedValues, setChangedValues] = useState<Partial<FormValues>>({});

    type Admin = {
        first_name: string;
        last_name: string;
        nick_name?: string;
        mobile?: string;
        gender?: string;
        date_of_birth?: string;
        profile_image?: TFileDocument;
    };
    type Writer = Admin & {
        designation?: string;
        blood_group?: string;
        address_line_one?: string;
        zip_code?: string;
        document_type?: string;
        document_id_no?: string;
        about?: string;
    };

    useEffect(() => {
        if (!userId) {
            message.error("Invalid user ID");
            router.push("/dashboard");
            return;
        }

        if (error) {
            message.error("Failed to fetch user data");
            router.push("/dashboard");
            return;
        }

        if (user) {
            const userType = user.user_type as "admin" | "writer" | "moderator";
            const userDetails = user[userType];
            form.setFieldsValue({
                email: user.email,
                user_type: user.user_type,
                status: user.status,
                account_type: user.account_type,
                is_email_verified: user.is_email_verified,
                first_name: userDetails?.first_name || "",
                last_name: userDetails?.last_name || "",
                nick_name: userDetails?.nick_name || undefined,
                mobile: userDetails?.mobile || undefined,
                gender: userDetails?.gender || undefined,
                date_of_birth: userDetails?.date_of_birth
                    ? dayjs(userDetails?.date_of_birth)
                    : undefined,
                ...(userType !== "admin" && {
                    designation:
                        (userDetails as unknown as Writer)?.designation ||
                        undefined,
                    blood_group:
                        (userDetails as unknown as Writer)?.blood_group ||
                        undefined,
                    address_line_one:
                        (userDetails as unknown as Writer)?.address_line_one ||
                        undefined,
                    zip_code:
                        (userDetails as unknown as Writer)?.zip_code ||
                        undefined,
                    document_type:
                        (userDetails as unknown as Writer)?.document_type ||
                        undefined,
                    document_id_no:
                        (userDetails as unknown as Writer)?.document_id_no ||
                        undefined,
                    about:
                        (userDetails as unknown as Writer)?.about || undefined,
                }),
                profile_image:
                    (userDetails as unknown as Writer)?.profile_image ||
                    undefined,
            });
        }
    }, [userId, error, form, router, user]);

    const handleProfileImageSelect = (files: TFileDocument[]) => {
        const selectedImage = files[0];
        setProfileImage(selectedImage);
        setOpenFileUploader(false);
    };

    // Track changed values
    const onValuesChange = (newChangedValues: Partial<FormValues>) => {
        setChangedValues((prev) => ({
            ...prev,
            ...newChangedValues,
        }));
    };

    // Update form when profileImage changes
    useEffect(() => {
        if (profileImage) {
            form.setFieldsValue({ profile_image: profileImage });
            setChangedValues((prev) => ({
                ...prev,
                profile_image: profileImage,
            }));
        } else {
            form.setFieldsValue({ profile_image: undefined });
            setChangedValues((prev) => ({
                ...prev,
                profile_image: undefined,
            }));
        }
    }, [profileImage, form]);

    // Handle form submission
    const onFinish = async () => {
        if (!userId || !user) return;

        const userType = user.user_type;

        // Create payload with only changed values
        const payload = {
            id: userId,
            data: {
                authData: {
                    ...(changedValues.email && { email: changedValues.email }),
                    ...(changedValues.user_type && {
                        user_type: changedValues.user_type,
                    }),
                    ...(changedValues.status && {
                        status: changedValues.status,
                    }),
                    ...(changedValues.account_type && {
                        account_type: changedValues.account_type,
                    }),
                    ...(changedValues.is_email_verified !== undefined && {
                        is_email_verified: changedValues.is_email_verified,
                    }),
                },
                [userType]: {
                    ...(changedValues.first_name && {
                        first_name: changedValues.first_name,
                    }),
                    ...(changedValues.last_name && {
                        last_name: changedValues.last_name,
                    }),
                    ...(changedValues.nick_name !== undefined && {
                        nick_name: changedValues.nick_name || "",
                    }),
                    ...(changedValues.mobile !== undefined && {
                        mobile: changedValues.mobile || "",
                    }),
                    ...(changedValues.gender !== undefined && {
                        gender: changedValues.gender || "",
                    }),
                    ...(changedValues.date_of_birth && {
                        date_of_birth: changedValues.date_of_birth,
                    }),
                    ...(changedValues.profile_image !== undefined && {
                        profile_image: changedValues.profile_image || null,
                    }),
                    ...(userType !== "admin" && {
                        ...(changedValues.designation !== undefined && {
                            designation: changedValues.designation || "",
                        }),
                        ...(changedValues.blood_group !== undefined && {
                            blood_group: changedValues.blood_group || "",
                        }),
                        ...(changedValues.address_line_one !== undefined && {
                            address_line_one:
                                changedValues.address_line_one || "",
                        }),
                        ...(changedValues.zip_code !== undefined && {
                            zip_code: changedValues.zip_code || "",
                        }),
                        ...(changedValues.document_type !== undefined && {
                            document_type: changedValues.document_type || "",
                        }),
                        ...(changedValues.document_id_no !== undefined && {
                            document_id_no: changedValues.document_id_no || "",
                        }),
                        ...(changedValues.about !== undefined && {
                            about: changedValues.about || "",
                        }),
                        ...(changedValues.profile_image !== undefined && {
                            profile_image: changedValues.profile_image || "",
                        }),
                    }),
                },
            },
        };

        // Only send payload if there are changed values
        if (
            Object.keys(payload.data.authData).length === 0 &&
            Object.keys(payload.data[userType]).length === 0
        ) {
            message.info("No changes detected");
            return;
        }
        await updateUser(payload).unwrap();
    };

    useEffect(() => {
        if (isUpdateError) {
            const errorResponse = updateError as
                | ErrorResponse
                | SerializedError;
            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";
            resetMutation();
            message.error(errorMessage);
        } else if (isUpdateSuccess) {
            message.success(`User updated successfully`);
            resetMutation();
            router.back();
        }
    }, [isUpdateError, isUpdateSuccess, resetMutation, router, updateError]);

    if (isFetching) {
        return (
            <Flex justify="center" align="center">
                <Spin size="large" style={{ height: "100vh" }} />
            </Flex>
        );
    }

    if (!user) {
        return null; // Handled by useEffect redirect
    }

    const userType = user?.user_type;

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
                    Edit {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Update details for the selected {userType}.
                </p>
            </div>
            <Card
                variant="borderless"
                style={{
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    background: isDark ? "#1f1f1f" : "#fff",
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onValuesChange={onValuesChange}
                    initialValues={{}}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <h3 style={{ marginBottom: 16 }}>
                                Basic Information
                            </h3>
                        </Col>
                        <Col span={24}>
                            <div
                                className="flex items-center"
                                style={{ alignItems: "center", gap: 10 }}
                            >
                                <Avatar
                                    shape="square"
                                    size={64}
                                    src={fileObjectToLink(
                                        profileImage
                                            ? profileImage
                                            : (user &&
                                                  (user.user_type === "admin"
                                                      ? user.admin
                                                            ?.profile_image
                                                      : user.user_type ===
                                                        "writer"
                                                      ? user.writer
                                                            ?.profile_image
                                                      : user.user_type ===
                                                        "moderator"
                                                      ? user.moderator
                                                            ?.profile_image
                                                      : null)) ||
                                                  null
                                    )}
                                    icon={<UserOutlined />}
                                />
                                <Form.Item
                                    name="profile_image"
                                    label="Profile Image"
                                >
                                    <Button
                                        icon={<UploadOutlined />}
                                        onClick={() =>
                                            setOpenFileUploader(true)
                                        }
                                    >
                                        Upload Profile Image
                                    </Button>
                                </Form.Item>
                            </div>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        type: "email",
                                        message: "Please enter a valid email",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter email" disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="user_type"
                                label="User Type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select user type",
                                    },
                                ]}
                            >
                                <Select placeholder="Select user type" disabled>
                                    <Select.Option value="admin">
                                        Admin
                                    </Select.Option>
                                    <Select.Option value="writer">
                                        Writer
                                    </Select.Option>
                                    <Select.Option value="moderator">
                                        Moderator
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select status",
                                    },
                                ]}
                            >
                                <Select placeholder="Select status">
                                    <Select.Option value="active">
                                        Active
                                    </Select.Option>
                                    <Select.Option value="inactive">
                                        Inactive
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="is_email_verified"
                                label="Email Verified"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please select verification status",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Select verification status"
                                    disabled
                                >
                                    <Select.Option value={true}>
                                        Verified
                                    </Select.Option>
                                    <Select.Option value={false}>
                                        Not Verified
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <h3 style={{ marginBottom: 16, marginTop: 16 }}>
                                {userType.charAt(0).toUpperCase() +
                                    userType.slice(1)}{" "}
                                Information
                            </h3>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="first_name"
                                label="First Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter first name",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter first name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="last_name"
                                label="Last Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter last name",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter last name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="nick_name" label="Nick Name">
                                <Input placeholder="Enter nick name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="mobile" label="Mobile">
                                <Input placeholder="Enter mobile number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="gender" label="Gender">
                                <Select placeholder="Select gender">
                                    <Select.Option value="male">
                                        Male
                                    </Select.Option>
                                    <Select.Option value="female">
                                        Female
                                    </Select.Option>
                                    <Select.Option value="other">
                                        Other
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="date_of_birth"
                                label="Date of Birth"
                            >
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>

                        {(userType === "writer" ||
                            userType === "moderator") && (
                            <>
                                <Col span={12}>
                                    <Form.Item
                                        name="designation"
                                        label="Designation"
                                    >
                                        <Input placeholder="Enter designation" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="blood_group"
                                        label="Blood Group"
                                    >
                                        <Select placeholder="Select blood group">
                                            <Select.Option value="a_positive">
                                                A+
                                            </Select.Option>
                                            <Select.Option value="a_negative">
                                                A-
                                            </Select.Option>
                                            <Select.Option value="b_positive">
                                                B+
                                            </Select.Option>
                                            <Select.Option value="b_negative">
                                                B-
                                            </Select.Option>
                                            <Select.Option value="ab_positive">
                                                AB+
                                            </Select.Option>
                                            <Select.Option value="ab_negative">
                                                AB-
                                            </Select.Option>
                                            <Select.Option value="o_positive">
                                                O+
                                            </Select.Option>
                                            <Select.Option value="o_negative">
                                                O-
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="address_line_one"
                                        label="Address Line 1"
                                    >
                                        <Input placeholder="Enter address line 1" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="zip_code" label="ZIP Code">
                                        <Input placeholder="Enter ZIP code" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="document_type"
                                        label="Verification Type"
                                    >
                                        <Select placeholder="Select verification type">
                                            <Select.Option value="national_id_no">
                                                National ID
                                            </Select.Option>
                                            <Select.Option value="passport_id_no">
                                                Passport
                                            </Select.Option>
                                            <Select.Option value="driving_license">
                                                Driving License
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="document_id_no"
                                        label="Document ID"
                                    >
                                        <Input placeholder="Enter document ID" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="about" label="About">
                                        <Input.TextArea
                                            placeholder="Enter about"
                                            rows={4}
                                        />
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                    </Row>

                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isUpdating}
                            >
                                Save Changes
                            </Button>
                            <Button onClick={() => router.back()}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
            <GlobalFilePicker
                open={openFileUpload}
                onCancel={() => setOpenFileUploader(false)}
                fileTypes={["image/jpeg", "image/png"]}
                onSelect={handleProfileImageSelect}
                multiple={false}
                initialSelected={profileImage ? [profileImage] : []}
            />
        </>
    );
}
