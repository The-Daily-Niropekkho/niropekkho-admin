"use client";

import { useTheme } from "@/components/theme-context";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DownOutlined,
    InfoCircleOutlined,
    SettingOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Button,
    Card,
    Checkbox,
    DatePicker,
    Divider,
    Dropdown,
    Input,
    Radio,
    Select,
    Slider,
    Switch,
    Table,
    Tabs,
    Tag,
    Typography,
} from "antd";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

export default function ThemeDemoPage() {
    const { tokens } = useTheme();

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Age",
            dataIndex: "age",
            key: "age",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                if (status === "active") {
                    return <Tag color="green">Active</Tag>;
                } else if (status === "pending") {
                    return <Tag color="orange">Pending</Tag>;
                } else {
                    return <Tag color="red">Inactive</Tag>;
                }
            },
        },
        {
            title: "Action",
            key: "action",
            render: () => (
                <Dropdown
                    menu={{
                        items: [
                            { key: "1", label: "Edit" },
                            { key: "2", label: "Delete" },
                            { key: "3", label: "View Details" },
                        ],
                    }}
                >
                    <Button type="text" size="small">
                        Actions <DownOutlined />
                    </Button>
                </Dropdown>
            ),
        },
    ];

    const data = [
        {
            key: "1",
            name: "John Doe",
            age: 32,
            status: "active",
        },
        {
            key: "2",
            name: "Jane Smith",
            age: 28,
            status: "pending",
        },
        {
            key: "3",
            name: "Bob Johnson",
            age: 45,
            status: "inactive",
        },
    ];

    return (
        <div
            style={{
                padding: "2rem",
                backgroundColor: tokens.colorBgLayout,
                color: tokens.colorTextBase,
                minHeight: "100vh",
            }}
        >
            <Card style={{ marginBottom: "2rem" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                    }}
                >
                    <Title level={2} style={{ margin: 0 }}>
                        Theme Demonstration
                    </Title>
                    <ThemeSwitcher />
                </div>
                <Text>
                    This page demonstrates all components with the current theme
                    settings.
                </Text>
                <Divider />
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    <div>
                        <Text strong>Primary Color</Text>
                        <div
                            style={{
                                height: "30px",
                                backgroundColor: tokens.colorPrimary,
                                borderRadius: "4px",
                                marginTop: "0.5rem",
                            }}
                        />
                    </div>
                    <div>
                        <Text strong>Success Color</Text>
                        <div
                            style={{
                                height: "30px",
                                backgroundColor: tokens.colorSuccess,
                                borderRadius: "4px",
                                marginTop: "0.5rem",
                            }}
                        />
                    </div>
                    <div>
                        <Text strong>Warning Color</Text>
                        <div
                            style={{
                                height: "30px",
                                backgroundColor: tokens.colorWarning,
                                borderRadius: "4px",
                                marginTop: "0.5rem",
                            }}
                        />
                    </div>
                    <div>
                        <Text strong>Error Color</Text>
                        <div
                            style={{
                                height: "30px",
                                backgroundColor: tokens.colorError,
                                borderRadius: "4px",
                                marginTop: "0.5rem",
                            }}
                        />
                    </div>
                    <div>
                        <Text strong>Info Color</Text>
                        <div
                            style={{
                                height: "30px",
                                backgroundColor: tokens.colorInfo,
                                borderRadius: "4px",
                                marginTop: "0.5rem",
                            }}
                        />
                    </div>
                </div>
            </Card>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "2rem",
                }}
            >
                <Card title="Typography" style={{ height: "100%" }}>
                    <Title level={1}>Heading 1</Title>
                    <Title level={2}>Heading 2</Title>
                    <Title level={3}>Heading 3</Title>
                    <Title level={4}>Heading 4</Title>
                    <Title level={5}>Heading 5</Title>
                    <Paragraph>
                        This is a paragraph with <Text strong>strong text</Text>{" "}
                        and <Text mark>marked text</Text> and{" "}
                        <Text type="secondary">secondary text</Text>.
                    </Paragraph>
                    <Paragraph>
                        <Text type="success">Success text</Text> and{" "}
                        <Text type="warning">warning text</Text> and{" "}
                        <Text type="danger">danger text</Text>.
                    </Paragraph>
                </Card>

                <Card title="Buttons" style={{ height: "100%" }}>
                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            marginBottom: "1rem",
                            flexWrap: "wrap",
                        }}
                    >
                        <Button type="primary">Primary</Button>
                        <Button>Default</Button>
                        <Button type="dashed">Dashed</Button>
                        <Button type="text">Text</Button>
                        <Button type="link">Link</Button>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            marginBottom: "1rem",
                            flexWrap: "wrap",
                        }}
                    >
                        <Button type="primary" danger>
                            Danger
                        </Button>
                        <Button danger>Danger Default</Button>
                        <Button type="dashed" danger>
                            Danger Dashed
                        </Button>
                        <Button type="text" danger>
                            Danger Text
                        </Button>
                        <Button type="link" danger>
                            Danger Link
                        </Button>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                        }}
                    >
                        <Button type="primary" icon={<SettingOutlined />}>
                            With Icon
                        </Button>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SettingOutlined />}
                        />
                        <Button
                            type="primary"
                            shape="round"
                            icon={<SettingOutlined />}
                        />
                        <Button type="primary" loading>
                            Loading
                        </Button>
                    </div>
                </Card>

                <Card title="Form Elements" style={{ height: "100%" }}>
                    <div style={{ marginBottom: "1rem" }}>
                        <Text>Input</Text>
                        <Input
                            placeholder="Basic input"
                            style={{ marginTop: "0.5rem" }}
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <Text>Input with prefix</Text>
                        <Input
                            placeholder="Search"
                            prefix={<InfoCircleOutlined />}
                            style={{ marginTop: "0.5rem" }}
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <Text>Select</Text>
                        <Select
                            defaultValue="option1"
                            style={{ width: "100%", marginTop: "0.5rem" }}
                        >
                            <Option value="option1">Option 1</Option>
                            <Option value="option2">Option 2</Option>
                            <Option value="option3">Option 3</Option>
                        </Select>
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <Text>DatePicker</Text>
                        <DatePicker
                            style={{ width: "100%", marginTop: "0.5rem" }}
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <Text>Checkbox & Radio</Text>
                        <div style={{ marginTop: "0.5rem" }}>
                            <Checkbox>Checkbox</Checkbox>
                            <Radio.Group
                                defaultValue="a"
                                style={{ marginLeft: "1rem" }}
                            >
                                <Radio value="a">A</Radio>
                                <Radio value="b">B</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div>
                        <Text>Switch</Text>
                        <div style={{ marginTop: "0.5rem" }}>
                            <Switch
                                defaultChecked
                                style={{ marginRight: "1rem" }}
                            />
                            <Switch />
                        </div>
                    </div>
                </Card>

                <Card title="Alerts" style={{ height: "100%" }}>
                    <Alert
                        message="Success Alert"
                        description="This is a success alert with detailed description."
                        type="success"
                        showIcon
                        style={{ marginBottom: "1rem" }}
                    />
                    <Alert
                        message="Info Alert"
                        description="This is an info alert with detailed description."
                        type="info"
                        showIcon
                        style={{ marginBottom: "1rem" }}
                    />
                    <Alert
                        message="Warning Alert"
                        description="This is a warning alert with detailed description."
                        type="warning"
                        showIcon
                        style={{ marginBottom: "1rem" }}
                    />
                    <Alert
                        message="Error Alert"
                        description="This is an error alert with detailed description."
                        type="error"
                        showIcon
                    />
                </Card>

                <Card title="Tags & Badges" style={{ height: "100%" }}>
                    <div style={{ marginBottom: "1rem" }}>
                        <Tag color="success">Success</Tag>
                        <Tag color="processing">Processing</Tag>
                        <Tag color="warning">Warning</Tag>
                        <Tag color="error">Error</Tag>
                        <Tag icon={<CheckCircleOutlined />} color="success">
                            Success
                        </Tag>
                        <Tag icon={<CloseCircleOutlined />} color="error">
                            Error
                        </Tag>
                        <Tag icon={<WarningOutlined />} color="warning">
                            Warning
                        </Tag>
                        <Tag icon={<InfoCircleOutlined />} color="processing">
                            Info
                        </Tag>
                    </div>
                </Card>

                <Card title="Tabs" style={{ height: "100%" }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Tab 1" key="1">
                            Content of Tab Pane 1
                        </TabPane>
                        <TabPane tab="Tab 2" key="2">
                            Content of Tab Pane 2
                        </TabPane>
                        <TabPane tab="Tab 3" key="3">
                            Content of Tab Pane 3
                        </TabPane>
                    </Tabs>
                </Card>

                <Card title="Slider" style={{ height: "100%" }}>
                    <Slider
                        defaultValue={30}
                        style={{ marginBottom: "1rem" }}
                    />
                    <Slider range defaultValue={[20, 50]} />
                </Card>
            </div>

            <Card title="Table" style={{ marginTop: "2rem" }}>
                <Table columns={columns} dataSource={data} />
            </Card>
        </div>
    );
}
