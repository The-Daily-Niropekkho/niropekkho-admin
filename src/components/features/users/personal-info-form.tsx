/* eslint-disable @typescript-eslint/no-explicit-any */
import { TFileDocument } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Col,
    DatePicker,
    Form,
    FormInstance,
    Input,
    Row,
    Select,
} from "antd";
import { useState } from "react";
import { GlobalFilePicker } from "../media/global-file-picker";

interface PersonalInfoFormProps {
    form: FormInstance<any>;
}

export default function PersonalInfoForm({ form }: PersonalInfoFormProps) {
    const [profileImage, setProfileImage] = useState<TFileDocument | undefined>(
        undefined
    );
    const [openFileUpload, setOpenFileUploader] = useState<boolean>(false);

    const handleProfileImageSelect = (files: TFileDocument[]) => {
        const selectedImage = files[0];
        setProfileImage(selectedImage);
        form.setFieldsValue({ profile_image: selectedImage });
        setOpenFileUploader(false);
    };
    return (
        <>
            <Row gutter={16}>
                <Col xs={24} md={12}>
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
                                message: "Please enter last name",
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
                        rules={[
                            {
                                required: false,
                                message: "Please enter nick name",
                            },
                        ]}
                    >
                        <Input placeholder="Nick name (optional)" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="mobile"
                        label="Mobile Number"
                        rules={[
                            {
                                required: true,
                                message: "Please enter mobile number",
                            },
                        ]}
                    >
                        <Input placeholder="Mobile number" type="number" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="date_of_birth"
                        label="Date of Birth"
                        rules={[
                            {
                                required: false,
                                message: "Please enter birth date",
                            },
                        ]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[
                            {
                                required: true,
                                message: "Please select male or female",
                            },
                        ]}
                    >
                        <Select placeholder="Select gender">
                            <Select.Option value="male">Male</Select.Option>
                            <Select.Option value="female">Female</Select.Option>
                            <Select.Option value="other">Other</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <div
                        className="flex items-center"
                        style={{ alignItems: "center", gap: 10 }}
                    >
                        <Avatar
                            shape="square"
                            size={64}
                            src={fileObjectToLink(profileImage ?? null)}
                            icon={<UserOutlined />}
                        />
                        <Form.Item name="profile_image" label="Profile Image">
                            <Button
                                icon={<UploadOutlined />}
                                onClick={() => setOpenFileUploader(true)}
                            >
                                Upload Profile Image
                            </Button>
                        </Form.Item>
                    </div>
                </Col>
            </Row>
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
