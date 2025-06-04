"use client";

import { message } from "antd";
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
const imageUrl = "/sample.jpg";

const CanvasViewer = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [regions, setRegions] = useState<Region[]>([]);
    const [imageDimensions, setImageDimensions] = useState({
        width: 0,
        height: 0,
    });
    const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) {
            setRegions(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = "anonymous";
        img.onload = () => {
            imageRef.current = img;
            updateDimensions();
            window.addEventListener("resize", updateDimensions);
        };
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const updateDimensions = () => {
        if (containerRef.current && imageRef.current && canvasRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            const aspectRatio = ORIGINAL_HEIGHT / ORIGINAL_WIDTH;
            const newWidth = containerWidth;
            const newHeight = newWidth * aspectRatio;
            setImageDimensions({ width: newWidth, height: newHeight });
            const canvas = canvasRef.current;
            canvas.width = newWidth;
            canvas.height = newHeight;
            drawCanvas();
        }
    };

    const getScaledCoords = (r: Region) => {
        const scaleX = imageDimensions.width / ORIGINAL_WIDTH;
        const scaleY = imageDimensions.height / ORIGINAL_HEIGHT;
        return {
            x: r.x * scaleX,
            y: r.y * scaleY,
            width: r.width * scaleX,
            height: r.height * scaleY,
        };
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (hoveredRegion) {
            const { x, y, width, height } = getScaledCoords(hoveredRegion);
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fillRect(x, y, width, height);
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
        }
    };

    const getMousePosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x =
            (e.clientX - rect.left) * (canvasRef.current!.width / rect.width);
        const y =
            (e.clientY - rect.top) * (canvasRef.current!.height / rect.height);
        return { x, y };
    };

    const handleHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const { x, y } = getMousePosition(e);
        const hovered = regions.find((r) => {
            const s = getScaledCoords(r);
            return (
                x >= s.x &&
                x <= s.x + s.width &&
                y >= s.y &&
                y <= s.y + s.height
            );
        });
        setHoveredRegion(hovered || null);
        drawCanvas();
    };

    const handleClick = () => {
        if (hoveredRegion) {
            setSelectedRegion(hoveredRegion);
            message.success(`Selected region ${hoveredRegion.id}`);
        }
    };

    return (
        <div style={{ display: "flex", gap: 16, padding: 24 }}>
            <div ref={containerRef} style={{ flex: 3, position: "relative" }}>
                <h3>📰 Page Viewer</h3>
                <div style={{ position: "relative" }}>
                    <img
                        src={imageUrl}
                        ref={imageRef as any}
                        alt="Full Page"
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                        }}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                        }}
                        onMouseMove={handleHover}
                        onClick={handleClick}
                        onMouseLeave={() => {
                            setHoveredRegion(null);
                            drawCanvas();
                        }}
                    />
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <h3>🔍 Preview</h3>
                {selectedRegion ? (
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            aspectRatio: `${selectedRegion.width} / ${selectedRegion.height}`,
                            border: "1px solid #ccc",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={imageUrl}
                            alt="Preview"
                            style={{
                                position: "absolute",
                                top: -selectedRegion.y,
                                left: -selectedRegion.x,
                                width: ORIGINAL_WIDTH,
                                height: ORIGINAL_HEIGHT,
                            }}
                        />
                    </div>
                ) : (
                    <p style={{ color: "#999" }}>
                        Click on a region to preview
                    </p>
                )}
            </div>
        </div>
    );
};

export default CanvasViewer;
