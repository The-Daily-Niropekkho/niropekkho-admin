"use client";

import React, { useState } from 'react';
import { useTheme } from '@/components/theme-context';
import { Form, Input, Button, Switch, Card, Row, Col, message } from 'antd';

const initialValues = {
  editorName: 'The Daily Niryekho',
  content: 'সম্পাদক ও প্রকাশক : শুভ্র দত্ত || প্রকাশকালীন সম্পাদক : ড. মোহাম্মদ একরামুল ||',
  address: 'কার্যালয় (প্রধান) : ৩৬ তলা, ৮৩ নং, আই এফ, রোড, নয়াপল্টন, ঢাকা-১০০০। (প্রকাশকীয় ২৭/১১, তিতুমীর সড়ক, মতিঝিল টাওয়ার, আরিচপুর প্লাজা, (প্রেস মার্কেট)',
  phone: '+880-2432623, বার্তা ও বিজ্ঞাপন: +8801898859550',
  phoneTwo: '',
  email: 'dailyniryopekho@gmail.com',
  website: 'www.dailyniryopekho.com',
  latitude: '',
  longitude: '',
  map: '',
};

const Page: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [contentEnabled, setContentEnabled] = useState(true);

  const onFinish = async (values: typeof initialValues) => {
    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Contact settings updated successfully!');
      } else {
        message.error(data.message || 'Failed to update contact settings.');
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onContentChange = (checked: boolean) => {
    setContentEnabled(checked);
    if (!checked) {
      form.setFieldsValue({ content: '' });
    } else {
      form.setFieldsValue({ content: initialValues.content });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: isDark ? '#fff' : '#000',
          }}
        >
          Contact settings
        </h1>
        <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.45)' }}>
          Manage and update your contact information.
        </p>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={<span style={{ color: isDark ? '#fff' : '#000' }}>Contact Settings</span>}
            variant="borderless"
            style={{
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              background: isDark ? '#1f1f1f' : '#fff',
            }}
            headStyle={{ borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}` }}
          >
            <Form
              form={form}
              name="contact-settings"
              onFinish={onFinish}
              initialValues={initialValues}
              layout="vertical"
              className="space-y-6"
            >
              {/* Editor Name */}
              <Form.Item name="editorName" label="Editor Name" className="mb-4">
                <Input className="w-full" />
              </Form.Item>

              {/* Content with Toggle */}
              <div className="flex items-center justify-between mb-4">
                <Form.Item name="content" label="Content" className="flex-1 mr-4">
                  <Input.TextArea
                    rows={3}
                    className="w-full"
                    disabled={!contentEnabled}
                  />
                </Form.Item>
                <Switch
                  checked={contentEnabled}
                  onChange={onContentChange}
                  className="ml-4"
                />
              </div>

              {/* Address */}
              <Form.Item name="address" label="Address" className="mb-4">
                <Input.TextArea rows={3} className="w-full" />
              </Form.Item>

              {/* Phone */}
              <Form.Item name="phone" label="Phone" className="mb-4">
                <Input className="w-full" />
              </Form.Item>

              {/* Phone Two */}
              <Form.Item name="phoneTwo" label="Phone Two" className="mb-4">
                <Input className="w-full" />
              </Form.Item>

              {/* Email */}
              <Form.Item name="email" label="Email" rules={[{ type: 'email' }]} className="mb-4">
                <Input className="w-full" />
              </Form.Item>

              {/* Website */}
              <Form.Item name="website" label="Website" className="mb-4">
                <Input className="w-full" />
              </Form.Item>

              {/* Latitude and Longitude */}
              <div className="flex space-x-4 mb-4">
                <Form.Item name="latitude" label="Latitude" className="flex-1">
                  <Input className="w-full" />
                </Form.Item>
                <Form.Item name="longitude" label="Longitude" className="flex-1">
                  <Input className="w-full" />
                </Form.Item>
              </div>

              {/* Map */}
              <Form.Item name="map" label="Map" className="mb-4">
                <Input placeholder="Embed a map src url" className="w-full" />
              </Form.Item>

              {/* Update Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Page;