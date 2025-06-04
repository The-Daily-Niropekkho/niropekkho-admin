// CanvasMapper.tsx
"use client";

import { Button, Input, Select, Space, Table, message } from "antd";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
  relation: string;
  linkedPage: string;
}

const LOCAL_KEY = "canvas-mapped-regions";
const ORIGINAL_WIDTH = 1600;
const ORIGINAL_HEIGHT = 2560;

const CanvasMapper = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [drawingRegion, setDrawingRegion] = useState<Region | null>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [moving, setMoving] = useState(false);
  const [resizeAnchor, setResizeAnchor] = useState<string | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [relation, setRelation] = useState("No Relation");
  const [linkedPage, setLinkedPage] = useState("");
  const imageUrl = "/sample.jpg";

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      const stored = localStorage.getItem(LOCAL_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRegions(parsed);
        setTimeout(() => drawCanvas(parsed, null), 0);
      } else {
        drawCanvas();
      }
    };
  }, []);

  useEffect(() => {
    drawCanvas(regions, drawingRegion);
  }, [regions, drawingRegion]);

  const drawCanvas = (savedRegions = regions, tempRegion = drawingRegion) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !imageRef.current) return;

    canvas.width = ORIGINAL_WIDTH;
    canvas.height = ORIGINAL_HEIGHT;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    [...savedRegions, ...(tempRegion ? [tempRegion] : [])].forEach((r) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(r.x, r.y, r.width, r.height);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.strokeRect(r.x, r.y, r.width, r.height);
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);
    if (
      drawingRegion &&
      x >= drawingRegion.x + drawingRegion.width - 10 &&
      x <= drawingRegion.x + drawingRegion.width + 10 &&
      y >= drawingRegion.y + drawingRegion.height - 10 &&
      y <= drawingRegion.y + drawingRegion.height + 10
    ) {
      setResizing(true);
      setResizeAnchor("bottom-right");
    } else if (
      drawingRegion &&
      x >= drawingRegion.x &&
      x <= drawingRegion.x + drawingRegion.width &&
      y >= drawingRegion.y &&
      y <= drawingRegion.y + drawingRegion.height
    ) {
      setMoving(true);
      setStartPoint({ x, y });
    } else {
      setStartPoint({ x, y });
      setDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);
    if (resizing && drawingRegion && resizeAnchor === "bottom-right") {
      setDrawingRegion({
        ...drawingRegion,
        width: Math.max(10, x - drawingRegion.x),
        height: Math.max(10, y - drawingRegion.y),
      });
    } else if (moving && drawingRegion && startPoint) {
      const dx = x - startPoint.x;
      const dy = y - startPoint.y;
      setDrawingRegion({
        ...drawingRegion,
        x: drawingRegion.x + dx,
        y: drawingRegion.y + dy,
      });
      setStartPoint({ x, y });
    } else if (dragging && startPoint) {
      setDrawingRegion({
        x: Math.min(startPoint.x, x),
        y: Math.min(startPoint.y, y),
        width: Math.abs(x - startPoint.x),
        height: Math.abs(y - startPoint.y),
        id: Date.now(),
        relation: "No Relation",
        linkedPage: "",
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
    setMoving(false);
    setResizeAnchor(null);
    setStartPoint(null);
  };

  const saveRegion = () => {
    if (!drawingRegion) return;
    const updated: Region = {
      ...drawingRegion,
      relation,
      linkedPage,
    };
    const newRegions = [...regions, updated];
    setRegions(newRegions);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newRegions));
    setDrawingRegion(null);
    setRelation("No Relation");
    setLinkedPage("");
    message.success("Region saved!");
  };

  const deleteSelected = () => {
    if (!drawingRegion) return;
    setDrawingRegion(null);
    message.info("New region discarded");
  };

  const deleteRegion = (id: number) => {
    const updated = regions.filter((r) => r.id !== id);
    setRegions(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    message.success("Region deleted");
  };

  return (
    <div ref={containerRef} style={{ padding: 16 }}>
      <h2>🖊️ Canvas Image Mapper</h2>

      <canvas
        ref={canvasRef}
        style={{ border: "1px solid #ccc", width: "100%", height: "auto", display: "block" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {drawingRegion && (
        <div style={{ marginTop: 16 }}>
          <Space direction="horizontal" style={{ marginBottom: 16 }}>
            <Select value={relation} onChange={setRelation} style={{ width: 200 }}>
              <Select.Option value="No Relation">No Relation</Select.Option>
              <Select.Option value="Next">Next</Select.Option>
              <Select.Option value="Previous">Previous</Select.Option>
            </Select>
            <Input
              placeholder="Related Page Number"
              value={linkedPage}
              onChange={(e) => setLinkedPage(e.target.value)}
              style={{ width: 200 }}
            />
            <Button type="primary" onClick={saveRegion}>Save</Button>
            <Button danger onClick={deleteSelected}>Cancel</Button>
          </Space>
        </div>
      )}

      <h3 style={{ marginTop: 32 }}>🧾 Saved Mappings</h3>
      <Table
        dataSource={regions}
        rowKey="id"
        pagination={false}
        columns={[
          {
            title: "Preview",
            render: (_, r) => (
              <div style={{ width: 100, height: 100, overflow: "hidden", position: "relative" }}>
                <NextImage
                  src={imageUrl}
                  style={{
                    position: "absolute",
                    top: -r.y * (100 / r.height),
                    left: -r.x * (100 / r.width),
                    width: ORIGINAL_WIDTH * (100 / r.width),
                    height: ORIGINAL_HEIGHT * (100 / r.height),
                  }}
                  width={500}
                  height={500}
                  alt="Preview"
                />
              </div>
            ),
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
              <Button danger onClick={() => deleteRegion(r.id)}>Delete</Button>
            ),
          },
        ]}
      />
    </div>
  );
};

export default CanvasMapper;
