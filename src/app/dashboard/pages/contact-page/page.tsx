/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Updated import
import { useTheme } from '@/components/theme-context';
import { Form, Input, Button, Switch, Card, Row, Col, message, Skeleton } from 'antd';
import {
  useGetContactDetailsQuery,
  useUpdateContactMutation,
} from '@/redux/features/contact/contactApi';
import { Contact } from '@/types';

interface ContactFormValues {
  editorName: string;
  content: string;
  address: string;
  phone: string;
  phoneTwo: string;
  email: string;
  website: string;
  latitude: string;
  longitude: string;
  map: string;
}

const ContactPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [form] = Form.useForm<ContactFormValues>();
  const [contentEnabled, setContentEnabled] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams(); // Use useSearchParams for query parameters
  const contactId = searchParams.get('id'); // Extract contactId from query parameters

  // Fetch contact details only when contactId and token are available
  const {
    data: contactData,
    isLoading: isFetching,
    isError: isFetchError,
    error: fetchError,
  } = useGetContactDetailsQuery(contactId as string, {
    skip: !contactId || !localStorage.getItem('token'),
  });

  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();

  // Default form values
  const defaultValues = React.useMemo<ContactFormValues>(
    () => ({
      editorName: 'The Daily Niryekho',
      content: 'সম্পাদক ও প্রকাশক : শুভ্র দত্ত || প্রকাশকালীন সম্পাদক : ড. মোহাম্মদ একরামুল ||',
      address:
        'কার্যালয় (প্রধান) : ৩৬ তলা, ৮৩ নং, আই এফ, রোড, নয়াপল্টন, ঢাকা-১০০০। (প্রকাশকীয় ২৭/১১, তিতুমীর সড়ক, মতিঝিল টাওয়ার, আরিচপুর প্লাজা, (প্রেস মার্কেট)',
      phone: '+880-2432623, বার্তা ও বিজ্ঞাপন: +8801898859550',
      phoneTwo: '',
      email: 'dailyniryopekho@gmail.com',
      website: 'www.dailyniryopekho.com',
      latitude: '',
      longitude: '',
      map: '',
    }),
    []
  );

  // Map API fields to form fields
  const mapApiToForm = React.useCallback(
    (contact: Contact): ContactFormValues => ({
      editorName: contact.editor_name ?? defaultValues.editorName,
      content: contact.content ?? defaultValues.content,
      address: contact.address ?? defaultValues.address,
      phone: contact.phone ?? defaultValues.phone,
      phoneTwo: contact.phoneTwo ?? defaultValues.phoneTwo,
      email: contact.email ?? defaultValues.email,
      website: contact.website ?? defaultValues.website,
      latitude: contact.latitude != null ? String(contact.latitude) : defaultValues.latitude,
      longitude: contact.longitude != null ? String(contact.longitude) : defaultValues.longitude,
      map: contact.map ?? defaultValues.map,
    }),
    [defaultValues]
  );

  // Map form fields to API fields
  const mapFormToApi = (values: ContactFormValues): Contact => ({
    editor_name: values.editorName,
    content: contentEnabled ? values.content : '',
    address: values.address,
    phone: values.phone,
    phoneTwo: values.phoneTwo,
    email: values.email,
    website: values.website,
    latitude: values.latitude ? parseFloat(values.latitude) : undefined,
    longitude: values.longitude ? parseFloat(values.longitude) : undefined,
    map: values.map,
  });

  // Set form values when data is fetched
  useEffect(() => {
    if (contactData?.data) {
      const contact = Array.isArray(contactData.data)
        ? contactData.data[0]
        : contactData.data;
      if (contact) {
        form.setFieldsValue(mapApiToForm(contact));
        setContentEnabled(!!contact.content);
      } else {
        form.setFieldsValue(defaultValues);
        setContentEnabled(true);
      }
    } else {
      form.setFieldsValue(defaultValues);
      setContentEnabled(true);
    }
  }, [contactData, form, mapApiToForm, defaultValues]);

  // Handle form submission
  const onFinish = async (values: ContactFormValues) => {
    if (!localStorage.getItem('token')) {
      message.error('Please log in to update contact settings.');
      router.push('/login');
      return;
    }

    if (!contactId) {
      message.error('Invalid contact ID.');
      return;
    }

    try {
      await updateContact({ id: contactId as string, data: mapFormToApi(values) }).unwrap();
      message.success('Contact settings updated successfully!');
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to update contact settings.';
      message.error(errorMessage);
      if (error?.status === 401) {
        message.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  };

  // Handle content toggle
  const onContentChange = (checked: boolean) => {
    setContentEnabled(checked);
    form.setFieldsValue({
      content: checked
        ? (contactData?.data
            ? Array.isArray(contactData.data)
              ? (contactData.data[0] as Contact)?.content
              : (contactData.data as Contact)?.content
            : defaultValues.content) ?? defaultValues.content
        : '',
    });
  };

  // Handle fetch errors and authentication
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      message.error('Please log in to access contact settings.');
      router.push('/login');
      return;
    }

    if (isFetchError) {
      const errorMessage = (fetchError as any)?.data?.message || 'Failed to fetch contact settings.';
      message.error(errorMessage);
      if ((fetchError as any)?.status === 401) {
        message.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  }, [isFetchError, fetchError, router]);

  // Redirect to login if no token
  if (!localStorage.getItem('token')) {
    return null; // Optionally, render a loading state or redirect immediately
  }

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
          Contact Settings
        </h1>
        <p style={{ color: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.45)' }}>
          Manage and update your contact information.
        </p>
      </div>

      {isFetching ? (
        <Skeleton active title paragraph={{ rows: 8 }} />
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              title={<span style={{ color: isDark ? '#fff' : '#000' }}>Contact Settings</span>}
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
                layout="vertical"
                className="space-y-6"
                disabled={isFetching}
              >
                <Form.Item
                  name="editorName"
                  label="Editor Name"
                  rules={[{ required: true, message: 'Please enter the editor name' }]}
                >
                  <Input />
                </Form.Item>

                <div className="flex items-center gap-4">
                  <Form.Item name="content" label="Content" className="flex-1">
                    <Input.TextArea rows={3} disabled={!contentEnabled} />
                  </Form.Item>
                  <Switch checked={contentEnabled} onChange={onContentChange} />
                </div>

                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: 'Please enter the address' }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[{ required: true, message: 'Please enter the phone number' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item name="phoneTwo" label="Phone Two">
                  <Input />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter the email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="website"
                  label="Website"
                  rules={[
                    { required: true, message: 'Please enter the website' },
                    { type: 'url', message: 'Please enter a valid URL' },
                  ]}
                >
                  <Input />
                </Form.Item>

                <div className="flex gap-4">
                  <Form.Item
                    name="latitude"
                    label="Latitude"
                    className="flex-1"
                    rules={[{ pattern: /^-?\d*\.?\d+$/, message: 'Please enter a valid latitude' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="longitude"
                    label="Longitude"
                    className="flex-1"
                    rules={[{ pattern: /^-?\d*\.?\d+$/, message: 'Please enter a valid longitude' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <Form.Item
                  name="map"
                  label="Map"
                  rules={[{ type: 'url', message: 'Please enter a valid map URL' }]}
                >
                  <Input placeholder="Embed a map src url" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isUpdating}
                    disabled={isFetching}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Update
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ContactPage;