import { createApi } from "@reduxjs/toolkit/query/react";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { ApiResponse } from "@models/Common/ApiResponse";
import { GroupedPermissions } from "@/models/Security/Permissions/GroupedPermissionsModel";
import PermissionEndpoints from "@/endpoints/Security/PermissionEndpoints";
import { ManagePermissionsModel } from "@/models/Security/Permissions/ManagePermissionsModel";
import { ManagePermissionsForTenantModel } from "@/models/Security/Permissions/ManagePermissionsForTenantModel";
import { RemoveUserPermissionModel } from "@/models/Security/Permissions/RemoveUserPermissionModel";

export const permissionsAPI = createApi({
  reducerPath: "permissionsAPI",
  tagTypes: ["all-permissions", "all-tenant-permissions"],
  baseQuery: AuthorizedBaseQuery,
  endpoints: (builder) => ({
    getAllPermissions: builder.query<ApiResponse<GroupedPermissions[]>, null>({
      query: () => ({
        url: PermissionEndpoints.getAllPermissions,
      }),
      providesTags: ["all-permissions"],
    }),
    getAllTenantPermissions: builder.query<
      ApiResponse<GroupedPermissions[]>,
      null
    >({
      query: () => ({
        url: PermissionEndpoints.getAllTenantPermissions,
      }),
      providesTags: ["all-tenant-permissions"],
    }),

    managePermissions: builder.mutation<
      ApiResponse<boolean>,
      ManagePermissionsModel
    >({
      query: (payload: ManagePermissionsModel) => ({
        url: PermissionEndpoints.managePermissions,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["all-permissions"],
    }),
    managePermissionsForTenant: builder.mutation<
      ApiResponse<boolean>,
      ManagePermissionsForTenantModel
    >({
      query: (payload: ManagePermissionsForTenantModel) => ({
        url: PermissionEndpoints.managePermissionsForTenant,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["all-permissions"],
    }),
  }),
});

export const {
  useGetAllPermissionsQuery,
  useGetAllTenantPermissionsQuery,
  useManagePermissionsForTenantMutation,
  useManagePermissionsMutation,
} = permissionsAPI;
