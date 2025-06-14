"use client";

import { Button, message, Select, Space, Table } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

const { Option } = Select;

interface Region {
    x: number;
    y: number;
    width: number;
    height: number;
    relation: string;
    linkedPage: string;
    id: number;
}

const LOCAL_KEY = "epaper-mapping-data";

const ORIGINAL_WIDTH = 1600;
const DISPLAY_WIDTH = 1000;
const scale = DISPLAY_WIDTH / ORIGINAL_WIDTH;

const EpaperMapper = () => {
    const [imageUrl] = useState(
        "https://dailyniropekkho.s3.ap-south-1.amazonaws.com/upload/images/1-1748697489025.jpg"
    );
    const [region, setRegion] = useState<Region | null>(null);
    const [regions, setRegions] = useState<Region[]>([]);
    const [selectedRegionId, setSelectedRegionId] = useState<number | null>(
        null
    );

    const [isDragging, setIsDragging] = useState(false);
    const [startPoint, setStartPoint] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [dragBox, setDragBox] = useState<Region | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) {
            setRegions(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Delete") {
                // শুধুমাত্র unsaved region (নতুন region) থাকলে Delete কাজ করবে
                if (region) {
                    setRegion(null);
                    message.info("নতুন বক্সটি বাতিল হয়েছে।");
                }
                // সেভ করা region কীবোর্ড দিয়ে ডিলিট হবে না
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [region]);

    const updateRegion = (updates: Partial<Region>) => {
        if (!region) return;
        setRegion({ ...region, ...updates });
    };

    const saveRegion = () => {
        if (!region?.linkedPage) {
            message.error("Related Page Number দিন।");
            return;
        }

        const updatedRegions = [...regions, region];
        setRegions(updatedRegions);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedRegions));
        setRegion(null);
        message.success("বক্স সেভ হয়েছে!");
    };

    const deleteRegion = (id: number) => {
        const updated = regions.filter((r) => r.id !== id);
        setRegions(updated);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        message.success("মুছে ফেলা হয়েছে।");
    };

    return (
        <div>
            <h2>Epaper Mapping</h2>
            <div className="flex justify-between" style={{ marginBottom: 16 }}>

                {region && (
                    <Space direction="horizontal" size="middle">
                        <Select
                            value={region.relation}
                            onChange={(value) =>
                                updateRegion({ relation: value })
                            }
                            style={{ width: 200 }}
                        >
                            <Option value="No Relation">No Relation</Option>
                            <Option value="Have Next">Have Next</Option>
                            <Option value="Have Previous">Have Previous</Option>
                        </Select>
                        <Select
                            placeholder="Select Related Page"
                            style={{ width: 200 }}
                            value={region.linkedPage}
                            onChange={(value) =>
                                updateRegion({ linkedPage: value })
                            }
                        >
                            {Array.from({ length: 50 }, (_, i) => i + 1).map(
                                (page) => (
                                    <Option key={page} value={String(page)}>
                                        Page {page}
                                    </Option>
                                )
                            )}
                        </Select>
                        <Button type="primary" onClick={saveRegion}>
                            Save This Box
                        </Button>
                        <Button danger onClick={() => setRegion(null)}>
                            Cancel
                        </Button>
                    </Space>
                )}
            </div>

            <div
                className="relative block border border-gray-200"
                style={{ position: "relative", width: DISPLAY_WIDTH }}
                onMouseDown={(e) => {
                    if (region) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / scale;
                    const y = (e.clientY - rect.top) / scale;
                    setStartPoint({ x, y });
                    setIsDragging(true);
                }}
                onMouseMove={(e) => {
                    if (!isDragging || !startPoint) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const currentX = (e.clientX - rect.left) / scale;
                    const currentY = (e.clientY - rect.top) / scale;

                    const x = Math.min(startPoint.x, currentX);
                    const y = Math.min(startPoint.y, currentY);
                    const width = Math.abs(currentX - startPoint.x);
                    const height = Math.abs(currentY - startPoint.y);

                    setDragBox({
                        x,
                        y,
                        width,
                        height,
                        relation: "No Relation",
                        linkedPage: "",
                        id: Date.now(),
                    });
                }}
                onMouseUp={() => {
                    if (!dragBox) return;
                    setIsDragging(false);
                    setStartPoint(null);
                    setRegion(dragBox);
                    setDragBox(null);
                }}
            >
                <Image
                    src={imageUrl}
                    alt="Full Page"
                    style={{ width: "100%", display: "block" }}
                    width={1248}
                    height={2016}
                />

                {/* Saved boxes */}
                {regions.map((reg) => (
                    <div
                        key={reg.id}
                        style={{
                            position: "absolute",
                            left: reg.x * scale,
                            top: reg.y * scale,
                            width: reg.width * scale,
                            height: reg.height * scale,
                            backgroundColor:
                                selectedRegionId === reg.id
                                    ? "rgba(255, 0, 0, 0.3)"
                                    : "rgba(0, 0, 0, 0.3)",
                            border: "2px dashed #52c41a",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            setSelectedRegionId(reg.id);
                        }}
                        title={`Linked: ${reg.linkedPage}, Relation: ${reg.relation}`}
                    />
                ))}

                {/* Temporary drag box */}
                {dragBox && (
                    <div
                        style={{
                            position: "absolute",
                            left: dragBox.x * scale,
                            top: dragBox.y * scale,
                            width: dragBox.width * scale,
                            height: dragBox.height * scale,
                            backgroundColor: "rgba(24, 144, 255, 0.3)",
                            border: "2px solid #1890ff",
                            pointerEvents: "none",
                        }}
                    />
                )}

                {/* Active region with Rnd */}
                {region && (
                    <Rnd
                        size={{
                            width: region.width * scale,
                            height: region.height * scale,
                        }}
                        position={{
                            x: region.x * scale,
                            y: region.y * scale,
                        }}
                        onDragStop={(e, d) =>
                            updateRegion({
                                x: d.x / scale,
                                y: d.y / scale,
                            })
                        }
                        onResizeStop={(e, dir, ref, delta, pos) =>
                            updateRegion({
                                width: parseFloat(ref.style.width) / scale,
                                height: parseFloat(ref.style.height) / scale,
                                x: pos.x / scale,
                                y: pos.y / scale,
                            })
                        }
                        style={{
                            border: "2px solid #1890ff",
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                            cursor: "pointer",
                        }}
                    />
                )}
            </div>

            <h3 style={{ marginTop: 32 }}>🧾 Saved Regions</h3>
            <Table
                dataSource={regions}
                rowKey="id"
                columns={[
                    {
                        title: "Coords",
                        dataIndex: "",
                        render: (_, r) =>
                            `${Math.round(r.x)},${Math.round(r.y)},${Math.round(
                                r.x + r.width
                            )},${Math.round(r.y + r.height)}`,
                    },
                    {
                        title: "Relation",
                        dataIndex: "relation",
                    },
                    {
                        title: "Linked Page",
                        dataIndex: "linkedPage",
                    },
                    {
                        title: "Action",
                        render: (_, r) => (
                            <Button danger onClick={() => deleteRegion(r.id)}>
                                Delete
                            </Button>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default EpaperMapper;
