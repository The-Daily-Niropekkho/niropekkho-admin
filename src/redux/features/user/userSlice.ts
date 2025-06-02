import { TFileDocument } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    user_type: string;
    is_change_password: boolean;
    roleBaseUserId: string;
    userId: string;
    userUniqueId: string;
    email: string;
    firstName: string;
    lastName: string;
    image: TFileDocument | null;
}

const initialState = {
    user_type: "",
    is_change_password: false,
    roleBaseUserId: "",
    userId: "",
    userUniqueId: "",
    email: "",
    firstName: "",
    lastName: "",
    image: null,
} satisfies UserState as UserState;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(_, action: PayloadAction<UserState>) {
            return action.payload;
        },
        removeUser() {
            return initialState;
        },
    },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
