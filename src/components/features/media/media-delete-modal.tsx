"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "@/components/theme-context";
import { useDeleteMediaMutation } from "@/redux/features/media/mediaApi";
import { message, Modal } from "antd";

interface MediaDeleteModalProps {
    item: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function MediaDeleteModal({
    item,
    isOpen,
    onClose,
}: MediaDeleteModalProps) {
    const [deleteMedia] = useDeleteMediaMutation();
    const { isDark } = useTheme();
    const confirmDelete = () => {
        deleteMedia(item.id)
            .unwrap()
            .then(() => {
                message.success(`${item?.name} has been deleted`);
                onClose();
            })
            .catch((error) => {
                message.error(`Failed to delete: ${error.message}`);
            });
    };

    return (
        <Modal
            title="Confirm Delete"
            open={isOpen}
            onOk={confirmDelete}
            onCancel={onClose}
            okText="Delete"
            okButtonProps={{ danger: true }}
            className={isDark ? "dark-modal" : ""}
        >
            {item && (
                <p>
                    Are you sure you want to delete <strong>{item.name}</strong>
                    ? This action cannot be undone.
                </p>
            )}
        </Modal>
    );
}
