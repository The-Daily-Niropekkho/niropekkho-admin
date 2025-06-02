"use client";

import { useDeleteUserMutation } from "@/redux/features/user/userApi";
import { ErrorResponse, User } from "@/types";
import { SerializedError } from "@reduxjs/toolkit";
import { Button, message, Modal } from "antd";
import { useEffect } from "react";

interface DeleteUserProps {
    user: User;
    open: boolean;
    close: () => void;
}

export default function DeleteUserModal({
    user,
    open,
    close,
}: DeleteUserProps) {
    const [
        deleteUser,
        {
            isSuccess: isDeleteSuccess,
            isError: isDeleteError,
            isLoading: isDeleting,
            error: deleteError,
        },
    ] = useDeleteUserMutation();

    useEffect(() => {
        if (isDeleteError) {
            const errorResponse = deleteError as
                | ErrorResponse
                | SerializedError;
            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";
            message.error(errorMessage);
        } else if (isDeleteSuccess) {
            message.success("User Deleted successfully");
        }
    }, [isDeleteError, isDeleteSuccess, deleteError]);

    const handleDeleteAdmin = async () => {
        if (user) {
            await deleteUser(user.id);
            close();
        }
    };

    return (
        <Modal
            title="Delete Admin"
            open={open}
            onCancel={() => close()}
            footer={[
                <Button key="cancel" onClick={() => close()}>
                    Cancel
                </Button>,
                <Button
                    key="delete"
                    danger
                    type="primary"
                    loading={isDeleting}
                    onClick={handleDeleteAdmin}
                >
                    Delete
                </Button>,
            ]}
        >
            <p>
                Are you sure you want to delete ?
            </p>
            <p>This action cannot be undone.</p>
        </Modal>
    );
}
