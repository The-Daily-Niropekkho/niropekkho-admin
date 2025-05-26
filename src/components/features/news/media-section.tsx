"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@/components/theme-context";
import { TFileDocument } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import { PictureOutlined } from "@ant-design/icons";
import { Form, FormInstance, Image, Typography } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { GlobalFilePicker } from "../media/global-file-picker";

const { Text } = Typography;

interface MediaSectionProps {
    ogImage?: TFileDocument | null;
    setOgImage: Dispatch<SetStateAction<TFileDocument | undefined>>
    bannerImage?: TFileDocument | null;
    setBannerImage: Dispatch<SetStateAction<TFileDocument | undefined>>;
    form: FormInstance<any>;
}

export const MediaSection = ({ form, ogImage, setOgImage, bannerImage, setBannerImage }: MediaSectionProps) => {

    const [pickerState, setPickerState] = useState<"banner" | "og" | null>(null);

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
                <div onClick={() => setPickerState("banner")} style={uploadBoxStyle}>
                    {bannerImage ? (
                        <Image
                            src={fileObjectToLink(bannerImage)}
                            alt="Banner"
                            width={120}
                            height={80}
                            style={{ objectFit: "cover", borderRadius: 8 }}
                            preview={false}
                        />
                    ) : (
                        <>
                            <PictureOutlined style={{ fontSize: 24, color: isDark ? "#888" : "#999" }} />
                            <Text style={{ fontSize: 12, color: isDark ? "#ccc" : "#666" }}>
                                Upload Banner
                            </Text>
                        </>
                    )}
                </div>
            </Form.Item>

            <Form.Item name="og_image" label="OG Image">
                <div onClick={() => setPickerState("og")} style={uploadBoxStyle}>
                    {ogImage ? (
                        <Image
                            src={fileObjectToLink(ogImage)}
                            alt="OG Image"
                            width={120}
                            height={80}
                            style={{ objectFit: "cover", borderRadius: 8 }}
                            preview={false}
                        />
                    ) : (
                        <>
                            <PictureOutlined style={{ fontSize: 24, color: isDark ? "#888" : "#999" }} />
                            <Text style={{ fontSize: 12, color: isDark ? "#ccc" : "#666" }}>
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
                        ? bannerImage ? [bannerImage] : []
                        : ogImage ? [ogImage] : []
                }
            />
        </>
    );
};
