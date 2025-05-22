import { UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    Upload,
} from "antd";
import type { UploadProps } from "antd/es/upload/interface";

interface PersonalInfoFormProps {
    uploadProps: UploadProps;
}

export default function PersonalInfoForm({
    uploadProps,
}: PersonalInfoFormProps) {
    return (
        <Row gutter={16}>
            <Col xs={24} md={12}>
                <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[
                        { required: true, message: "Please enter first name" },
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
                        { required: true, message: "Please enter last name" },
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
                        { required: false, message: "Please enter nick name" },
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
                        { required: false, message: "Please enter birth date" },
                    ]}
                >
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
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
                <Form.Item
                    name="profile_image"
                    label="Profile Image"
                    valuePropName="fileList"
                    getValueFromEvent={(e) =>
                        Array.isArray(e) ? e : e?.fileList
                    }
                >
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>
                            Upload Profile Image
                        </Button>
                    </Upload>
                </Form.Item>
            </Col>
        </Row>
    );
}
