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
import { useGetAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { TFileDocument } from "@/types";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Steps, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    profile_image?: TFileDocument;
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
        date_of_birth?: string;
        gender?: Gender;
        designation?: string;
        profile_image?: TFileDocument | null;
    };
}

export default function AddReporterPage() {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tempUserId, setTempUserId] = useState<string | null>(null);
    const router = useRouter();

    const { data: department, isLoading: isDepartmentLoading } =
        useGetAllDepartmentsQuery(
            {
                limit: 999,
                status: "active",
            },
            {
                skip: currentStep !== 3,
            }
        );

    // RTK Query mutations
    const [createTempUser] = useCreateTempUserMutation();
    const [createSubAdmin] = useCreateSubAdminMutation();
    const [createWriter] = useCreateWriterMutation();
    const [createModerator] = useCreateModeratorMutation();

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
            const errorMsg = error?.data?.message;
            message.error(errorMsg);
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
            if (!values.email || !tempUserId) {
                throw new Error(
                    "Email or temp user ID missing. Please start over."
                );
            }

            if (values.date_of_birth) {
                values.date_of_birth = values.date_of_birth;
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
                    profile_image: values.profile_image || undefined,
                };
            } else if (values.user_type === "writer") {
                payload.writer = {
                    first_name: values.first_name!,
                    last_name: values.last_name!,
                    nick_name: values.nick_name,
                    address_line_one: values.address_line_one,
                    // city: values.city,
                    // state: values.state,
                    // country: values.country,
                    // zip_code: values.zip_code,
                    mobile: values.mobile,
                    date_of_birth: values.date_of_birth,
                    gender: values.gender,
                    document_type: values.document_type,
                    document_id_no: values.document_id_no,
                    designation: values.designation,
                    profile_image: values.profile_image || undefined,
                };
            } else if (values.user_type === "moderator") {
                payload.moderator = {
                    first_name: values.first_name!,
                    last_name: values.last_name!,
                    address_line_one: values.address_line_one,
                    mobile: values.mobile,
                    date_of_birth: values.date_of_birth,
                    gender: values.gender,
                    designation: values.designation,
                    profile_image: values.profile_image || undefined,
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
            router.back();
        } catch (error: any) {
            const errorMsg = error?.data?.message;
            message.error(errorMsg);
            // console.error("OTP submission failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div
                className="flex items-center justify-between"
                style={{ marginBottom: "20px" }}
            >
                <Button
                    icon={<ArrowLeftOutlined />}
                    style={{ padding: "5px" }}
                    onClick={() => router.back()}
                >
                    Back to Users
                </Button>
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
                    {currentStep === 1 && <PersonalInfoForm form={form} />}
                    {currentStep === 2 && (
                        <AddressAndAdditionalInfoForm step={2} />
                    )}
                    {currentStep === 3 && (
                        <AddressAndAdditionalInfoForm
                            step={3}
                            departments={department?.data || []}
                            isDepartmentLoading={isDepartmentLoading}
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
                        </div>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
