import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    siteTheme: {
      primaryColor: undefined,
      secondaryColor: undefined,
      themePreference: undefined,
      isPrimary: undefined,
      id: undefined,
      fontFamily: undefined,
    },
  },
  reducers: {
    updateTheme: (state, action) => {
      state.siteTheme = action.payload;
    },
  },
});

export const { updateTheme } = themeSlice.actions;
export default themeSlice.reducer;
