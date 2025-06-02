"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@/components/theme-context";
import { TFileDocument } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import { PictureOutlined } from "@ant-design/icons";
import { Col, Form, FormInstance, Input, Row, Typography } from "antd";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { GlobalFilePicker } from "../media/global-file-picker";

const { Text } = Typography;

interface MediaSectionProps {
    ogImage?: TFileDocument | null;
    setOgImage: Dispatch<SetStateAction<TFileDocument | undefined>>;
    bannerImage?: TFileDocument | null;
    setBannerImage: Dispatch<SetStateAction<TFileDocument | undefined>>;
    form: FormInstance<any>;
}

export const MediaSection = ({
    form,
    ogImage,
    setOgImage,
    bannerImage,
    setBannerImage,
}: MediaSectionProps) => {
    const [pickerState, setPickerState] = useState<"banner" | "og" | null>(
        null
    );

    const { isDark } = useTheme();

    const handleFileSelect = (files: TFileDocument[]) => {
        const file = files[0];
        if (pickerState === "banner") {
            setBannerImage(file);
            form.setFieldsValue({ banner_image: file });
        } else if (pickerState === "og") {
            setOgImage(file);
            form.setFieldsValue({ og_image: file });
        }
        setPickerState(null);
    };

    const uploadBoxStyle: React.CSSProperties = {
        width: "100%",
        height: 100,
        border: `1px dashed ${isDark ? "#444" : "#d9d9d9"}`,
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
        background: isDark ? "#2A3441" : "#fafafa",
        color: isDark ? "#aaa" : "#999",
    };

    return (
        <>
            <Form.Item name="banner_image" label="Banner Image">
                <div
                    onClick={() => setPickerState("banner")}
                    style={{ ...uploadBoxStyle, position: "relative" }}
                >
                    {bannerImage ? (
                        <>
                            <Image
                                src={fileObjectToLink(bannerImage)}
                                alt="Banner"
                                width={120}
                                height={80}
                                style={{ objectFit: "cover", borderRadius: 8 }}
                            />
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setBannerImage(undefined);
                                    form.setFieldsValue({ banner_image: null });
                                }}
                                style={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    background: "#fff",
                                    borderRadius: "50%",
                                    padding: "2px 6px",
                                    fontSize: 12,
                                    cursor: "pointer",
                                    boxShadow: "0 0 3px rgba(0,0,0,0.3)",
                                }}
                            >
                                ✕
                            </span>
                        </>
                    ) : (
                        <>
                            <PictureOutlined
                                style={{
                                    fontSize: 24,
                                    color: isDark ? "#888" : "#999",
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? "#ccc" : "#666",
                                }}
                            >
                                Upload Banner
                            </Text>
                        </>
                    )}
                </div>
            </Form.Item>

            {bannerImage && (
                <>
                    <Form.Item
                        name="caption_title"
                        label="Caption"
                        rules={[
                            { required: false, message: "Caption is required" },
                        ]}
                    >
                        <Input placeholder="Enter caption" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="thumb_image_width"
                                label="Thumb Image Width"
                                rules={[
                                    {
                                        required: true,
                                        message: "Thumb width is required",
                                    },
                                ]}
                                initialValue={800}
                            >
                                <Input placeholder="e.g., 800" type="number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="thumb_image_height"
                                label="Thumb Image Height"
                                rules={[
                                    {
                                        required: true,
                                        message: "Thumb height is required",
                                    },
                                ]}
                                initialValue={450}
                            >
                                <Input placeholder="e.g., 450" type="number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="banner_image_width"
                                label="Banner Image Width"
                                rules={[
                                    {
                                        required: true,
                                        message: "Banner width is required",
                                    },
                                ]}
                                initialValue={1200}
                            >
                                <Input placeholder="e.g., 1200" type="number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="banner_image_height"
                                label="Banner Image Height"
                                rules={[
                                    {
                                        required: true,
                                        message: "Banner height is required",
                                    },
                                ]}
                            initialValue={600}
                            >
                                <Input placeholder="e.g., 600" type="number" />
                            </Form.Item>
                        </Col>
                    </Row>
                </>
            )}
            <Form.Item name="og_image" label="OG Image">
                <div
                    onClick={() => setPickerState("og")}
                    style={uploadBoxStyle}
                >
                    {ogImage ? (
                        <Image
                            src={fileObjectToLink(ogImage)}
                            alt="OG Image"
                            width={120}
                            height={80}
                            style={{ objectFit: "cover", borderRadius: 8 }}
                        />
                    ) : (
                        <>
                            <PictureOutlined
                                style={{
                                    fontSize: 24,
                                    color: isDark ? "#888" : "#999",
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: isDark ? "#ccc" : "#666",
                                }}
                            >
                                Upload OG Image
                            </Text>
                        </>
                    )}
                </div>
            </Form.Item>

            <GlobalFilePicker
                open={pickerState !== null}
                onCancel={() => setPickerState(null)}
                fileTypes={["image/jpeg", "image/png"]}
                onSelect={handleFileSelect}
                multiple={false}
                initialSelected={
                    pickerState === "banner"
                        ? bannerImage
                            ? [bannerImage]
                            : []
                        : ogImage
                        ? [ogImage]
                        : []
                }
            />
        </>
    );
};
