import { UserOutlined } from "@ant-design/icons";
import { Col, Form, Input, Row, Select } from "antd";

export default function AccountInfoForm() {
    return (
        <Row gutter={16}>
            <Col xs={24} md={8}>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Please enter email" },
                        {
                            type: "email",
                            message: "Please enter a valid email",
                        },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Email address"
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={8}>
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        { required: true, message: "Please enter username" },
                    ]}
                >
                    <Input placeholder="Username" />
                </Form.Item>
            </Col>
            <Col xs={24} md={8}>
                <Form.Item
                    name="user_type"
                    label="User Type"
                    rules={[
                        { required: true, message: "Please select user type" },
                    ]}
                >
                    <Select placeholder="Select user type">
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="writer">Reporter</Select.Option>
                        <Select.Option value="moderator">
                            Moderator
                        </Select.Option>
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    );
}
