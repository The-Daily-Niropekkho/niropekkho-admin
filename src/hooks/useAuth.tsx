import {
    removeUser,
    setUser,
    UserState,
} from "@/redux/features/user/userSlice";
import { useAppDispatch } from "@/redux/hooks";

export default function useAuth() {
    const dispatch = useAppDispatch();

    const login = (userData: UserState) => {
        dispatch(setUser(userData));
    };

    const logout = () => {
        dispatch(removeUser());
    };

    return {
        login,
        logout,
    };
}
