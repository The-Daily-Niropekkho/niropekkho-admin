import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
    id: string;
    from: string;
    content: string;
    read: boolean;
    timestamp: string;
}

interface NotificationState {
    data: Notification[];
}

const initialState: NotificationState = {
    data: [
        {
            id: "1",
            from: "System",
            content: "Your profile has been updated.",
            read: false,
            timestamp: "2025-05-17T12:00:00+06:00",
        },
        {
            id: "2",
            from: "Admin",
            content: "New feature available!",
            read: false,
            timestamp: "2025-05-17T10:00:00+06:00",
        },
    ], // Mock data; replace with API
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        readNotifications: (state) => {
            state.data = state.data.map((item) => ({ ...item, read: true }));
        },
        readNotification: (state, action: PayloadAction<string>) => {
            state.data = state.data.map((item) =>
                item.id === action.payload ? { ...item, read: true } : item
            );
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.data.unshift(action.payload); // Add to top
        },
        clearNotifications: (state) => {
            state.data = [];
        },
    },
});

export const {
    readNotifications,
    readNotification,
    addNotification,
    clearNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;
