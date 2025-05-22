/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AccountInfoForm from "@/components/features/users/account-info-form";
import AddressAndAdditionalInfoForm from "@/components/features/users/address-additional-info-form";
import OtpForm from "@/components/features/users/otp-form";
import PersonalInfoForm from "@/components/features/users/personal-info-form";
import {
    useCreateModeratorMutation,
    useCreateSubAdminMutation,
    useCreateTempUserMutation,
    useCreateWriterMutation,
} from "@/redux/features/auth/authApi";
import { TFileDocument } from "@/types";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
    Button,
    Card,
    Divider,
    Form,
    Steps,
    Upload,
    UploadFile,
    UploadProps,
    message,
} from "antd";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Types based on the database schema
interface Department {
    id: string;
    title: string;
    is_deleted : boolean
    status: string
    createdAt: string;
    updatedAt: string
}

type UserType = "admin" | "moderator" | "writer";
type Gender = "male" | "female" | "other";
type VerificationType = "national_id_no" | "passport_id_no" | "driving_license";

interface FormData {
    email: string;
    user_type: UserType;
    username?: string;
    first_name?: string;
    last_name?: string;
    nick_name?: string;
    mobile?: string;
    date_of_birth?: string;
    gender?: Gender;
    profile_image?: UploadFile[];
    address_line_one?: string;
    address_line_two?: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;
    document_type?: VerificationType;
    document_id_no?: string;
    designation?: string;
    department_id?: string | null;
    otp?: string;
}

interface FinalPayload {
    authData: {
        email: string;
        user_type: UserType;
        username?: string;
        tempUser: {
            tempUserId: string;
            otp: number;
        };
        department_id?: string;
    };
    admin?: {
        first_name: string;
        last_name: string;
        nick_name?: string;
        mobile?: string;
        date_of_birth?: string;
        gender?: Gender;
        profile_image?: TFileDocument | null;
    };
    writer?: {
        first_name: string;
        last_name: string;
        nick_name?: string;
        address_line_one?: string;
        address_line_two?: string;
        city?: string;
        state?: string;
        country?: string;
        zip_code?: string;
        mobile?: string;
        date_of_birth?: string;
        gender?: Gender;
        document_type?: VerificationType;
        document_id_no?: string;
        designation?: string;
        profile_image?: TFileDocument | null;
    };
    moderator?: {
        first_name?: string;
        last_name?: string;
        address_line_one?: string;
        mobile?: string;
        dateOfBirth?: string;
        gender?: Gender;
        designation?: string;
        profile_image?: TFileDocument | null;
    };
}

