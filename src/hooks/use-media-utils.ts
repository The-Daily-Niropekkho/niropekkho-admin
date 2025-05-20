"use client";

import type { MediaItem } from "@/types/media";
import { useMemo } from "react";

export function useMediaUtils() {
    // Filter and sort media
    const filterMedia = useMemo(
        () =>
            (
                mediaItems: MediaItem[],
                searchText = "",
                filterType = "all",
                activeFolder = "all",
                sortBy = "date",
                sortOrder: "asc" | "desc" = "desc"
            ) => {
                // Filter
                const filtered = mediaItems.filter((item) => {
                    const matchesSearch =
                        item.name
                            .toLowerCase()
                            .includes(searchText.toLowerCase()) ||
                        item.tags.some((tag) =>
                            tag.toLowerCase().includes(searchText.toLowerCase())
                        ) ||
                        item.uploadedBy
                            .toLowerCase()
                            .includes(searchText.toLowerCase());

                    const matchesFolder =
                        activeFolder === "all" || item.folder === activeFolder;
                    const matchesType =
                        filterType === "all" || item.type === filterType;

                    return matchesSearch && matchesFolder && matchesType;
                });

                // Sort
                return [...filtered].sort((a, b) => {
                    let comparison = 0;

                    switch (sortBy) {
                        case "name":
                            comparison = a.name.localeCompare(b.name);
                            break;
                        case "size":
                            comparison = a.size - b.size;
                            break;
                        case "type":
                            comparison = a.type.localeCompare(b.type);
                            break;
                        case "date":
                        default:
                            comparison =
                                new Date(a.uploadedAt).getTime() -
                                new Date(b.uploadedAt).getTime();
                            break;
                    }

                    return sortOrder === "asc" ? comparison : -comparison;
                });
            },
        []
    );

    // Get unique folders from media items
    const getUniqueFolders = useMemo(
        () => (mediaItems: MediaItem[]) => {
            return Array.from(new Set(mediaItems.map((item) => item.folder)));
        },
        []
    );

    // Get media statistics
    const getMediaStats = useMemo(
        () => (mediaItems: MediaItem[]) => {
            return {
                total: mediaItems.length,
                images: mediaItems.filter((item) => item.type === "image")
                    .length,
                videos: mediaItems.filter((item) => item.type === "video")
                    .length,
                documents: mediaItems.filter((item) => item.type === "document")
                    .length,
                other: mediaItems.filter(
                    (item) =>
                        !["image", "video", "document"].includes(item.type)
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
