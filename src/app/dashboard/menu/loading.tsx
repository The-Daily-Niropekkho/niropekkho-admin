"use client";

import { Card, Skeleton, Space } from "antd";

export default function Loading() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <Skeleton.Input style={{ width: 200 }} active />
                <Skeleton.Button active />
            </div>

            <Card className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton.Input style={{ width: 250 }} active />
                    <Space>
                        <Skeleton.Input style={{ width: 150 }} active />
                        <Skeleton.Input style={{ width: 150 }} active />
                    </Space>
                </div>

                <Skeleton active paragraph={{ rows: 10 }} />
            </Card>
        </div>
    );
}
