"use client";

import {
    ArrowLeftOutlined,
    SaveOutlined,
    UploadOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    Row,
    Select,
    Tabs,
    Upload,
    message,
} from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Types based on the database schema
interface Department {
    id: string;
    title: string;
}

type UserType = "admin" | "editor" | "reporter" | "writer" | "contributor";
type Gender = "male" | "female" | "other";
type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
type VerificationType =
    | "national_id"
    | "passport"
    | "driving_license"
    | "other";

interface ReporterFormData {
    // User info
    email: string;
    password: string;
    department_id: string;
    user_type: UserType;

    // Reporter info
    first_name: string;
    last_name: string;
    nick_name?: string;
    profile_image?: UploadFile[];
    mobile?: string;
    designation?: string;
    gender?: Gender;
    blood_group?: BloodGroup;
    date_of_birth?: string;
    address_line_one?: string;
    address_line_two?: string;
    country?: string;
    state?: string;
    city?: string;
    zip_code?: string;
    verification_type?: VerificationType;
    document_id_no?: string;
    about?: string;
}

export default function AddReporterPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const router = useRouter();

    // Mock data loading
    useEffect(() => {
        // Simulate API call to fetch departments
        const mockDepartments: Department[] = [
            { id: "d1", title: "News" },
            { id: "d2", title: "Sports" },
            { id: "d3", title: "Entertainment" },
            { id: "d4", title: "Politics" },
            { id: "d5", title: "Business" },
            { id: "d6", title: "Technology" },
        ];

        setDepartments(mockDepartments);
    }, []);

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // Format date of birth if exists
            if (values.date_of_birth) {
                values.date_of_birth =
                    values.date_of_birth.format("YYYY-MM-DD");
            }

            // In a real app, you would send this data to your API
            console.log("Form values:", values);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            message.success("Reporter added successfully");
            router.push("/dashboard/reporters/all");
        } catch (error) {
            console.error("Validation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle profile image upload
    const handleImageChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList);
    };

    // Upload props
    const uploadProps: UploadProps = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                message.error("You can only upload image files!");
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error("Image must be smaller than 2MB!");
            }
            return isImage && isLt2M ? false : Upload.LIST_IGNORE;
        },
        fileList,
        onChange: handleImageChange,
        maxCount: 1,
        listType: "picture",
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
                <Link href="/dashboard/users/all" style={{padding: "5px"}}>
                    <Button icon={<ArrowLeftOutlined />}>
                        Back to Users
                    </Button>
                </Link>
            </div>

            <Card title="Add New Reporter/Writer">
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        user_type: "reporter",
                        gender: "male",
                        country: "United States",
                    }}
                    onFinish={handleSubmit}
                >
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="Account Information" key="1">
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter email",
                                            },
                                            {
                                                type: "email",
                                                message:
                                                    "Please enter a valid email",
                                            },
                                        ]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Email address"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="password"
                                        label="Password"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please enter password",
                                            },
                                            {
                                                min: 6,
                                                message:
                                                    "Password must be at least 6 characters",
                                            },
                                        ]}
                                    >
                                        <Input.Password placeholder="Password" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="department_id"
                                        label="Department"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select department",
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Select department">
                                            {departments.map((dept) => (
                                                <Select.Option
                                                    key={dept.id}
                                                    value={dept.id}
                                                >
                                                    {dept.title}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="user_type"
                                        label="User Type"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select user type",
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Select user type">
                                            <Select.Option value="reporter">
                                                Reporter
                                            </Select.Option>
                                            <Select.Option value="writer">
                                                Writer
                                            </Select.Option>
                                            <Select.Option value="contributor">
                                                Contributor
                                            </Select.Option>
                                            <Select.Option value="editor">
                                                Editor
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Personal Information" key="2">
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="first_name"
                                        label="First Name"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please enter first name",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="First name" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="last_name"
                                        label="Last Name"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please enter last name",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Last name" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="nick_name"
                                        label="Nick Name"
                                    >
                                        <Input placeholder="Nick name (optional)" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="mobile"
                                        label="Mobile Number"
                                    >
                                        <Input placeholder="Mobile number" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="designation"
                                        label="Designation"
                                    >
                                        <Input placeholder="Designation" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
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

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="blood_group"
                                        label="Blood Group"
                                    >
                                        <Select placeholder="Select blood group">
                                            <Select.Option value="A+">
                                                A+
                                            </Select.Option>
                                            <Select.Option value="A-">
                                                A-
                                            </Select.Option>
                                            <Select.Option value="B+">
                                                B+
                                            </Select.Option>
                                            <Select.Option value="B-">
                                                B-
                                            </Select.Option>
                                            <Select.Option value="AB+">
                                                AB+
                                            </Select.Option>
                                            <Select.Option value="AB-">
                                                AB-
                                            </Select.Option>
                                            <Select.Option value="O+">
                                                O+
                                            </Select.Option>
                                            <Select.Option value="O-">
                                                O-
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="date_of_birth"
                                        label="Date of Birth"
                                    >
                                        <DatePicker style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item
                                        name="profile_image"
                                        label="Profile Image"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => e?.fileList}
                                    >
                                        <Upload {...uploadProps}>
                                            <Button icon={<UploadOutlined />}>
                                                Upload Profile Image
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item name="about" label="About">
                                        <Input.TextArea
                                            rows={4}
                                            placeholder="Brief description about the reporter"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Address Information" key="3">
                            <Row gutter={16}>
                                <Col xs={24}>
                                    <Form.Item
                                        name="address_line_one"
                                        label="Address Line 1"
                                    >
                                        <Input placeholder="Street address" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <Form.Item
                                        name="address_line_two"
                                        label="Address Line 2"
                                    >
                                        <Input placeholder="Apartment, suite, unit, etc. (optional)" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item name="city" label="City">
                                        <Input placeholder="City" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="state"
                                        label="State/Province"
                                    >
                                        <Input placeholder="State/Province" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item name="country" label="Country">
                                        <Select placeholder="Select country">
                                            <Select.Option value="United States">
                                                United States
                                            </Select.Option>
                                            <Select.Option value="Canada">
                                                Canada
                                            </Select.Option>
                                            <Select.Option value="United Kingdom">
                                                United Kingdom
                                            </Select.Option>
                                            <Select.Option value="Australia">
                                                Australia
                                            </Select.Option>
                                            <Select.Option value="India">
                                                India
                                            </Select.Option>
                                            {/* Add more countries as needed */}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="zip_code"
                                        label="ZIP/Postal Code"
                                    >
                                        <Input placeholder="ZIP/Postal code" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Verification" key="4">
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="verification_type"
                                        label="Verification Type"
                                    >
                                        <Select placeholder="Select verification type">
                                            <Select.Option value="national_id">
                                                National ID
                                            </Select.Option>
                                            <Select.Option value="passport">
                                                Passport
                                            </Select.Option>
                                            <Select.Option value="driving_license">
                                                Driving License
                                            </Select.Option>
                                            <Select.Option value="other">
                                                Other
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="document_id_no"
                                        label="Document ID Number"
                                    >
                                        <Input placeholder="Document ID number" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24}>
                                    <div className="bg-blue-50 p-4 rounded-md mt-4">
                                        <p className="text-blue-800 text-sm">
                                            Note: Verification documents may be
                                            required for certain reporter
                                            privileges. Please ensure all
                                            information provided is accurate and
                                            up-to-date.
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </Tabs.TabPane>
                    </Tabs>

                    <Divider />

                    <div className="flex justify-end">
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                        >
                            Save Reporter
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
