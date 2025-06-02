import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface MediaSelectionState {
  selectedItems: number[]
  uploadProgress: number
}

const initialState: MediaSelectionState = {
  selectedItems: [],
  uploadProgress: 0,
}

const mediaSelectionSlice = createSlice({
  name: "mediaSelection",
  initialState,
  reducers: {
    setSelectedItems: (state, action: PayloadAction<number[]>) => {
      state.selectedItems = action.payload
    },
    addSelectedItem: (state, action: PayloadAction<number>) => {
      if (!state.selectedItems.includes(action.payload)) {
        state.selectedItems.push(action.payload)
      }
    },
    removeSelectedItem: (state, action: PayloadAction<number>) => {
      state.selectedItems = state.selectedItems.filter((id) => id !== action.payload)
    },
    clearSelectedItems: (state) => {
      state.selectedItems = []
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload
    },
  },
})

export const { setSelectedItems, addSelectedItem, removeSelectedItem, clearSelectedItems, setUploadProgress } =
  mediaSelectionSlice.actions

export default mediaSelectionSlice.reducer
