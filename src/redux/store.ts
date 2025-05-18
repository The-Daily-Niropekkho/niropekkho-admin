import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "./features/auth/authSlice";
import languageReducer from "./features/lang/langSlice";
import headerSearchReducer from "./features/layout/headerSlice";
import themeLayoutReducer from "./features/layout/themeSlice";
import menuReducer from "./features/menu/menuSlice";
import messagesReducer from "./features/message/messageSlice";
import notificationReducer from "./features/notification/notificationSlice";

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        headerSearch: headerSearchReducer,
        themeLayout: themeLayoutReducer,
        auth: authReducer,
        language: languageReducer,
        notification: notificationReducer,
        messages: messagesReducer,
        menu: menuReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(
            baseApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
