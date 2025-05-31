"use client";

import { Button, Card, Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
  relation: string;
  linkedPage: string;
  id: number;
}

const ORIGINAL_WIDTH = 800; // Mapping width
const DISPLAY_WIDTH = 1000; // Viewer width
const scale = DISPLAY_WIDTH / ORIGINAL_WIDTH;

const ViewerPage = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const [imageUrl] = useState(
    "https://dailyniropekkho.s3.ap-south-1.amazonaws.com/upload/images/1-1748697489025.jpg"
  );

  useEffect(() => {
    const stored = localStorage.getItem("epaper-mapping-data");
    if (stored) {
      setRegions(JSON.parse(stored));
    }
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>📰 Epaper Viewer</Title>

      <Row gutter={16}>
        {/* Left: Main image with overlays */}
        <Col span={14}>
          <div
            style={{
              position: "relative",
              width: DISPLAY_WIDTH,
              border: "1px solid #ccc",
            }}
          >
            <img
              src={imageUrl}
              alt="Full Page"
              style={{
                width: DISPLAY_WIDTH,
                display: "block",
              }}
            />

            {/* Show all regions */}
            {regions.map((reg) => (
              <div
                key={reg.id}
                onClick={() => setSelectedRegion(reg)}
                style={{
                  position: "absolute",
                  left: reg.x * scale,
                  top: reg.y * scale,
                  width: reg.width * scale,
                  height: reg.height * scale,
                  border: "2px solid #f5222d",
                  backgroundColor: "rgba(245, 34, 45, 0.2)",
                  cursor: "pointer",
                }}
                title={`Page: ${reg.linkedPage} | Relation: ${reg.relation}`}
              />
            ))}
          </div>
        </Col>

        {/* Right: Cropped preview */}
        <Col span={10}>
          <Card title="📌 Cropped Preview" style={{ minHeight: 600 }}>
            {selectedRegion ? (
              <>
                <div
                  style={{
                    width: selectedRegion.width,
                    height: selectedRegion.height,
                    overflow: "hidden",
                    border: "1px solid #d9d9d9",
                    position: "relative",
                    marginBottom: 16,
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="Cropped"
                    style={{
                      position: "absolute",
                      top: -selectedRegion.y,
                      left: -selectedRegion.x,
                      width: ORIGINAL_WIDTH,
                    }}
                  />
                </div>

                <div>
                  <Text>
                    <b>Linked Page:</b> {selectedRegion.linkedPage}
                  </Text>
                  <br />
                  <Text>
                    <b>Relation:</b> {selectedRegion.relation}
                  </Text>
                  <br />
                  <Text>
                    <b>Coordinates:</b> {selectedRegion.x},{selectedRegion.y} →{" "}
                    {selectedRegion.width}×{selectedRegion.height}
                  </Text>
                  <br />
                  <Button
                    danger
                    style={{ marginTop: 12 }}
                    onClick={() => {
                      const filtered = regions.filter(
                        (r) => r.id !== selectedRegion.id
                      );
                      localStorage.setItem(
                        "epaper-mapping-data",
                        JSON.stringify(filtered)
                      );
                      setRegions(filtered);
                      setSelectedRegion(null);
                    }}
                  >
                    Delete This Region
                  </Button>
                </div>
              </>
            ) : (
              <Text>একটি বক্স-এ ক্লিক করুন preview দেখার জন্য।</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewerPage;
