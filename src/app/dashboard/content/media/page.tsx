"use client"
import { useTheme } from "@/components/theme-context"
import { Card, Col, Row } from "antd"

export default function ContentMediaPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

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
          Media Library
        </h1>
        <p style={{ color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.45)" }}>
          Manage your media files and assets.
        </p>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={<span style={{ color: isDark ? "#fff" : "#000" }}>Media Manager</span>}
            variant="borderless"
            style={{
              borderRadius: "8px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              background: isDark ? "#1f1f1f" : "#fff",
            }}
            headStyle={{ borderBottom: `1px solid ${isDark ? "#303030" : "#f0f0f0"}` }}
          >
            <div style={{ padding: "20px", textAlign: "center" }}>
              <p style={{ color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(0, 0, 0, 0.65)" }}>
                Media library content will be displayed here. This is a placeholder page.
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}
