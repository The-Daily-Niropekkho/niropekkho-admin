import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeLayoutState {
  darkMode: boolean;
  rtl: boolean;
  topMenu: boolean;
}

const initialState: ThemeLayoutState = {
  darkMode: false,
  rtl: false,
  topMenu: false,
};

const themeLayoutSlice = createSlice({
  name: 'themeLayout',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setRtl: (state, action: PayloadAction<boolean>) => {
      state.rtl = action.payload;
    },
    setTopMenu: (state, action: PayloadAction<boolean>) => {
      state.topMenu = action.payload;
    },
  },
});

export const { setDarkMode, setRtl, setTopMenu } = themeLayoutSlice.actions;
export default themeLayoutSlice.reducer;