/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUpdateProfileMutation } from "@/redux/features/user/userApi";
import { Admin, Moderator, TError, TFileDocument, User, Writer } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import {
    EditOutlined,
    HomeOutlined,
    IdcardOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    message,
    Row,
    Select,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { GlobalFilePicker } from "../media/global-file-picker";

interface ProfileInformationProps {
    user: User;
    profileData: Admin | Writer | Moderator
}

export default function ProfileInformation({ user, profileData }: ProfileInformationProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [openFileUpload, setOpenFileUploader] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<TFileDocument | undefined>(
        undefined
    );
    // Store initial form data for comparison
    const [initialFormData, setInitialFormData] = useState<any>({});


    const handleimageSelect = (files: TFileDocument[]) => {
        const selectedImage = files[0];
        setProfileImage(selectedImage);
        form.setFieldsValue({ profile_image: selectedImage });
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

    const [updateProfile] = useUpdateProfileMutation();

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
                    // Explicitly compare profile_image IDs
                    const currentImageId = values[key] || undefined;
                    const initialImageId =
                        initialFormData[key] !== undefined
                            ? initialFormData[key]
                            : undefined;
                    if (currentImageId !== initialImageId) {
                        changedValues[key] = currentImageId;
                    }
                } else if (
                    JSON.stringify(values[key]) !==
                    JSON.stringify(initialFormData[key])
                ) {
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

            if (
                user?.user_type === "writer" ||
                user?.user_type === "moderator"
            ) {
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

            await updateProfile({ id: user?.id, data: payload }).unwrap();
            message.success("Profile updated successfully!");

            // Update initial form data with new values
            setInitialFormData({
                ...initialFormData,
                ...changedValues,
                date_of_birth: changedValues.date_of_birth
                    ? dayjs(changedValues.date_of_birth)
                    : initialFormData.date_of_birth,
                profile_image:
                    changedValues.profile_image ||
                    initialFormData.profile_image,
            });

            // Update profileImage state to reflect the new image
            if (changedValues.profile_image) {
                setProfileImage(changedValues.profile_image);
            }
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

    return (
        <>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="First Name"
                            name="first_name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your first name!",
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
                                    message: "Please input your last name!",
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
                        <Form.Item label="Nick Name" name="nick_name">
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
                                    message: "Please input your email!",
                                },
                                {
                                    type: "email",
                                    message: "Please enter a valid email!",
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
                                    message: "Please input your mobile number!",
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
                        <Form.Item label="Gender" name="gender">
                            <Select placeholder="Select gender">
                                <Select.Option value="male">Male</Select.Option>
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
                        <Form.Item label="Date of Birth" name="date_of_birth">
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
                            <Form.Item label="Blood Group" name="blood_group">
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
                                        prefix={<UserOutlined />}
                                        placeholder="Designation"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Zip Code" name="zip_code">
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
                                        prefix={<HomeOutlined />}
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
                                            prefix={<HomeOutlined />}
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
                                        prefix={<IdcardOutlined />}
                                        placeholder="Document ID Number"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form.Item label="About" name="about">
                                    <Input.TextArea
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
                    <Row align={"middle"} style={{ gap: 10 }}>
                        <Avatar
                            shape="square"
                            size={64}
                            src={fileObjectToLink(profileImage || null)}
                            icon={<UserOutlined />}
                        />
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => setOpenFileUploader(true)}
                        >
                            Upload Profile Image
                        </Button>
                    </Row>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>

            <GlobalFilePicker
                open={openFileUpload}
                onCancel={() => setOpenFileUploader(false)}
                fileTypes={["image/jpeg", "image/png"]}
                onSelect={handleimageSelect}
                multiple={false}
                initialSelected={profileImage ? [profileImage] : []}
            />
        </>
    );
}
