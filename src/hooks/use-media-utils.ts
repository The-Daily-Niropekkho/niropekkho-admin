"use client";

import type { TFileDocument } from "@/types";
import { useMemo } from "react";

export function useMediaUtils() {
    // Filter and sort media
    const filterMedia = useMemo(
        () =>
            (
                mediaItems: TFileDocument[],
                searchText = "",
                filterType = "all",
                activeFolder = "all",
                sortBy = "date",
                sortOrder: "asc" | "desc" = "desc"
            ) => {
                // Filter
                const filtered = mediaItems.filter((item) => {
                    const matchesSearch =
                        (item?.filename ?? "")
                            .toLowerCase()
                            .includes(searchText.toLowerCase())

                    const matchesFolder =
                        activeFolder === "all" || item.fileType === activeFolder;
                    const matchesType =
                        filterType === "all" || item.fileType === filterType;

                    return matchesSearch && matchesFolder && matchesType;
                });

                // Sort
                return [...filtered].sort((a, b) => {
                    let comparison = 0;

                    switch (sortBy) {
                        case "name":
                            comparison = (a.filename ?? "").localeCompare(b.filename ?? "");
                            break;
                        case "size":
                            comparison = a.size - b.size;
                            break;
                        case "type":
                            comparison = a.fileType.localeCompare(b.fileType);
                            break;
                        case "date":
                        default:
                            comparison =
                                new Date(a.createdAt).getTime() -
                                new Date(b.createdAt).getTime();
                            break;
                    }

                    return sortOrder === "asc" ? comparison : -comparison;
                });
            },
        []
    );

    // Get unique folders from media items
    const getUniqueFolders = useMemo(
        () => (mediaItems: TFileDocument[]) => {
            return Array.from(new Set(mediaItems.map((item) => item.fileType)));
        },
        []
    );

    // Get media statistics
    const getMediaStats = useMemo(
        () => (mediaItems: TFileDocument[]) => {
            return {
                total: mediaItems.length,
                images: mediaItems.filter((item) => item.fileType === "image")
                    .length,
                videos: mediaItems.filter((item) => item.fileType === "video")
                    .length,
                documents: mediaItems.filter((item) => item.fileType === "document")
                    .length,
                other: mediaItems.filter(
                    (item) =>
                        !["image", "video", "document"].includes(item.fileType)
                ).length,
            };
        },
        []
    );

    return {
        filterMedia,
        getUniqueFolders,
        getMediaStats,
    };
}