export default function AddReporterPage() {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [tempUserId, setTempUserId] = useState<string | null>(null);
    const router = useRouter();

    // RTK Query mutations
    const [createTempUser] = useCreateTempUserMutation();
    const [createSubAdmin] = useCreateSubAdminMutation();
    const [createWriter] = useCreateWriterMutation();
    const [createModerator] = useCreateModeratorMutation();

    // Mock data loading for departments
    useEffect(() => {
        const mockDepartments: Department[] = [
            {
                id: "clwdep0010000a01m0abcxyz01",
                title: "Engineering",

                is_deleted: false,
                status: "active",
                createdAt: "2025-05-20T10:00:00Z",
                updatedAt: "2025-05-20T10:00:00Z",
            },
            {
                id: "clwdep0020000a01m0abcxyz02",
                title: "Human Resources",

                is_deleted: false,
                status: "active",
                createdAt: "2025-05-20T10:01:00Z",
                updatedAt: "2025-05-20T10:01:00Z",
            },
            {
                id: "clwdep0030000a01m0abcxyz03",
                title: "Marketing",

                is_deleted: false,
                status: "active",
                createdAt: "2025-05-20T10:02:00Z",
                updatedAt: "2025-05-20T10:02:00Z",
            },
            {
                id: "clwdep0040000a01m0abcxyz04",
                title: "Finance",

                is_deleted: false,
                status: "active",
                createdAt: "2025-05-20T10:03:00Z",
                updatedAt: "2025-05-20T10:03:00Z",
            },
            {
                id: "clwdep0050000a01m0abcxyz05",
                title: "Legal",

                is_deleted: false,
                status: "active",
                createdAt: "2025-05-20T10:04:00Z",
                updatedAt: "2025-05-20T10:04:00Z",
            },
            {
                id: "clwdep0060000a01m0abcxyz06",
                title: "Product",

                is_deleted: false,
                status: "active",
                createdAt: "2025-05-20T10:05:00Z",
                updatedAt: "2025-05-20T10:05:00Z",
            },
            {
                id: "clwdep0070000a01m0abcxyz07",
                title: "Customer Support",

                is_deleted: false,
                status: "active",
                createdAt: "2025-05-20T10:06:00Z",
                updatedAt: "2025-05-20T10:06:00Z",
            },
            {
                id: "clwdep0080000a01m0abcxyz08",
                title: "Operations",

                is_deleted: false,
                status: "active",
                createdAt: "2025-05-20T10:07:00Z",
                updatedAt: "2025-05-20T10:07:00Z",
            },
            {
                id: "clwdep0090000a01m0abcxyz09",
                title: "Sales",

                is_deleted: false,
                status: "active",
                createdAt: "2025-05-20T10:08:00Z",
                updatedAt: "2025-05-20T10:08:00Z",
            },
            {
                id: "clwdep0100000a01m0abcxyz10",
                title: "IT Services",

                is_deleted: false,
                status: "active",
                createdAt: "2025-05-20T10:09:00Z",
                updatedAt: "2025-05-20T10:09:00Z",
            },
        ];
        setDepartments(mockDepartments);
    }, []);

    // Debug form state on step change
    useEffect(() => {
        console.log(
            `Step ${currentStep} - Current form values:`,
            form.getFieldsValue(true)
        );
    }, [currentStep, form]);

    // Define required fields per step and user_type
    const getRequiredFields = (step: number, userType: UserType): string[] => {
        switch (step) {
            case 0:
                return ["email", "user_type", "username"];
            case 1:
                return ["first_name", "last_name", "mobile", "gender"];
            case 2:
                return userType !== "admin" ? ["address_line_one"] : [];
            case 3:
                return userType === "writer"
                    ? ["department_id", "document_type", "document_id_no"]
                    : [];
            case 4:
                return ["otp"];
            default:
                return [];
        }
    };

    // Handle next step
    const handleNext = async () => {
        try {
            const userType = form.getFieldValue("user_type") || "admin";
            const fieldsToValidate = getRequiredFields(currentStep, userType);

            if (fieldsToValidate.length > 0) {
                await form.validateFields(fieldsToValidate);
            }

            if (currentStep === 3) {
                await form.validateFields();
                const values = form.getFieldsValue(true);
                console.log("Step 3 - Collected values:", values);

                if (!values.email) {
                    message.error("Email is required");
                    return;
                }

                setLoading(true);
                const response = await createTempUser({
                    email: values.email,
                    user_type: values.user_type,
                }).unwrap();
                setTempUserId(response?.data?.id);
                setCurrentStep(4);
                message.success("OTP sent to your email");
            } else {
                setCurrentStep(currentStep + 1);
            }
        } catch (error: any) {
            console.error("Validation failed:", error);
            if (error.errorFields) {
                console.error("Error fields:", error.errorFields);
                message.error(
                    `Please fill in all required fields: ${error.errorFields
                        .map((e: any) => e.name[0])
                        .join(", ")}`
                );
            } else {
                message.error("Please fill in all required fields");
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle previous step
    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    // Handle OTP and final submission
    const handleOtpSubmit = async () => {
        try {
            await form.validateFields(["otp"]);
            setLoading(true);

            const values: FormData = form.getFieldsValue(true);
            console.log("Step 4 - Collected values:", values);

            if (!values.email || !tempUserId) {
                throw new Error(
                    "Email or temp user ID missing. Please start over."
                );
            }

            if (values.date_of_birth) {
                values.date_of_birth = format(values.date_of_birth, "yyyy");
            }

            const payload: FinalPayload = {
                authData: {
                    email: values.email,
                    user_type: values.user_type,
                    username: values.username,
                    tempUser: {
                        tempUserId: tempUserId,
                        otp: parseInt(values.otp!),
                    },
                },
            };
            if (values.department_id) {
                payload.authData.department_id = values.department_id;
            }
            if (values.user_type === "admin") {
                payload.admin = {
                    first_name: values.first_name!,
                    last_name: values.last_name!,
                    nick_name: values.nick_name,
                    mobile: values.mobile,
                    date_of_birth: values.date_of_birth,
                    gender: values.gender,
                    profile_image: undefined,
                };
            } else if (values.user_type === "writer") {
                payload.writer = {
                    first_name: values.first_name!,
                    last_name: values.last_name!,
                    nick_name: values.nick_name,
                    address_line_one: values.address_line_one,
                    city: values.city,
                    state: values.state,
                    country: values.country,
                    zip_code: values.zip_code,
                    mobile: values.mobile,
                    date_of_birth: values.date_of_birth,
                    gender: values.gender,
                    document_type: values.document_type,
                    document_id_no: values.document_id_no,
                    designation: values.designation,
                    profile_image: undefined,
                };
            } else if (values.user_type === "moderator") {
                payload.moderator = {
                    first_name: values.first_name!,
                    last_name: values.last_name!,
                    address_line_one: values.address_line_one,
                    mobile: values.mobile,
                    dateOfBirth: values.date_of_birth,
                    gender: values.gender,
                    designation: values.designation,
                    profile_image: undefined,
                };
            }

            if (values.user_type === "admin") {
                await createSubAdmin(payload).unwrap();
            } else if (values.user_type === "writer") {
                await createWriter(payload).unwrap();
            } else if (values.user_type === "moderator") {
                await createModerator(payload).unwrap();
            }

            message.success("User created successfully");
            router.push("/dashboard/users/all");
        } catch (error) {
            console.error("OTP submission failed:", error);
            setFileList([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle profile image upload
    const handleImageChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList);
        form.setFieldsValue({ profile_image: newFileList });
    };

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
            <div
                className="flex items-center justify-between"
                style={{ marginBottom: "20px" }}
            >
                <Link href="/dashboard/users/all" style={{ padding: "5px" }}>
                    <Button icon={<ArrowLeftOutlined />}>Back to Users</Button>
                </Link>
            </div>

            <Card title="Add New User">
                <Steps current={currentStep} style={{ marginBottom: 24 }}>
                    <Steps.Step title="Account Information" />
                    <Steps.Step title="Personal Information" />
                    <Steps.Step title="Address Information" />
                    <Steps.Step title="Additional Information" />
                    <Steps.Step title="OTP Verification" />
                </Steps>

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        user_type: "admin",
                        gender: "male",
                    }}
                >
                    {currentStep === 0 && <AccountInfoForm />}
                    {currentStep === 1 && (
                        <PersonalInfoForm uploadProps={uploadProps} />
                    )}
                    {currentStep === 2 && (
                        <AddressAndAdditionalInfoForm
                            userType={
                                form.getFieldValue("user_type") || "admin"
                            }
                            step={2}
                        />
                    )}
                    {currentStep === 3 && (
                        <AddressAndAdditionalInfoForm
                            userType={
                                form.getFieldValue("user_type") || "admin"
                            }
                            step={3}
                            departments={departments}
                        />
                    )}
                    {currentStep === 4 && <OtpForm />}

                    <Divider />

                    <div className="flex justify-between">
                        {currentStep > 0 && (
                            <Button onClick={handlePrevious}>Previous</Button>
                        )}
                        <div>
                            {currentStep < 4 && (
                                <Button
                                    type="primary"
                                    onClick={handleNext}
                                    loading={loading}
                                >
                                    Next
                                </Button>
                            )}
                            {currentStep === 4 && (
                                <Button
                                    type="primary"
                                    onClick={handleOtpSubmit}
                                    icon={<SaveOutlined />}
                                    loading={loading}
                                >
                                    Create User
                                </Button>
                            )}
                            <Button
                                onClick={() =>
                                    console.log(
                                        "Debug - Form values:",
                                        form.getFieldsValue(true)
                                    )
                                }
                                style={{ marginLeft: 8 }}
                            >
                                Log Form Values
                            </Button>
                        </div>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
