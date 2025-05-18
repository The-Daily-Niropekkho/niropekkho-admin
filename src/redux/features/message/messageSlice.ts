import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
}

interface MessagesState {
  data: Message[];
}

const initialState: MessagesState = {
  data: [
    {
      id: '1',
      title: 'Software Update',
      content: 'Lorem ipsum dolor amet cosec...',
      time: '3 hrs ago',
      read: false,
    },
    {
      id: '2',
      title: 'New User',
      content: 'Lorem ipsum dolor amet cosec...',
      time: '3 hrs ago',
      read: false,
    },
  ], // Mock data; replace with API
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    readMessages: (state) => {
      state.data = state.data.map((item) => ({ ...item, read: true }));
    },
    readMessage: (state, action: PayloadAction<string>) => {
      state.data = state.data.map((item) =>
        item.id === action.payload ? { ...item, read: true } : item
      );
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.data.unshift(action.payload); // Add to top
    },
    clearMessages: (state) => {
      state.data = [];
    },
  },
});

export const { readMessages, readMessage, addMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;