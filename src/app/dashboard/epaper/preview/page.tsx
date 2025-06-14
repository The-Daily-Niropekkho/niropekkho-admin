"use client";

import { Button, Card, Col, Row, Typography } from "antd";
import Image from "next/image";
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

const ORIGINAL_WIDTH = 1600;
const ORIGINAL_HEIGHT = 2560;
const DISPLAY_WIDTH = 1000; // Width in UI
const scale = DISPLAY_WIDTH / ORIGINAL_WIDTH;
console.log(scale);

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
        {/* Left side image viewer */}
        <Col span={18}>
          <div
            style={{
              position: "relative",
              width: DISPLAY_WIDTH,
              border: "1px solid #ccc",
            }}
          >
            <Image
              src={imageUrl}
              alt="Full Page"
              style={{
                width: "100%",
                display: "block",
              }}
              width={1248}
              height={2016}
            />

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

        {/* Right side cropped preview */}
        <Col span={6}>
          <Card title="📌 Cropped Preview" style={{ minHeight: 600 }}>
            {selectedRegion ? (
              <>
                <div
                  style={{
                    width: selectedRegion.width * scale,
                    height: selectedRegion.height * scale,
                    overflow: "hidden",
                    border: "1px solid #d9d9d9",
                    position: "relative",
                    marginBottom: 16,
                  }}
                >
                  <Image
                    src={imageUrl}
                    alt="Cropped"
                    style={{
                      position: "absolute",
                      top: -selectedRegion.y * scale,
                      left: -selectedRegion.x * scale,
                      width: DISPLAY_WIDTH,
                      height: "auto",
                    }}
                    width={DISPLAY_WIDTH}
                    height={(DISPLAY_WIDTH * ORIGINAL_HEIGHT) / ORIGINAL_WIDTH}
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
                    <b>Coordinates:</b> {selectedRegion.x}, {selectedRegion.y} →{" "}
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
