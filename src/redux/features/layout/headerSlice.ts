// src/redux/headerSearch/slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchItem {
    id: string;
    title: string;
    count: number;
}

interface HeaderSearchState {
    data: SearchItem[];
}

const initialState: HeaderSearchState = {
    data: [],
};

const headerSearchSlice = createSlice({
    name: "headerSearch",
    initialState,
    reducers: {
        setSearchData(state, action: PayloadAction<string>) {
            const query = action.payload.toLowerCase();

            // Mocked search results - replace this with real filtering logic
            const allData: SearchItem[] = [
                { id: "1", title: "John Doe", count: 10 },
                { id: "2", title: "Jane Smith", count: 5 },
                { id: "3", title: "Another User", count: 7 },
            ];

            state.data = query
                ? allData.filter((item) =>
                      item.title.toLowerCase().includes(query)
                  )
                : [];
        },
    },
});

export const { setSearchData } = headerSearchSlice.actions;
export default headerSearchSlice.reducer;
