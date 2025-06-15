import { TenantInfo } from "@/models/Tenant/TenantInfo";
import { createSlice } from "@reduxjs/toolkit";

export const tenantSlice = createSlice({
  name: "tenant",
  initialState: {
    tenantInfo: {
      name: "",
      id: "",
    },
  },
  reducers: {
    setTenantInfo: (state, action) => {
      state.tenantInfo.name = action.payload.name;
      state.tenantInfo.id = action.payload.id;
    },
  },
});

export const { setTenantInfo } = tenantSlice.actions;
export default tenantSlice.reducer;
export const currentTenantInfo = (state: { tenant: TenantInfo }) =>
  state.tenant;
