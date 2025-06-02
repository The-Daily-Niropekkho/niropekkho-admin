import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  name: string;
  role: string;
  avatar: string;
}

interface AuthenticationState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthenticationState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;