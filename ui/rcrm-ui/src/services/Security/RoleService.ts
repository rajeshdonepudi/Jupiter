import { createApi } from "@reduxjs/toolkit/query/react";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { ApiResponse } from "@models/Common/ApiResponse";
import { KeyValuePair } from "@models/Common/KeyValuePair";
import RoleEndpoints from "@/endpoints/Security/RoleEndpoints";
import { PagedList } from "@/models/Common/PagedResponse";
import { SecurityRole } from "@/models/Security/SecurityRoleModel";
import { PageParams } from "@/models/Common/PageParams";
import { UserInRoleModel } from "@/models/Security/UserInRoleModel";
import { GetUsersInRoleModel } from "@/models/Security/GetUsersInRoleModel";
import { UpsertRoleModel } from "@/models/Security/Roles/UpsertRoleModel";
import { AddUserToRoleModel } from "@/models/Security/Roles/AddUserToRoleModel";
import { RemoveUserFromRoleModel } from "@/models/Security/Roles/RemoveUserFromRoleModel";

export const rolesAPI = createApi({
  reducerPath: "rolesAPI",
  tagTypes: [
    "view-role-details",
    "security-claims",
    "security-roles",
    "users-in-role",
    "all-security-roles",
  ],
  baseQuery: AuthorizedBaseQuery,
  endpoints: (builder) => ({
    getSecurityClaims: builder.query<
      ApiResponse<KeyValuePair<string, string>[]>,
      null
    >({
      query: () => ({
        url: RoleEndpoints.getSecurityClaims,
      }),
      providesTags: ["security-claims"],
    }),
    getRoleInfo: builder.query<ApiResponse<SecurityRole>, string>({
      query: (payload) => ({
        url: RoleEndpoints.getRoleInfo(payload),
      }),
      providesTags: ["view-role-details"],
    }),
    getSecurityRoles: builder.query<
      ApiResponse<KeyValuePair<string, string>[]>,
      null
    >({
      query: () => ({
        url: RoleEndpoints.getSecurityRoles,
      }),
      providesTags: ["security-roles"],
    }),
    getUsersInRole: builder.query<
      ApiResponse<PagedList<UserInRoleModel>>,
      GetUsersInRoleModel
    >({
      query: (payload) => ({
        url: RoleEndpoints.getUsersInRole,
        method: "POST",
        body: payload,
      }),
      providesTags: ["users-in-role"],
    }),
    getAllSecurityRoles: builder.query<
      ApiResponse<PagedList<SecurityRole>>,
      PageParams
    >({
      query: (payload) => ({
        url: RoleEndpoints.getAllSecurityRoles,
        method: "POST",
        body: payload,
      }),
      providesTags: ["all-security-roles"],
    }),
    addRole: builder.mutation<ApiResponse<boolean>, UpsertRoleModel>({
      query: (payload: UpsertRoleModel) => ({
        url: RoleEndpoints.addRole,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["all-security-roles"],
    }),
    updateRole: builder.mutation<ApiResponse<boolean>, UpsertRoleModel>({
      query: (payload: UpsertRoleModel) => ({
        url: RoleEndpoints.updateRole,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["all-security-roles"],
    }),
    addUserToRole: builder.mutation<ApiResponse<boolean>, AddUserToRoleModel>({
      query: (payload: AddUserToRoleModel) => ({
        url: RoleEndpoints.addUserToRole,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["users-in-role", "view-role-details"],
    }),
    removeUserFromRole: builder.mutation<
      ApiResponse<boolean>,
      RemoveUserFromRoleModel
    >({
      query: (payload: RemoveUserFromRoleModel) => ({
        url: RoleEndpoints.removeUserFromRole,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["users-in-role", "view-role-details"],
    }),
    deleteRole: builder.mutation<ApiResponse<boolean>, string>({
      query: (payload: string) => ({
        url: RoleEndpoints.deleteRole(payload),
        method: "DELETE",
      }),
      invalidatesTags: ["all-security-roles"],
    }),
  }),
});

export const {
  useGetRoleInfoQuery,
  useGetSecurityRolesQuery,
  useGetAllSecurityRolesQuery,
  useGetSecurityClaimsQuery,
  useAddUserToRoleMutation,
  useRemoveUserFromRoleMutation,
  useGetUsersInRoleQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesAPI;
