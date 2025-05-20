"use client";

import {
    addSelectedItem,
    clearSelectedItems,
    removeSelectedItem,
    setSelectedItems,
    setUploadProgress,
} from "@/redux/features/media/mediaSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCallback } from "react";

export function useMediaSelection() {
    const dispatch = useAppDispatch();
    const { selectedItems, uploadProgress } = useAppSelector(
        (state) => state.media
    );

    const selectItems = useCallback(
        (ids: number[]) => {
            dispatch(setSelectedItems(ids));
        },
        [dispatch]
    );

    const selectItem = useCallback(
        (id: number) => {
            dispatch(addSelectedItem(id));
        },
        [dispatch]
    );

    const deselectItem = useCallback(
        (id: number) => {
            dispatch(removeSelectedItem(id));
        },
        [dispatch]
    );

    const clearSelection = useCallback(() => {
        dispatch(clearSelectedItems());
    }, [dispatch]);

    const updateUploadProgress = useCallback(
        (progress: number) => {
            dispatch(setUploadProgress(progress));
        },
        [dispatch]
    );

    return {
        selectedItems,
        uploadProgress,
        selectItems,
        selectItem,
        deselectItem,
        clearSelection,
        updateUploadProgress,
    };
}
