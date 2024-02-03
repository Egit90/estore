import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ThemeState {
  isDark: boolean;
}

const storedIsDark = localStorage.getItem("isDark");
let initialIsDark: boolean;

if (storedIsDark) {
  initialIsDark = JSON.parse(storedIsDark);
} else {
  initialIsDark = true;
  localStorage.setItem("isDark", JSON.stringify(true));
}

const initialState: ThemeState = {
  isDark: initialIsDark,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDarkTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
      localStorage.setItem("isDark", JSON.stringify(action.payload));
    },
  },
});

export const { setDarkTheme } = themeSlice.actions;

export default themeSlice.reducer;
