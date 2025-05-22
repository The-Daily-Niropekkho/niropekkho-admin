"use client";

import { useTheme } from "@/components/theme-context";
import {
    useGetSingleUserQuery,
    useUpdateUserMutation,
} from "@/redux/features/user/userApi"; // Adjust the import path as needed
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    message,
    Row,
    Select,
    Space,
    Spin,
} from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Types based on the provided schema
interface User {
    id: string;
    userUniqueId: string;
    email: string;
    user_type: string;
    is_deleted: boolean;
    is_email_verified: boolean;
    is_online: boolean;
    is_change_password: boolean;
    is_main_account: boolean;
    verification_status: string;
    status: string;
    account_type: string;
    secret_key: string;
    createdAt: string;
    updatedAt: string;
    last_login: string;
    author_id: string;
    department_id: string;
    admin?: Admin;
    writer?: Writer;
    moderator?: Moderator;
}

interface Admin {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    date_of_birth: string;
    gender: string;
    mobile: string;
    createdAt: string;
    updatedAt: string;
    is_deleted: boolean;
    profile_image_id: string;
    profile_image: TFileDocument | null;
}

interface Writer {
    id: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    user_id: string;
    mobile: string;
    designation: string;
    gender: string;
    blood_group: string;
    date_of_birth: string;
    address_line_one: string;
    zip_code: string;
    document_type: string;
    document_id_no: string;
    about: string;
    createdAt: string;
    updatedAt: string;
    is_deleted: boolean;
    profile_image_id: string;
    profile_image: TFileDocument | null;
    country_id: number;
    division_id: string;
    district_id: string;
    upazilla_id: string;
    union_id: string;
}

interface Moderator {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    profile_image_id: string;
    profile_image: TFileDocument | null;
    mobile: string;
    designation: string;
    gender: string;
    blood_group: string;
    date_of_birth: string;
    address_line_one: string;
    address_line_two: string;
    zip_code: string;
    document_type: string;
    document_id_no: string;
    about: string;
    createdAt: string;
    updatedAt: string;
    is_deleted: boolean;
    country_id: number;
    division_id: string;
    district_id: string;
    upazilla_id: string;
    union_id: string;
}

interface TFileDocument {
    id: string;
    url: string;
}

interface FormValues {
    // Core User fields
    email: string;
    user_type: string;
    status: string;
    account_type: string;
    is_email_verified: boolean;
    // Specific fields (common to Admin, Writer, Moderator)
    first_name: string;
    last_name: string;
    nick_name?: string;
    mobile?: string;
    gender?: string;
    date_of_birth?: string;
    // Writer/Moderator-specific fields
    designation?: string;
    blood_group?: string;
    address_line_one?: string;
    zip_code?: string;
    document_type?: string;
    document_id_no?: string;
    about?: string;
    // Moderator-specific fields
    address_line_two?: string;
}

