"use client";

import {
    Alert,
    Badge,
    Button,
    Card,
    Divider,
    Dropdown,
    Modal,
    Table,
    TabPane,
    Tabs,
} from "@/components/ant";
import { useTheme } from "@/components/theme-context";
import {
    BellOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    FileOutlined,
    SendOutlined,
    SettingOutlined,
    UserOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import {
    Divider as AntDivider,
    Col,
    Layout,
    Row,
    Space,
    Typography,
} from "antd";
import { useState } from "react";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function ComponentsShowcasePage() {
    const { theme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalVariant, setModalVariant] = useState("default");
    const [modalAnimation, setModalAnimation] = useState("fade");

    const isDark = theme === "dark";

    const openModal = (variant: string, animation: string) => {
        setModalVariant(variant);
        setModalAnimation(animation);
        setIsModalOpen(true);
    };

    // Sample data for table
    const tableData = [
        {
            key: "1",
            name: "John Brown",
            age: 32,
            address: "New York No. 1 Lake Park",
            tags: ["developer", "admin"],
        },
        {
            key: "2",
            name: "Jim Green",
            age: 42,
            address: "London No. 1 Lake Park",
            tags: ["designer"],
        },
        {
            key: "3",
            name: "Joe Black",
            age: 32,
            address: "Sydney No. 1 Lake Park",
            tags: ["tester"],
        },
    ];

    const tableColumns = [
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
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            render: (tags: string[]) => (
                <>
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="pill"
                            colorScheme={
                                tag === "admin"
                                    ? "danger"
                                    : tag === "designer"
                                    ? "secondary"
                                    : "primary"
                            }
                            count={tag}
                            style={{ marginRight: 5 }}
                        />
                    ))}
                </>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: () => (
                <Space>
                    <Button
                        variant="ghost"
                        size="small"
                        icon={<EditOutlined />}
                    />
                    <Button
                        variant="ghost"
                        size="small"
                        icon={<DeleteOutlined />}
                    />
                </Space>
            ),
        },
    ];

    // Dropdown menu items
    const dropdownItems = {
        items: [
            {
                key: "1",
                label: "Profile",
                icon: <UserOutlined />,
            },
            {
                key: "2",
                label: "Settings",
                icon: <SettingOutlined />,
            },
            {
                type: "divider",
            },
            {
                key: "3",
                label: "Logout",
                icon: <CloseCircleOutlined />,
                danger: true,
            },
        ],
    };

    return (
        <Layout
            style={{
                background: isDark ? "#111827" : "#f9fafb",
                minHeight: "100vh",
                padding: "2rem",
            }}
        >
            <Content>
                <Card variant="default" isAnimated>
                    <Title
                        level={2}
                        style={{
                            color: isDark ? "#fff" : "#000",
                            marginBottom: "2rem",
                        }}
                    >
                        Enhanced Ant Design Components
                    </Title>
                    <Text
                        style={{
                            color: isDark
                                ? "rgba(255, 255, 255, 0.65)"
                                : "rgba(0, 0, 0, 0.65)",
                        }}
                    >
                        Showcase of enhanced Ant Design components with custom
                        styling, animations, and functionality.
                    </Text>

                    <AntDivider />

                    {/* Buttons */}
                    <Title
                        level={3}
                        style={{ color: isDark ? "#fff" : "#000" }}
                    >
                        Buttons
                    </Title>
                    <Card
                        variant="filled"
                        style={{ padding: "1.5rem", marginBottom: "2rem" }}
                    >
                        <Space
                            direction="vertical"
                            size="large"
                            style={{ width: "100%" }}
                        >
                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    Button Variants
                                </Title>
                                <Space wrap>
                                    <Button variant="primary">Primary</Button>
                                    <Button variant="secondary">
                                        Secondary
                                    </Button>
                                    <Button variant="success">Success</Button>
                                    <Button variant="warning">Warning</Button>
                                    <Button variant="danger">Danger</Button>
                                    <Button variant="ghost">Ghost</Button>
                                    <Button variant="link">Link</Button>
                                    <Button variant="outline">Outline</Button>
                                </Space>
                            </div>

                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    Rounded Buttons
                                </Title>
                                <Space wrap>
                                    <Button variant="primary" rounded="none">
                                        Square
                                    </Button>
                                    <Button variant="primary" rounded="sm">
                                        Small Radius
                                    </Button>
                                    <Button variant="primary" rounded="md">
                                        Medium Radius
                                    </Button>
                                    <Button variant="primary" rounded="lg">
                                        Large Radius
                                    </Button>
                                    <Button variant="primary" rounded="full">
                                        Pill
                                    </Button>
                                </Space>
                            </div>

                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    Button Sizes
                                </Title>
                                <Space wrap>
                                    <Button variant="primary" size="large">
                                        Large
                                    </Button>
                                    <Button variant="primary">Default</Button>
                                    <Button variant="primary" size="small">
                                        Small
                                    </Button>
                                </Space>
                            </div>

                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    With Icons
                                </Title>
                                <Space wrap>
                                    <Button
                                        variant="primary"
                                        icon={<SendOutlined />}
                                    >
                                        Send
                                    </Button>
                                    <Button
                                        variant="success"
                                        icon={<CheckCircleOutlined />}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="warning"
                                        icon={<WarningOutlined />}
                                    >
                                        Warning
                                    </Button>
                                    <Button
                                        variant="danger"
                                        icon={<DeleteOutlined />}
                                    >
                                        Delete
                                    </Button>
                                </Space>
                            </div>
                        </Space>
                    </Card>

                    {/* Cards */}
                    <Title
                        level={3}
                        style={{ color: isDark ? "#fff" : "#000" }}
                    >
                        Cards
                    </Title>
                    <Row gutter={[16, 16]} style={{ marginBottom: "2rem" }}>
                        <Col xs={24} md={8}>
                            <Card
                                title="Default Card"
                                variant="default"
                                isInteractive
                                isAnimated
                            >
                                <p>
                                    This is the default card style with
                                    interactive hover effect.
                                </p>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                title="Elevated Card"
                                variant="elevated"
                                isInteractive
                                isAnimated
                            >
                                <p>
                                    This card has an elevated style with shadow.
                                </p>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                title="Outlined Card"
                                variant="outlined"
                                isInteractive
                                isAnimated
                            >
                                <p>
                                    This card has an outlined style with border.
                                </p>
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card
                                title="Filled Card"
                                variant="filled"
                                isInteractive
                                isAnimated
                            >
                                <p>This card has a filled background style.</p>
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card
                                title="Gradient Card"
                                variant="gradient"
                                isInteractive
                                isAnimated
                                gradientDirection="to-bottom-right"
                                gradientFrom="#10b981"
                                gradientTo="#8b5cf6"
                                style={{ color: "white" }}
                            >
                                <p
                                    style={{
                                        color: "rgba(255, 255, 255, 0.85)",
                                    }}
                                >
                                    This card has a gradient background.
                                </p>
                            </Card>
                        </Col>
                    </Row>

                    {/* Alerts */}
                    <Title
                        level={3}
                        style={{ color: isDark ? "#fff" : "#000" }}
                    >
                        Alerts
                    </Title>
                    <Space
                        direction="vertical"
                        style={{ width: "100%", marginBottom: "2rem" }}
                    >
                        <Alert
                            message="Default Info Alert"
                            type="info"
                            showIcon
                            isAnimated
                        />
                        <Alert
                            message="Success Alert"
                            description="This is a success alert with description."
                            type="success"
                            showIcon
                            variant="soft"
                            isAnimated
                        />
                        <Alert
                            message="Warning Alert"
                            description="This is a warning alert with description."
                            type="warning"
                            showIcon
                            variant="filled"
                            isAnimated
                        />
                        <Alert
                            message="Error Alert"
                            description="This is an error alert with description."
                            type="error"
                            showIcon
                            variant="outlined"
                            isAnimated
                        />
                    </Space>

                    {/* Modal */}
                    <Title
                        level={3}
                        style={{ color: isDark ? "#fff" : "#000" }}
                    >
                        Modals
                    </Title>
                    <Card
                        variant="filled"
                        style={{ padding: "1.5rem", marginBottom: "2rem" }}
                    >
                        <Space wrap>
                            <Button
                                onClick={() => openModal("default", "fade")}
                            >
                                Default Modal
                            </Button>
                            <Button
                                onClick={() => openModal("bordered", "slide")}
                                variant="secondary"
                            >
                                Bordered Modal
                            </Button>
                            <Button
                                onClick={() => openModal("filled", "scale")}
                                variant="success"
                            >
                                Filled Modal
                            </Button>
                        </Space>

                        <Modal
                            title="Enhanced Modal"
                            open={isModalOpen}
                            variant={modalVariant as any}
                            animation={modalAnimation as any}
                            rounded="lg"
                            onCancel={() => setIsModalOpen(false)}
                            footer={[
                                <Button
                                    key="back"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>,
                                <Button
                                    key="submit"
                                    variant="primary"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Submit
                                </Button>,
                            ]}
                        >
                            <p>
                                This is an enhanced modal with custom styling
                                and animations.
                            </p>
                            <p>
                                The modal variant is{" "}
                                <strong>{modalVariant}</strong> with{" "}
                                <strong>{modalAnimation}</strong> animation.
                            </p>
                        </Modal>
                    </Card>

                    {/* Tables */}
                    <Title
                        level={3}
                        style={{ color: isDark ? "#fff" : "#000" }}
                    >
                        Tables
                    </Title>
                    <div style={{ marginBottom: "2rem" }}>
                        <Tabs defaultActiveKey="1" variant="pills">
                            <TabPane tab="Default Table" key="1">
                                <Table
                                    dataSource={tableData}
                                    columns={tableColumns}
                                    variant="default"
                                    rounded="md"
                                    withShadow
                                />
                            </TabPane>
                            <TabPane tab="Bordered Table" key="2">
                                <Table
                                    dataSource={tableData}
                                    columns={tableColumns}
                                    variant="bordered"
                                    rounded="md"
                                    withShadow
                                />
                            </TabPane>
                            <TabPane tab="Striped Table" key="3">
                                <Table
                                    dataSource={tableData}
                                    columns={tableColumns}
                                    variant="striped"
                                    rounded="md"
                                    withShadow
                                />
                            </TabPane>
                            <TabPane tab="Minimal Table" key="4">
                                <Table
                                    dataSource={tableData}
                                    columns={tableColumns}
                                    variant="minimal"
                                    rounded="md"
                                    withShadow={false}
                                />
                            </TabPane>
                        </Tabs>
                    </div>

                    {/* Tabs */}
                    <Title
                        level={3}
                        style={{ color: isDark ? "#fff" : "#000" }}
                    >
                        Tabs
                    </Title>
                    <Space
                        direction="vertical"
                        size="large"
                        style={{ width: "100%", marginBottom: "2rem" }}
                    >
                        <div>
                            <Title
                                level={5}
                                style={{ color: isDark ? "#fff" : "#000" }}
                            >
                                Default Tabs
                            </Title>
                            <Tabs defaultActiveKey="1" variant="default">
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
                        </div>

                        <div>
                            <Title
                                level={5}
                                style={{ color: isDark ? "#fff" : "#000" }}
                            >
                                Filled Tabs
                            </Title>
                            <Tabs defaultActiveKey="1" variant="filled">
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
                        </div>

                        <div>
                            <Title
                                level={5}
                                style={{ color: isDark ? "#fff" : "#000" }}
                            >
                                Pills Tabs
                            </Title>
                            <Tabs defaultActiveKey="1" variant="pills">
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
                        </div>

                        <div>
                            <Title
                                level={5}
                                style={{ color: isDark ? "#fff" : "#000" }}
                            >
                                Underlined Tabs
                            </Title>
                            <Tabs defaultActiveKey="1" variant="underlined">
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
                        </div>
                    </Space>

                    {/* Badges */}
                    <Title
                        level={3}
                        style={{ color: isDark ? "#fff" : "#000" }}
                    >
                        Badges
                    </Title>
                    <Card
                        variant="filled"
                        style={{ padding: "1.5rem", marginBottom: "2rem" }}
                    >
                        <Space
                            direction="vertical"
                            size="large"
                            style={{ width: "100%" }}
                        >
                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    Badge Variants
                                </Title>
                                <Space wrap>
                                    <Badge count={5} variant="default" />
                                    <Badge count={5} variant="filled" />
                                    <Badge count={5} variant="outlined" />
                                    <Badge count={5} variant="pill" />
                                    <Badge variant="dot" />
                                </Space>
                            </div>

                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    Badge Colors
                                </Title>
                                <Space wrap>
                                    <Badge count={5} colorScheme="primary" />
                                    <Badge count={5} colorScheme="secondary" />
                                    <Badge count={5} colorScheme="success" />
                                    <Badge count={5} colorScheme="warning" />
                                    <Badge count={5} colorScheme="danger" />
                                    <Badge count={5} colorScheme="info" />
                                    <Badge count={5} colorScheme="neutral" />
                                </Space>
                            </div>

                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    Badge with Animation
                                </Title>
                                <Space wrap>
                                    <Badge count={5} withAnimation />
                                    <Badge count={5} withPulse />
                                    <Badge
                                        count={5}
                                        withGlow
                                        colorScheme="danger"
                                    />
                                    <Badge
                                        count={5}
                                        withAnimation
                                        withGlow
                                        colorScheme="success"
                                    />
                                </Space>
                            </div>

                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    Badge with Text
                                </Title>
                                <Space wrap>
                                    <Badge count="New" colorScheme="primary" />
                                    <Badge count="Hot" colorScheme="danger" />
                                    <Badge
                                        count="Sale"
                                        colorScheme="secondary"
                                    />
                                    <Badge count="Beta" colorScheme="warning" />
                                </Space>
                            </div>

                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    Badge with Icons
                                </Title>
                                <Space wrap>
                                    <Button>
                                        Messages
                                        <Badge count={5} colorScheme="danger" />
                                    </Button>
                                    <Button icon={<BellOutlined />}>
                                        <Badge count={5} colorScheme="danger" />
                                    </Button>
                                    <Button icon={<FileOutlined />}>
                                        <Badge
                                            variant="dot"
                                            colorScheme="success"
                                        />
                                    </Button>
                                </Space>
                            </div>
                        </Space>
                    </Card>

                    {/* Dividers */}
                    <Title
                        level={3}
                        style={{ color: isDark ? "#fff" : "#000" }}
                    >
                        Dividers
                    </Title>
                    <Card
                        variant="filled"
                        style={{ padding: "1.5rem", marginBottom: "2rem" }}
                    >
                        <Space
                            direction="vertical"
                            size="large"
                            style={{ width: "100%" }}
                        >
                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    Divider Variants
                                </Title>
                                <Divider variant="default" />
                                <Divider variant="light" />
                                <Divider variant="dark" />
                                <Divider variant="colored" />
                                <Divider variant="dashed" />
                                <Divider variant="dotted" />
                                <Divider variant="gradient" />
                            </div>

                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    Divider Thickness
                                </Title>
                                <Divider thickness="thin" />
                                <Divider thickness="medium" />
                                <Divider thickness="thick" />
                            </div>

                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    Divider with Text
                                </Title>
                                <Divider>Text</Divider>
                                <Divider orientation="left">Left Text</Divider>
                                <Divider orientation="right">
                                    Right Text
                                </Divider>
                            </div>

                            <div>
                                <Title
                                    level={5}
                                    style={{ color: isDark ? "#fff" : "#000" }}
                                >
                                    Rounded Dividers
                                </Title>
                                <Divider thickness="medium" rounded />
                                <Divider
                                    thickness="thick"
                                    rounded
                                    variant="colored"
                                />
                                <Divider
                                    thickness="thick"
                                    rounded
                                    variant="gradient"
                                />
                            </div>
                        </Space>
                    </Card>

                    {/* Dropdowns */}
                    <Title
                        level={3}
                        style={{ color: isDark ? "#fff" : "#000" }}
                    >
                        Dropdowns
                    </Title>
                    <Card
                        variant="filled"
                        style={{ padding: "1.5rem", marginBottom: "2rem" }}
                    >
                        <Space wrap>
                            <Dropdown
                                menu={dropdownItems}
                                variant="default"
                                withAnimation="fade"
                            >
                                <Button>Default Dropdown</Button>
                            </Dropdown>

                            <Dropdown
                                menu={dropdownItems}
                                variant="bordered"
                                withAnimation="slide"
                            >
                                <Button variant="secondary">
                                    Bordered Dropdown
                                </Button>
                            </Dropdown>

                            <Dropdown
                                menu={dropdownItems}
                                variant="elevated"
                                withAnimation="scale"
                            >
                                <Button variant="success">
                                    Elevated Dropdown
                                </Button>
                            </Dropdown>

                            <Dropdown
                                menu={dropdownItems}
                                variant="filled"
                                withAnimation="fade"
                            >
                                <Button variant="warning">
                                    Filled Dropdown
                                </Button>
                            </Dropdown>

                            <Dropdown
                                menu={dropdownItems}
                                variant="minimal"
                                withAnimation="slide"
                            >
                                <Button variant="danger">
                                    Minimal Dropdown
                                </Button>
                            </Dropdown>
                        </Space>
                    </Card>
                </Card>
            </Content>
        </Layout>
    );
}
