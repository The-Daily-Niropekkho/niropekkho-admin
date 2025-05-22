import { Card, Skeleton } from "antd"

export default function Loading() {
  return (
    <Card>
      <Skeleton active paragraph={{ rows: 1 }} className="mb-6" />
      <Skeleton active paragraph={{ rows: 10 }} />
    </Card>
  )
}