export default function EditUserPage() {
    const [form] = Form.useForm();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("id");
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Fetch single user data
    const { data: user, isLoading: isFetching, error } = useGetSingleUserQuery(userId || "");
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    // Initialize form with user data
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
            const userType = user.user_type.toLowerCase();
            form.setFieldsValue({
                email: user.email,
                user_type: user.user_type,
                status: user.status,
                account_type: user.account_type,
                is_email_verified: user.is_email_verified,
                first_name: user[userType]?.first_name || "",
                last_name: user[userType]?.last_name || "",
                nick_name: user[userType]?.nick_name || undefined,
                mobile: user[userType]?.mobile || undefined,
                gender: user[userType]?.gender || undefined,
                date_of_birth: user[userType]?.date_of_birth
                    ? user[userType]?.date_of_birth
                    : undefined,
                ...(userType !== "admin" && {
                    designation: user[userType]?.designation || undefined,
                    blood_group: user[userType]?.blood_group || undefined,
                    address_line_one: user[userType]?.address_line_one || undefined,
                    zip_code: user[userType]?.zip_code || undefined,
                    document_type: user[userType]?.document_type || undefined,
                    document_id_no: user[userType]?.document_id_no || undefined,
                    about: user[userType]?.about || undefined,
                }),
                ...(userType === "moderator" && {
                    address_line_two: user[userType]?.address_line_two || undefined,
                }),
            });
        }
    }, [userId, user, error, form, router]);

    // Handle form submission
    const onFinish = async (values: FormValues) => {
        if (!userId || !user) return;

        const userType = user.user_type.toLowerCase();
        const payload = {
            id: userId,
            data: {
                authData: {
                    email: values.email,
                    user_type: values.user_type,
                    status: values.status,
                    account_type: values.account_type,
                    is_email_verified: values.is_email_verified,
                },
                [userType]: {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    nick_name: values.nick_name || "",
                    mobile: values.mobile || "",
                    gender: values.gender || "",
                    date_of_birth: values.date_of_birth
                        ? moment(values.date_of_birth).format("YYYY-MM-DD")
                        : "",
                    ...(userType !== "admin" && {
                        designation: values.designation || "",
                        blood_group: values.blood_group || "",
                        address_line_one: values.address_line_one || "",
                        zip_code: values.zip_code || "",
                        document_type: values.document_type || "",
                        document_id_no: values.document_id_no || "",
                        about: values.about || "",
                    }),
                    ...(userType === "moderator" && {
                        address_line_two: values.address_line_two || "",
                    }),
                },
            },
        };

        try {
            await updateUser(payload).unwrap();
            message.success(`${userType.charAt(0).toUpperCase() + userType.slice(1)} updated successfully`);
            router.push(`/dashboard/${userType}s`);
        } catch (error) {
            message.error("Failed to update user");
        }
    };

    if (isFetching) {
        return <Spin size="large" />;
    }

    if (!user) {
        return null; // Handled by useEffect redirect
    }

    const userType = user.user_type.toLowerCase();

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
                    initialValues={{}}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <h3 style={{ marginBottom: 16 }}>Core Information</h3>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
                            >
                                <Input placeholder="Enter email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="user_type"
                                label="User Type"
                                rules={[{ required: true, message: "Please select user type" }]}
                            >
                                <Select placeholder="Select user type" disabled>
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="writer">Writer</Select.Option>
                                    <Select.Option value="moderator">Moderator</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: "Please select status" }]}
                            >
                                <Select placeholder="Select status">
                                    <Select.Option value="active">Active</Select.Option>
                                    <Select.Option value="inactive">Inactive</Select.Option>
                                    <Select.Option value="pending">Pending</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="account_type"
                                label="Account Type"
                                rules={[{ required: true, message: "Please select account type" }]}
                            >
                                <Select placeholder="Select account type">
                                    <Select.Option value="standard">Standard</Select.Option>
                                    <Select.Option value="premium">Premium</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="is_email_verified"
                                label="Email Verified"
                                rules={[{ required: true, message: "Please select verification status" }]}
                            >
                                <Select placeholder="Select verification status">
                                    <Select.Option value={true}>Verified</Select.Option>
                                    <Select.Option value={false}>Not Verified</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <h3 style={{ marginBottom: 16, marginTop: 16 }}>
                                {userType.charAt(0).toUpperCase() + userType.slice(1)} Information
                            </h3>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="first_name"
                                label="First Name"
                                rules={[{ required: true, message: "Please enter first name" }]}
                            >
                                <Input placeholder="Enter first name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="last_name"
                                label="Last Name"
                                rules={[{ required: true, message: "Please enter last name" }]}
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
                                    <Select.Option value="male">Male</Select.Option>
                                    <Select.Option value="female">Female</Select.Option>
                                    <Select.Option value="other">Other</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="date_of_birth" label="Date of Birth">
                                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>

                        {(userType === "writer" || userType === "moderator") && (
                            <>
                                <Col span={12}>
                                    <Form.Item name="designation" label="Designation">
                                        <Input placeholder="Enter designation" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="blood_group" label="Blood Group">
                                        <Select placeholder="Select blood group">
                                            <Select.Option value="A+">A+</Select.Option>
                                            <Select.Option value="A-">A-</Select.Option>
                                            <Select.Option value="B+">B+</Select.Option>
                                            <Select.Option value="B-">B-</Select.Option>
                                            <Select.Option value="AB+">AB+</Select.Option>
                                            <Select.Option value="AB-">AB-</Select.Option>
                                            <Select.Option value="O+">O+</Select.Option>
                                            <Select.Option value="O-">O-</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="address_line_one" label="Address Line 1">
                                        <Input placeholder="Enter address line 1" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="zip_code" label="ZIP Code">
                                        <Input placeholder="Enter ZIP code" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="document_type" label="Verification Type">
                                        <Select placeholder="Select verification type">
                                            <Select.Option value="national_id">National ID</Select.Option>
                                            <Select.Option value="passport">Passport</Select.Option>
                                            <Select.Option value="driving_license">Driving License</Select.Option>
                                            <Select.Option value="other">Other</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="document_id_no" label="Document ID">
                                        <Input placeholder="Enter document ID" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="about" label="About">
                                        <Input.TextArea placeholder="Enter about" rows={4} />
                                    </Form.Item>
                                </Col>
                            </>
                        )}

                        {userType === "moderator" && (
                            <Col span={12}>
                                <Form.Item name="address_line_two" label="Address Line 2">
                                    <Input placeholder="Enter address line 2" />
                                </Form.Item>
                            </Col>
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
                            <Button
                                onClick={() => router.push(`/dashboard/${userType}s`)}
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
}