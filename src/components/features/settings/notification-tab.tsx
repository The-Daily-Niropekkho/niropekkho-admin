/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Divider, Form, Input, Row, Select, Switch } from "antd";

export default function NotificationTab() {
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        console.log(values);
    };

    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item
                name="enableNotifications"
                label="Enable Notifications"
                valuePropName="checked"
            >
                <Switch checkedChildren="On" unCheckedChildren="Off" />
            </Form.Item>

            <Divider orientation="left">Email Notifications</Divider>

            <Row gutter={16}>
                <Col xs={24} md={8}>
                    <Form.Item
                        name="notifyNewArticle"
                        label="New Article Published"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="On" unCheckedChildren="Off" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item
                        name="notifyNewComment"
                        label="New Comment"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="On" unCheckedChildren="Off" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item
                        name="notifyNewUser"
                        label="New User Registration"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="On" unCheckedChildren="Off" />
                    </Form.Item>
                </Col>
            </Row>

            <Divider orientation="left">Push Notifications</Divider>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item name="pushProvider" label="Push Provider">
                        <Select
                            placeholder="Select provider"
                            options={[
                                { value: "firebase", label: "Firebase" },
                                { value: "onesignal", label: "Onesignal" },
                                { value: "pusher", label: "Pusher" },
                            ]}
                        ></Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="pushApiKey" label="API Key">
                        <Input.Password placeholder="Enter API key" />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}
