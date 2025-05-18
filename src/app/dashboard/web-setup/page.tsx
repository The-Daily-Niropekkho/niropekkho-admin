"use client"

import { Button as EnhancedButton } from "@/components/ant/button"
import { Card as EnhancedCard } from "@/components/ant/card"
import { Divider as EnhancedDivider } from "@/components/ant/divider"
import { Tabs as EnhancedTabs } from "@/components/ant/tabs"
import {
    ApiOutlined,
    CloudUploadOutlined,
    DatabaseOutlined,
    GlobalOutlined,
    LockOutlined,
    MailOutlined,
    MobileOutlined,
    SaveOutlined,
    UploadOutlined,
} from "@ant-design/icons"
import { Button, Collapse, Form, Input, message, Select, Switch, Upload } from "antd"
import { useState } from "react"

const { TabPane } = EnhancedTabs
const { Panel } = Collapse
const { TextArea } = Input

export default function WebSetupPage() {
  const [activeTab, setActiveTab] = useState("1")
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      message.success("Settings saved successfully!")
    }, 1500)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Website Setup</h1>
        <EnhancedButton
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          loading={loading}
          variant="gradient"
        >
          Save All Settings
        </EnhancedButton>
      </div>

      <EnhancedTabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
        <TabPane
          tab={
            <span>
              <GlobalOutlined /> General
            </span>
          }
          key="1"
        >
          <EnhancedCard>
            <Form layout="vertical" form={form}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Form.Item
                    label="Website Name"
                    name="siteName"
                    initialValue="নিরপেক্ষ News"
                    rules={[{ required: true, message: "Please enter website name" }]}
                  >
                    <Input placeholder="Enter website name" />
                  </Form.Item>

                  <Form.Item
                    label="Website URL"
                    name="siteUrl"
                    initialValue="https://example.com"
                    rules={[{ required: true, message: "Please enter website URL" }]}
                  >
                    <Input placeholder="https://example.com" />
                  </Form.Item>

                  <Form.Item
                    label="Admin Email"
                    name="adminEmail"
                    initialValue="admin@example.com"
                    rules={[
                      { required: true, message: "Please enter admin email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input placeholder="admin@example.com" />
                  </Form.Item>

                  <Form.Item
                    label="Timezone"
                    name="timezone"
                    initialValue="UTC+6"
                    rules={[{ required: true, message: "Please select timezone" }]}
                  >
                    <Select
                      options={[
                        { value: "UTC+0", label: "UTC+0 (London)" },
                        { value: "UTC+1", label: "UTC+1 (Paris)" },
                        { value: "UTC+5:30", label: "UTC+5:30 (New Delhi)" },
                        { value: "UTC+6", label: "UTC+6 (Dhaka)" },
                        { value: "UTC-5", label: "UTC-5 (New York)" },
                        { value: "UTC-8", label: "UTC-8 (Los Angeles)" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Date Format"
                    name="dateFormat"
                    initialValue="DD/MM/YYYY"
                    rules={[{ required: true, message: "Please select date format" }]}
                  >
                    <Select
                      options={[
                        { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                        { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                        { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                        { value: "DD-MM-YYYY", label: "DD-MM-YYYY" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Language"
                    name="language"
                    initialValue="bn"
                    rules={[{ required: true, message: "Please select language" }]}
                  >
                    <Select
                      options={[
                        { value: "en", label: "English" },
                        { value: "bn", label: "Bengali" },
                        { value: "hi", label: "Hindi" },
                        { value: "ar", label: "Arabic" },
                      ]}
                    />
                  </Form.Item>
                </div>

                <div>
                  <Form.Item
                    label="Site Logo"
                    name="logo"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                      if (Array.isArray(e)) {
                        return e
                      }
                      return e?.fileList
                    }}
                  >
                    <Upload name="logo" listType="picture" maxCount={1} beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>Upload Logo</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    label="Favicon"
                    name="favicon"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                      if (Array.isArray(e)) {
                        return e
                      }
                      return e?.fileList
                    }}
                  >
                    <Upload name="favicon" listType="picture" maxCount={1} beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>Upload Favicon</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    label="Site Description"
                    name="siteDescription"
                    initialValue="Your trusted source for the latest news and updates"
                  >
                    <TextArea rows={4} placeholder="Enter site description" />
                  </Form.Item>

                  <Form.Item
                    label="Maintenance Mode"
                    name="maintenanceMode"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>

                  <Form.Item
                    label="Enable User Registration"
                    name="enableRegistration"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </EnhancedCard>
        </TabPane>

        <TabPane
          tab={
            <span>
              <MailOutlined /> Email
            </span>
          }
          key="2"
        >
          <EnhancedCard>
            <Form layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Form.Item
                    label="From Email"
                    name="emailFrom"
                    initialValue="noreply@example.com"
                    rules={[
                      { required: true, message: "Please enter from email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input placeholder="noreply@example.com" />
                  </Form.Item>

                  <Form.Item
                    label="From Name"
                    name="emailName"
                    initialValue="নিরপেক্ষ News"
                    rules={[{ required: true, message: "Please enter from name" }]}
                  >
                    <Input placeholder="Enter from name" />
                  </Form.Item>

                  <Form.Item
                    label="SMTP Host"
                    name="smtpHost"
                    initialValue="smtp.example.com"
                    rules={[{ required: true, message: "Please enter SMTP host" }]}
                  >
                    <Input placeholder="smtp.example.com" />
                  </Form.Item>

                  <Form.Item
                    label="SMTP Port"
                    name="smtpPort"
                    initialValue="587"
                    rules={[{ required: true, message: "Please enter SMTP port" }]}
                  >
                    <Input placeholder="587" />
                  </Form.Item>
                </div>

                <div>
                  <Form.Item
                    label="SMTP Username"
                    name="smtpUsername"
                    initialValue="username"
                    rules={[{ required: true, message: "Please enter SMTP username" }]}
                  >
                    <Input placeholder="Enter SMTP username" />
                  </Form.Item>

                  <Form.Item
                    label="SMTP Password"
                    name="smtpPassword"
                    initialValue="password"
                    rules={[{ required: true, message: "Please enter SMTP password" }]}
                  >
                    <Input.Password placeholder="Enter SMTP password" />
                  </Form.Item>

                  <Form.Item
                    label="SMTP Encryption"
                    name="smtpEncryption"
                    initialValue="tls"
                    rules={[{ required: true, message: "Please select SMTP encryption" }]}
                  >
                    <Select
                      options={[
                        { value: "none", label: "None" },
                        { value: "ssl", label: "SSL" },
                        { value: "tls", label: "TLS" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary">Test Email Configuration</Button>
                  </Form.Item>
                </div>
              </div>

              <EnhancedDivider>Email Templates</EnhancedDivider>

              <Collapse defaultActiveKey={["1"]} className="mb-4">
                <Panel header="Welcome Email" key="1">
                  <Form.Item label="Subject" name="welcomeSubject" initialValue="Welcome to নিরপেক্ষ News">
                    <Input placeholder="Enter email subject" />
                  </Form.Item>

                  <Form.Item
                    label="Content"
                    name="welcomeContent"
                    initialValue="Dear {name},\n\nWelcome to নিরপেক্ষ News! We're excited to have you join our community.\n\nBest regards,\nThe নিরপেক্ষ News Team"
                  >
                    <TextArea rows={6} placeholder="Enter email content" />
                  </Form.Item>
                </Panel>
                <Panel header="Password Reset Email" key="2">
                  <Form.Item label="Subject" name="resetSubject" initialValue="Password Reset Request">
                    <Input placeholder="Enter email subject" />
                  </Form.Item>

                  <Form.Item
                    label="Content"
                    name="resetContent"
                    initialValue="Dear {name},\n\nYou have requested to reset your password. Please click the link below to reset your password:\n\n{reset_link}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe নিরপেক্ষ News Team"
                  >
                    <TextArea rows={6} placeholder="Enter email content" />
                  </Form.Item>
                </Panel>
              </Collapse>
            </Form>
          </EnhancedCard>
        </TabPane>

        <TabPane
          tab={
            <span>
              <MobileOutlined /> Social Media
            </span>
          }
          key="3"
        >
          <EnhancedCard>
            <Form layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Form.Item label="Facebook Page URL" name="facebookUrl" initialValue="https://facebook.com/example">
                    <Input placeholder="https://facebook.com/example" />
                  </Form.Item>

                  <Form.Item label="Twitter/X Handle" name="twitterHandle" initialValue="@example">
                    <Input placeholder="@example" />
                  </Form.Item>

                  <Form.Item label="Instagram Handle" name="instagramHandle" initialValue="@example">
                    <Input placeholder="@example" />
                  </Form.Item>

                  <Form.Item label="YouTube Channel" name="youtubeChannel" initialValue="https://youtube.com/c/example">
                    <Input placeholder="https://youtube.com/c/example" />
                  </Form.Item>
                </div>

                <div>
                  <Form.Item
                    label="LinkedIn Page"
                    name="linkedinPage"
                    initialValue="https://linkedin.com/company/example"
                  >
                    <Input placeholder="https://linkedin.com/company/example" />
                  </Form.Item>

                  <Form.Item label="WhatsApp Number" name="whatsappNumber" initialValue="+1234567890">
                    <Input placeholder="+1234567890" />
                  </Form.Item>

                  <Form.Item label="Telegram Channel" name="telegramChannel" initialValue="@example">
                    <Input placeholder="@example" />
                  </Form.Item>

                  <Form.Item
                    label="Enable Social Sharing"
                    name="enableSocialSharing"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>

                  <Form.Item
                    label="Enable Social Login"
                    name="enableSocialLogin"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>
                </div>
              </div>

              <EnhancedDivider>Social Media API Keys</EnhancedDivider>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item label="Facebook App ID" name="facebookAppId" initialValue="">
                  <Input placeholder="Enter Facebook App ID" />
                </Form.Item>

                <Form.Item label="Facebook App Secret" name="facebookAppSecret" initialValue="">
                  <Input.Password placeholder="Enter Facebook App Secret" />
                </Form.Item>

                <Form.Item label="Google Client ID" name="googleClientId" initialValue="">
                  <Input placeholder="Enter Google Client ID" />
                </Form.Item>

                <Form.Item label="Google Client Secret" name="googleClientSecret" initialValue="">
                  <Input.Password placeholder="Enter Google Client Secret" />
                </Form.Item>
              </div>
            </Form>
          </EnhancedCard>
        </TabPane>

        <TabPane
          tab={
            <span>
              <LockOutlined /> Security
            </span>
          }
          key="4"
        >
          <EnhancedCard>
            <Form layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Form.Item
                    label="Enable HTTPS Redirection"
                    name="enableHttps"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>

                  <Form.Item label="Enable CAPTCHA" name="enableCaptcha" valuePropName="checked" initialValue={true}>
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>

                  <Form.Item
                    label="Enable Two-Factor Authentication"
                    name="enable2FA"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>

                  <Form.Item
                    label="Session Timeout (minutes)"
                    name="sessionTimeout"
                    initialValue={60}
                    rules={[{ required: true, message: "Please enter session timeout" }]}
                  >
                    <Input placeholder="Enter session timeout in minutes" />
                  </Form.Item>
                </div>

                <div>
                  <Form.Item
                    label="Password Policy"
                    name="passwordPolicy"
                    initialValue="medium"
                    rules={[{ required: true, message: "Please select password policy" }]}
                  >
                    <Select
                      options={[
                        { value: "basic", label: "Basic (min 6 characters)" },
                        { value: "medium", label: "Medium (min 8 characters, 1 number)" },
                        { value: "strong", label: "Strong (min 10 characters, uppercase, number, symbol)" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Maximum Login Attempts"
                    name="maxLoginAttempts"
                    initialValue={5}
                    rules={[{ required: true, message: "Please enter maximum login attempts" }]}
                  >
                    <Input placeholder="Enter maximum login attempts" />
                  </Form.Item>

                  <Form.Item
                    label="Lockout Duration (minutes)"
                    name="lockoutDuration"
                    initialValue={30}
                    rules={[{ required: true, message: "Please enter lockout duration" }]}
                  >
                    <Input placeholder="Enter lockout duration in minutes" />
                  </Form.Item>

                  <Form.Item
                    label="Enable Email Verification"
                    name="enableEmailVerification"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>
                </div>
              </div>

              <EnhancedDivider>Content Security</EnhancedDivider>

              <Form.Item
                label="Content Security Policy (CSP)"
                name="csp"
                initialValue="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.gstatic.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: *.googleapis.com *.gstatic.com; font-src 'self' data: *.googleapis.com *.gstatic.com;"
              >
                <TextArea rows={4} placeholder="Enter Content Security Policy" />
              </Form.Item>

              <Form.Item
                label="Enable XSS Protection"
                name="enableXssProtection"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="On" unCheckedChildren="Off" />
              </Form.Item>

              <Form.Item
                label="Enable CSRF Protection"
                name="enableCsrfProtection"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="On" unCheckedChildren="Off" />
              </Form.Item>
            </Form>
          </EnhancedCard>
        </TabPane>

        <TabPane
          tab={
            <span>
              <ApiOutlined /> API & Integrations
            </span>
          }
          key="5"
        >
          <EnhancedCard>
            <Form layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Form.Item label="Enable API Access" name="enableApi" valuePropName="checked" initialValue={true}>
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>

                  <Form.Item label="API Rate Limit (requests per minute)" name="apiRateLimit" initialValue={60}>
                    <Input placeholder="Enter API rate limit" />
                  </Form.Item>

                  <Form.Item label="Google Analytics ID" name="googleAnalyticsId" initialValue="UA-XXXXXXXXX-X">
                    <Input placeholder="Enter Google Analytics ID" />
                  </Form.Item>

                  <Form.Item label="Google Tag Manager ID" name="googleTagManagerId" initialValue="GTM-XXXXXX">
                    <Input placeholder="Enter Google Tag Manager ID" />
                  </Form.Item>
                </div>

                <div>
                  <Form.Item label="Facebook Pixel ID" name="facebookPixelId" initialValue="">
                    <Input placeholder="Enter Facebook Pixel ID" />
                  </Form.Item>

                  <Form.Item label="Disqus Shortname" name="disqusShortname" initialValue="">
                    <Input placeholder="Enter Disqus Shortname" />
                  </Form.Item>

                  <Form.Item label="reCAPTCHA Site Key" name="recaptchaSiteKey" initialValue="">
                    <Input placeholder="Enter reCAPTCHA Site Key" />
                  </Form.Item>

                  <Form.Item label="reCAPTCHA Secret Key" name="recaptchaSecretKey" initialValue="">
                    <Input.Password placeholder="Enter reCAPTCHA Secret Key" />
                  </Form.Item>
                </div>
              </div>

              <EnhancedDivider>Payment Gateways</EnhancedDivider>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Form.Item label="Enable PayPal" name="enablePaypal" valuePropName="checked" initialValue={false}>
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>

                  <Form.Item label="PayPal Client ID" name="paypalClientId" initialValue="">
                    <Input placeholder="Enter PayPal Client ID" />
                  </Form.Item>

                  <Form.Item label="PayPal Secret" name="paypalSecret" initialValue="">
                    <Input.Password placeholder="Enter PayPal Secret" />
                  </Form.Item>
                </div>

                <div>
                  <Form.Item label="Enable Stripe" name="enableStripe" valuePropName="checked" initialValue={false}>
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>

                  <Form.Item label="Stripe Publishable Key" name="stripePublishableKey" initialValue="">
                    <Input placeholder="Enter Stripe Publishable Key" />
                  </Form.Item>

                  <Form.Item label="Stripe Secret Key" name="stripeSecretKey" initialValue="">
                    <Input.Password placeholder="Enter Stripe Secret Key" />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </EnhancedCard>
        </TabPane>

        <TabPane
          tab={
            <span>
              <DatabaseOutlined /> Backup & Maintenance
            </span>
          }
          key="6"
        >
          <EnhancedCard>
            <Form layout="vertical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Form.Item
                    label="Enable Automatic Backups"
                    name="enableAutoBackups"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>

                  <Form.Item label="Backup Frequency" name="backupFrequency" initialValue="daily">
                    <Select
                      options={[
                        { value: "hourly", label: "Hourly" },
                        { value: "daily", label: "Daily" },
                        { value: "weekly", label: "Weekly" },
                        { value: "monthly", label: "Monthly" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item label="Number of Backups to Keep" name="backupsToKeep" initialValue={7}>
                    <Input placeholder="Enter number of backups to keep" />
                  </Form.Item>

                  <Form.Item label="Backup Storage Location" name="backupStorage" initialValue="local">
                    <Select
                      options={[
                        { value: "local", label: "Local Storage" },
                        { value: "s3", label: "Amazon S3" },
                        { value: "dropbox", label: "Dropbox" },
                        { value: "google", label: "Google Drive" },
                      ]}
                    />
                  </Form.Item>
                </div>

                <div>
                  <Form.Item
                    label="Enable Database Optimization"
                    name="enableDbOptimization"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>

                  <Form.Item label="Optimization Frequency" name="optimizationFrequency" initialValue="weekly">
                    <Select
                      options={[
                        { value: "daily", label: "Daily" },
                        { value: "weekly", label: "Weekly" },
                        { value: "monthly", label: "Monthly" },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Enable Error Logging"
                    name="enableErrorLogging"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch checkedChildren="On" unCheckedChildren="Off" />
                  </Form.Item>

                  <Form.Item label="Log Retention Period (days)" name="logRetention" initialValue={30}>
                    <Input placeholder="Enter log retention period in days" />
                  </Form.Item>
                </div>
              </div>

              <EnhancedDivider>Manual Backup</EnhancedDivider>

              <div className="flex flex-col md:flex-row gap-4">
                <EnhancedButton icon={<CloudUploadOutlined />} variant="primary">
                  Create Database Backup
                </EnhancedButton>

                <EnhancedButton icon={<CloudUploadOutlined />} variant="secondary">
                  Create Files Backup
                </EnhancedButton>

                <EnhancedButton icon={<CloudUploadOutlined />} variant="outline">
                  Create Complete Backup
                </EnhancedButton>
              </div>

              <EnhancedDivider>System Maintenance</EnhancedDivider>

              <div className="flex flex-col md:flex-row gap-4">
                <EnhancedButton variant="primary">Clear Cache</EnhancedButton>

                <EnhancedButton variant="secondary">Optimize Database</EnhancedButton>

                <EnhancedButton variant="warning">Clear Logs</EnhancedButton>
              </div>
            </Form>
          </EnhancedCard>
        </TabPane>
      </EnhancedTabs>
    </div>
  )
}
