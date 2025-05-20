"use client";

import { Breadcrumb, Card, Skeleton } from "antd";

export default function Loading() {
  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Menus</Breadcrumb.Item>
        <Breadcrumb.Item>Loading...</Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Skeleton.Button active />
          <Skeleton.Input style={{ width: 200, marginLeft: 16 }} active />
        </div>
        <Skeleton.Button active />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Menu Structure" className="mb-6">
            <div className="mb-4 flex justify-between items-center">
              <Skeleton.Input style={{ width: 300 }} active />
              <Skeleton.Button active />
            </div>
            <Skeleton active paragraph={{ rows: 10 }} />
          </Card>
        </div>

        <div>
          <Card title="Menu Settings" className="mb-6">
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>

          <Card title="Menu Preview" className="mb-6">
            <Skeleton active paragraph={{ rows: 5 }} />
          </Card>
        </div>
      </div>
    </div>
  )
}
