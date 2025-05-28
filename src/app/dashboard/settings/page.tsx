/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useTheme } from "@/components/theme-context"
import {
  GlobalOutlined,
  NotificationOutlined,
  SaveOutlined,
  SecurityScanOutlined,
  UploadOutlined
} from "@ant-design/icons"
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Switch,
  Tabs,
  Upload
} from "antd"
import { useState } from "react"

const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input

export default function SettingsPage() {
  const [form] = Form.useForm()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const isDark = theme === "dark"

  const onFinish = (values: any) => {
    setLoading(true)
    console.log("Form values:", values)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      message.success("Settings updated successfully!")
    }, 1500)
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: isDark ? "#fff" : "#000",
          }}
        >
          Settings
        </h1>
        <p style={{ color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.45)" }}>
          Configure your newspaper website and admin settings.
        </p>
      </div>

      <Card
        variant="borderless"
        style={{
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          background: isDark ? "#1f2937" : "#ffffff",
        }}
      >
        <Form
          form={form}
          name="settings_form"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            siteName: "নিরপেক্ষ News",
            siteDescription: "Your trusted source for the latest news and updates",
            language: "en",
            timezone: "UTC+6",
            dateFormat: "DD/MM/YYYY",
            timeFormat: "12",
            articlesPerPage: 10,
            enableComments: true,
            moderateComments: true,
            enableRegistration: true,
            enableNotifications: true,
            enableSocialSharing: true,
            enableAnalytics: true,
            enableAds: true,
            enableCache: true,
            maintenanceMode: false,
          }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <GlobalOutlined /> General
                </span>
              }
              key="1"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="siteName"
                    label="Site Name"
                    rules={[{ required: true, message: "Please enter site name" }]}
                  >
                    <Input placeholder="Enter site name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="siteUrl"
                    label="Site URL"
                    rules={[{ required: true, message: "Please enter site URL" }]}
                  >
                    <Input placeholder="https://example.com" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="siteDescription" label="Site Description">
                <TextArea rows={3} placeholder="Enter site description" />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="language"
                    label="Default Language"
                    rules={[{ required: true, message: "Please select language" }]}
                  >
                    <Select placeholder="Select language">
                      <Option value="en">English</Option>
                      <Option value="bn">Bengali</Option>
                      <Option value="hi">Hindi</Option>
                      <Option value="ar">Arabic</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="timezone"
                    label="Timezone"
                    rules={[{ required: true, message: "Please select timezone" }]}
                  >
                    <Select placeholder="Select timezone">
                      <Option value="UTC+0">UTC+0 (London)</Option>
                      <Option value="UTC+1">UTC+1 (Paris)</Option>
                      <Option value="UTC+5:30">UTC+5:30 (New Delhi)</Option>
                      <Option value="UTC+6">UTC+6 (Dhaka)</Option>
                      <Option value="UTC-5">UTC-5 (New York)</Option>
                      <Option value="UTC-8">UTC-8 (Los Angeles)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="dateFormat"
                    label="Date Format"
                    rules={[{ required: true, message: "Please select date format" }]}
                  >
                    <Select placeholder="Select date format">
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                      <Option value="DD-MM-YYYY">DD-MM-YYYY</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="timeFormat"
                    label="Time Format"
                    rules={[{ required: true, message: "Please select time format" }]}
                  >
                    <Radio.Group>
                      <Radio value="12">12 Hour</Radio>
                      <Radio value="24">24 Hour</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="articlesPerPage"
                    label="Articles Per Page"
                    rules={[{ required: true, message: "Please enter number of articles per page" }]}
                  >
                    <InputNumber min={1} max={50} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="logo" label="Site Logo" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload name="logo" listType="picture" maxCount={1} beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>Upload Logo</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="favicon" label="Favicon" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload name="favicon" listType="picture" maxCount={1} beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>Upload Favicon</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="maintenanceMode" label="Maintenance Mode" valuePropName="checked">
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <NotificationOutlined /> Notifications
                </span>
              }
              key="3"
            >
              <Form.Item name="enableNotifications" label="Enable Notifications" valuePropName="checked">
                <Switch checkedChildren="On" unCheckedChildren="Off" />
              </Form.Item>

              <Divider orientation="left">Email Notifications</Divider>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="notifyNewArticle" label="New Article Published" valuePropName="checked">
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="notifyNewComment" label="New Comment" valuePropName="checked">
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="notifyNewUser" label="New User Registration" valuePropName="checked">
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Push Notifications</Divider>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="pushProvider" label="Push Provider">
                    <Select placeholder="Select provider">
                      <Option value="firebase">Firebase</Option>
                      <Option value="onesignal">OneSignal</Option>
                      <Option value="pusher">Pusher</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="pushApiKey" label="API Key">
                    <Input.Password placeholder="Enter API key" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <SecurityScanOutlined /> Security
                </span>
              }
              key="4"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="enableRegistration" label="Enable User Registration" valuePropName="checked">
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="requireEmailVerification" label="Require Email Verification" valuePropName="checked">
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="enableCaptcha" label="Enable CAPTCHA" valuePropName="checked">
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="enableTwoFactor" label="Enable Two-Factor Authentication" valuePropName="checked">
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="passwordPolicy" label="Password Policy">
                    <Select placeholder="Select password policy">
                      <Option value="basic">Basic (min 6 characters)</Option>
                      <Option value="medium">Medium (min 8 characters, 1 number)</Option>
                      <Option value="strong">Strong (min 10 characters, uppercase, number, symbol)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="sessionTimeout" label="Session Timeout (minutes)">
                    <InputNumber min={5} max={1440} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
          </Tabs>

          <Divider style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)" }} />

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}
