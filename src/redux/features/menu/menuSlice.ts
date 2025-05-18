import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuState {
  activeMenu: string;
}

const initialState: MenuState = {
  activeMenu: 'dashboard', // Default to dashboard
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setActiveMenu: (state, action: PayloadAction<string>) => {
      state.activeMenu = action.payload;
    },
  },
});

export const { setActiveMenu } = menuSlice.actions;
export default menuSlice.reducer;