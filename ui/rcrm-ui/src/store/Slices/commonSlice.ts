import { CommonStateModel } from "@/models/StateManagementModels/CommonStateModel";
import { jsx } from "@emotion/react";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: CommonStateModel = {
  isDrawerOpen: false,
  isRightDrawerOpen: false,
  expandedGroupIds: [],
  drawerContent: null,
  lastSelectedMenuItem: 0,
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    openRightDrawer: (state) => {
      state.isRightDrawerOpen = true;
    },
    closeRightDrawer: (state) => {
      state.isRightDrawerOpen = false;
    },
    setRightDrawerContent: (state, action: PayloadAction<any>) => {
      state.drawerContent = action.payload;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
      state.expandedGroupIds = [];
      state.lastSelectedMenuItem = 0;
    },
    groupExpanded: (state, action: PayloadAction<number>) => {
      if (!state.expandedGroupIds.includes(action.payload)) {
        state.expandedGroupIds.push(action.payload);
      }
    },
    groupCollapsed: (state, action: PayloadAction<number>) => {
      state.expandedGroupIds = state.expandedGroupIds.filter(
        (id) => id !== action.payload
      );
    },
    setLastSelectedMenuItem: (state, action: PayloadAction<number>) => {
      state.lastSelectedMenuItem = action.payload;
    },
  },
});

export const {
  openDrawer,
  openRightDrawer,
  setRightDrawerContent,
  closeRightDrawer,
  closeDrawer,
  groupExpanded,
  groupCollapsed,
  setLastSelectedMenuItem,
} = commonSlice.actions;
export default commonSlice.reducer;
