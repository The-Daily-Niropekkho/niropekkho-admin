import { Col, Form, Input, Row, Select } from "antd";

interface AddressAndAdditionalInfoFormProps {
    userType: string;
    step: number;
    departments?: {
        id: string;
        title: string;
    }[];
}

export default function AddressAndAdditionalInfoForm({
    userType,
    step,
    departments = [],
}: AddressAndAdditionalInfoFormProps) {
    return (
        <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.user_type !== curr.user_type}
        >
            {({ getFieldValue }) =>
                getFieldValue(userType) !== "admin" ? (
                    <Row gutter={16}>
                        {step === 2 && (
                            <>
                                <Col xs={24}>
                                    <Form.Item
                                        name="address_line_one"
                                        label="Address Line"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please enter address line",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Street address" />
                                    </Form.Item>
                                </Col>
                                {getFieldValue(userType) === "writer" && (
                                    <>
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
                                            <Form.Item
                                                name="country"
                                                label="Country"
                                            >
                                                <Select placeholder="Select country">
                                                    <Select.Option value="Bangladesh">
                                                        Bangladesh
                                                    </Select.Option>
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
                                    </>
                                )}
                            </>
                        )}
                        {step === 3 && (
                            <>
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
                                        name="designation"
                                        label="Designation"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please enter designation",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Designation" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="document_type"
                                        label="Verification Type"
                                        rules={[
                                            {
                                                required: false,
                                                message:
                                                    "Please select verification type",
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Select verification type">
                                            <Select.Option value="national_id_no">
                                                National ID
                                            </Select.Option>
                                            <Select.Option value="passport_id_no">
                                                Passport
                                            </Select.Option>
                                            <Select.Option value="driving_license">
                                                Driving License
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="document_id_no"
                                        label="Document ID Number"
                                        rules={[
                                            {
                                                required: false,
                                                message:
                                                    "Please enter document ID number",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Document ID number" />
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                    </Row>
                ) : (
                    <div>
                        {step === 2
                            ? "No address information required for Admin."
                            : `No additional information required for ${getFieldValue(
                                  "user_type"
                              )}.`}
                    </div>
                )
            }
        </Form.Item>
    );
}
