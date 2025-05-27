"use client";

import { Form, Input } from "antd";

// SEO Section Component
export const SEOSection = () => (
    <>
        <Form.Item name="meta_title" label="Meta Title">
            <Input placeholder="Enter meta title" />
        </Form.Item>

        <Form.Item name="meta_description" label="Meta Description">
            <Input.TextArea rows={4} placeholder="Enter meta description" />
        </Form.Item>

        <Form.Item name="og_title" label="OG Title">
            <Input placeholder="Enter OG title" />
        </Form.Item>

        <Form.Item name="og_description" label="OG Description">
            <Input.TextArea rows={4} placeholder="Enter OG description" />
        </Form.Item>
    </>
);
