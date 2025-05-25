import { Col, Form, Input, Row } from "antd";

export default function OtpForm() {
    return (
        <Row gutter={16} justify={"center"}>
            <Col xs={8}>
                <Form.Item
                    name="otp"
                    label="OTP"
                    rules={[{ required: true, message: "Please enter OTP" }]}
                >
                    <Input.OTP length={6} separator={<span>—</span>} size="large" />
                </Form.Item>
            </Col>
        </Row>
    );
}