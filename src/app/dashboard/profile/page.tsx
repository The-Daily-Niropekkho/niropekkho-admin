"use client";
import { GlobalFilePicker } from "@/components/features/media/global-file-picker";
import ActivityLogs from "@/components/features/profile/activity-logs";
import ChangePassword from "@/components/features/profile/change-password";
import { useTheme } from "@/components/theme-context";
import {
    useGetUserProfileQuery
} from "@/redux/features/auth/authApi";
import { useUpdateProfileMutation } from "@/redux/features/user/userApi";
import { TError, TFileDocument } from "@/types";
import type { Admin, Moderator, Writer } from "@/types/user";
import fileObjectToLink from "@/utils/fileObjectToLink";
import {
    EditOutlined,
    HomeOutlined,
    IdcardOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    Row,
    Select,
    Spin,
    Tabs,
    Tag,
    message
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function ProfilePage() {
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [openFileUpload, setOpenFileUploader] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<TFileDocument | undefined>(
        undefined
    );

    const { data: user, isLoading } = useGetUserProfileQuery(undefined);
    const [updateProfile] = useUpdateProfileMutation();

    // Store initial form data for comparison
    const [initialFormData, setInitialFormData] = useState<any>({});

    // Get the specific profile data based on user type
    const getProfileData = (): Admin | Writer | Moderator | null => {
        if (!user) return null;

        switch (user.user_type) {
            case "admin":
                return user.admin;
            case "writer":
                return user.writer;
            case "moderator":
                return user.moderator;
            default:
                return null;
        }
    };

    const profileData = getProfileData();

    const handleimageSelect = (files: TFileDocument[]) => {
        const selectedImage = files[0];
        setProfileImage(selectedImage);
        form.setFieldsValue({ profile_image: selectedImage.id });
        setOpenFileUploader(false);
    };

    useEffect(() => {
        if (user && profileData) {
            const formData: any = {
                email: user.email,
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                nick_name: profileData.nick_name,
                mobile: profileData.mobile,
                gender: profileData.gender,
                date_of_birth: profileData.date_of_birth
                    ? dayjs(profileData.date_of_birth)
                    : undefined,
                profile_image: profileData.profile_image?.id || undefined,
            };

            if (user.user_type === "writer" || user.user_type === "moderator") {
                const extendedProfile = profileData as Writer | Moderator;
                formData.designation = extendedProfile.designation;
                formData.blood_group = extendedProfile.blood_group;
                formData.address_line_one = extendedProfile.address_line_one;
                formData.zip_code = extendedProfile.zip_code;
                formData.document_type = extendedProfile.document_type;
                formData.document_id_no = extendedProfile.document_id_no;
                formData.about = extendedProfile.about;
            }

            form.setFieldsValue(formData);
            setInitialFormData(formData); // Store initial data for comparison
            setProfileImage(profileData.profile_image); // Set initial profile image
        }
    }, [user, profileData, form]);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);

            // Compare form values with initial values to find changed fields
            const changedValues: any = {};
            Object.keys(values).forEach((key) => {
                if (key === "date_of_birth") {
                    const formattedDate = values[key]
                        ? values[key].format("YYYY-MM-DD")
                        : undefined;
                    const initialDate = initialFormData[key]
                        ? initialFormData[key].format("YYYY-MM-DD")
                        : undefined;
                    if (formattedDate !== initialDate) {
                        changedValues[key] = formattedDate;
                    }
                } else if (key === "profile_image") {
                    // Compare profile_image IDs explicitly
                    const currentImageId = values[key] || undefined;
                    const initialImageId = initialFormData[key] || undefined;
                    if (currentImageId !== initialImageId) {
                        changedValues[key] = currentImageId;
                    }
                } else if (values[key] !== initialFormData[key]) {
                    changedValues[key] = values[key];
                }
            });

            

            // If no changes, show message and return
            if (Object.keys(changedValues).length === 0) {
                message.info("No changes detected.");
                setLoading(false);
                return;
            }

            // Construct minimal payload with only changed values
            const payload: any = {
                user_type: user?.user_type,
            };

            // Add changed authData fields (e.g., email)
            if (changedValues.email) {
                payload.email = changedValues.email;
            }

            // Add changed profile fields based on user type
            const profilePayload: any = {};
            const commonFields = [
                "first_name",
                "last_name",
                "nick_name",
                "mobile",
                "gender",
                "date_of_birth",
                "profile_image", // Include profile_image in common fields
            ];
            const extendedFields = [
                "designation",
                "blood_group",
                "address_line_one",
                "address_line_two",
                "zip_code",
                "document_type",
                "document_id_no",
                "about",
            ];

            commonFields.forEach((field) => {
                if (changedValues[field] !== undefined) {
                    profilePayload[field] = changedValues[field];
                }
            });

            if (user?.user_type === "writer" || user?.user_type === "moderator") {
                extendedFields.forEach((field) => {
                    if (changedValues[field] !== undefined) {
                        profilePayload[field] = changedValues[field];
                    }
                });
            }

            // Only include profile data if there are changes
            if (Object.keys(profilePayload).length > 0 && user?.user_type) {
                payload[user.user_type] = profilePayload;
            }

            console.log("Changed values:", changedValues);
            console.log("Payload:", payload);

            await updateProfile({ id: user?.id, data: payload }).unwrap();
            message.success("Profile updated successfully!");

            // Update initial form data with new values
            setInitialFormData({
                ...initialFormData,
                ...changedValues,
                date_of_birth: changedValues.date_of_birth
                    ? dayjs(changedValues.date_of_birth)
                    : initialFormData.date_of_birth,
                profile_image: changedValues.profile_image || initialFormData.profile_image,
            });
        } catch (error) {
            const errorResponse = error as TError;
            message.error(
                errorResponse.data?.message ||
                    "Failed to update profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (!user || !profileData) {
        return <div>No user data available</div>;
    }

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
                    {user.user_type.charAt(0).toUpperCase() +
                        user.user_type.slice(1)}{" "}
                    Profile
                </h1>
                <p
                    style={{
                        color: isDark
                            ? "rgba(255, 255, 255, 0.65)"
                            : "rgba(0, 0, 0, 0.45)",
                    }}
                >
                    Manage your personal information and account settings.
                </p>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card
                        style={{
                            borderRadius: "8px",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            background: isDark ? "#1f2937" : "#ffffff",
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <Avatar
                                size={100}
                                src={fileObjectToLink(
                                    profileData.profile_image
                                )}
                                icon={<UserOutlined />}
                            />
                            <h2
                                style={{
                                    marginTop: 16,
                                    marginBottom: 4,
                                    color: isDark ? "#fff" : "#000",
                                }}
                            >
                                {profileData.first_name} {profileData.last_name}
                            </h2>
                            <p
                                style={{
                                    color: isDark
                                        ? "rgba(255, 255, 255, 0.45)"
                                        : "rgba(0, 0, 0, 0.45)",
                                    marginBottom: 16,
                                }}
                            >
                                {user.user_type.charAt(0).toUpperCase() +
                                    user.user_type.slice(1)}
                            </p>
                            <Divider
                                style={{
                                    borderColor: isDark ? "#303030" : "#f0f0f0",
                                }}
                            />
                            <Row gutter={[8, 16]}>
                                <Col span={24}>
                                    <p
                                        style={{
                                            color: isDark
                                                ? "rgba(255, 255, 255, 0.85)"
                                                : "rgba(0, 0, 0, 0.85)",
                                        }}
                                    >
                                        <MailOutlined
                                            style={{ marginRight: 8 }}
                                        />
                                        {user.email}
                                    </p>
                                </Col>
                                <Col span={24}>
                                    <p
                                        style={{
                                            color: isDark
                                                ? "rgba(255, 255, 255, 0.85)"
                                                : "rgba(0, 0, 0, 0.85)",
                                        }}
                                    >
                                        <PhoneOutlined
                                            style={{ marginRight: 8 }}
                                        />
                                        {profileData.mobile || "Not provided"}
                                    </p>
                                </Col>
                                {(user.user_type === "writer" ||
                                    user.user_type === "moderator") && (
                                    <>
                                        {(profileData as Writer | Moderator)
                                            .address_line_one && (
                                            <Col span={24}>
                                                <p
                                                    style={{
                                                        color: isDark
                                                            ? "rgba(255, 255, 255, 0.85)"
                                                            : "rgba(0, 0, 0, 0.85)",
                                                    }}
                                                >
                                                    <HomeOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    {
                                                        (
                                                            profileData as
                                                                | Writer
                                                                | Moderator
                                                        ).address_line_one
                                                    }
                                                </p>
                                            </Col>
                                        )}
                                        {(profileData as Writer | Moderator)
                                            .designation && (
                                            <Col span={24}>
                                                <p
                                                    style={{
                                                        color: isDark
                                                            ? "rgba(255, 255, 255, 0.85)"
                                                            : "rgba(0, 0, 0, 0.85)",
                                                    }}
                                                >
                                                    <UserOutlined
                                                        style={{
                                                            marginRight: 8,
                                                        }}
                                                    />
                                                    {
                                                        (
                                                            profileData as
                                                                | Writer
                                                                | Moderator
                                                        ).designation
                                                    }
                                                </p>
                                            </Col>
                                        )}
                                    </>
                                )}
                            </Row>
                            <Divider
                                style={{
                                    borderColor: isDark ? "#303030" : "#f0f0f0",
                                }}
                            />
                            <div>
                                <h4
                                    style={{
                                        color: isDark ? "#fff" : "#000",
                                        marginBottom: 8,
                                    }}
                                >
                                    Account Status
                                </h4>
                                <div style={{ marginTop: 8 }}>
                                    <Tag
                                        color={
                                            user.is_online ? "green" : "default"
                                        }
                                    >
                                        {user.is_online ? "Online" : "Offline"}
                                    </Tag>
                                    <Tag
                                        color={
                                            user.is_email_verified
                                                ? "blue"
                                                : "orange"
                                        }
                                    >
                                        {user.is_email_verified
                                            ? "Email Verified"
                                            : "Email Not Verified"}
                                    </Tag>
                                    <Tag
                                        color={
                                            user.status === "active"
                                                ? "green"
                                                : "red"
                                        }
                                    >
                                        {user.status}
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={16}>
                    <Card
                        style={{
                            borderRadius: "8px",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                            background: isDark ? "#1f2937" : "#ffffff",
                        }}
                    >
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Profile Information" key="1">
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                >
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="First Name"
                                                name="first_name"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please input your first name!",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    prefix={<UserOutlined />}
                                                    placeholder="First Name"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Last Name"
                                                name="last_name"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please input your last name!",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    prefix={<UserOutlined />}
                                                    placeholder="Last Name"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Nick Name"
                                                name="nick_name"
                                            >
                                                <Input
                                                    prefix={<UserOutlined />}
                                                    placeholder="Nick Name"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Email"
                                                name="email"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please input your email!",
                                                    },
                                                    {
                                                        type: "email",
                                                        message:
                                                            "Please enter a valid email!",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    prefix={<MailOutlined />}
                                                    placeholder="Email"
                                                    disabled
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Mobile"
                                                name="mobile"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please input your mobile number!",
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    prefix={<PhoneOutlined />}
                                                    placeholder="Mobile"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Gender"
                                                name="gender"
                                            >
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
                                    </Row>
                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label="Date of Birth"
                                                name="date_of_birth"
                                            >
                                                <DatePicker
                                                    style={{ width: "100%" }}
                                                    format="YYYY-MM-DD"
                                                    placeholder="Select date"
                                                />
                                            </Form.Item>
                                        </Col>
                                        {(user.user_type === "writer" ||
                                            user.user_type === "moderator") && (
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Blood Group"
                                                    name="blood_group"
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
                                        )}
                                    </Row>

                                    {(user.user_type === "writer" ||
                                        user.user_type === "moderator") && (
                                        <>
                                            <Row gutter={16}>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        label="Designation"
                                                        name="designation"
                                                    >
                                                        <Input
                                                            prefix={
                                                                <UserOutlined />
                                                            }
                                                            placeholder="Designation"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        label="Zip Code"
                                                        name="zip_code"
                                                    >
                                                        <Input placeholder="Zip Code" />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col xs={24}>
                                                    <Form.Item
                                                        label="Address Line 1"
                                                        name="address_line_one"
                                                    >
                                                        <Input
                                                            prefix={
                                                                <HomeOutlined />
                                                            }
                                                            placeholder="Address Line 1"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            {user.user_type === "moderator" && (
                                                <Row gutter={16}>
                                                    <Col xs={24}>
                                                        <Form.Item
                                                            label="Address Line 2"
                                                            name="address_line_two"
                                                        >
                                                            <Input
                                                                prefix={
                                                                    <HomeOutlined />
                                                                }
                                                                placeholder="Address Line 2"
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            )}
                                            <Row gutter={16}>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        label="Document Type"
                                                        name="document_type"
                                                    >
                                                        <Select placeholder="Select document type">
                                                            <Select.Option value="passport">
                                                                Passport
                                                            </Select.Option>
                                                            <Select.Option value="national_id">
                                                                National ID
                                                            </Select.Option>
                                                            <Select.Option value="driving_license">
                                                                Driving License
                                                            </Select.Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <Form.Item
                                                        label="Document ID Number"
                                                        name="document_id_no"
                                                    >
                                                        <Input
                                                            prefix={
                                                                <IdcardOutlined />
                                                            }
                                                            placeholder="Document ID Number"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col xs={24}>
                                                    <Form.Item
                                                        label="About"
                                                        name="about"
                                                    >
                                                        <TextArea
                                                            rows={4}
                                                            placeholder="Tell us about yourself..."
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </>
                                    )}

                                    <Form.Item
                                        name="profile_image"
                                        label="Profile Image"
                                        valuePropName="file"
                                    >
                                        <Row
                                            align={"middle"}
                                            style={{ gap: 10 }}
                                        >
                                            <Avatar
                                                shape="square"
                                                size={64}
                                                src={fileObjectToLink(
                                                    profileImage || null
                                                )}
                                                icon={<UserOutlined />}
                                            />
                                            <Button
                                                icon={<EditOutlined />}
                                                onClick={() =>
                                                    setOpenFileUploader(true)
                                                }
                                            >
                                                Upload Profile Image
                                            </Button>
                                        </Row>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                        >
                                            Save Changes
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                            <TabPane tab="Change Password" key="2">
                                <ChangePassword />
                            </TabPane>
                            <TabPane tab="Activity Log" key="3">
                                <ActivityLogs />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
            <GlobalFilePicker
                open={openFileUpload}
                onCancel={() => setOpenFileUploader(false)}
                fileTypes={["image/jpeg", "image/png"]}
                onSelect={handleimageSelect}
                multiple={false}
                initialSelected={profileImage ? [profileImage.id] : []}
            />
        </>
    );
}