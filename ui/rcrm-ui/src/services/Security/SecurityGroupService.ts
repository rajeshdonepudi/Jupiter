import { createApi } from "@reduxjs/toolkit/query/react";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { ApiResponse } from "@models/Common/ApiResponse";
import { PagedList } from "@/models/Common/PagedResponse";
import {
  SecurityGroupBasicDetails,
  SecurityRole,
} from "@/models/Security/SecurityRoleModel";
import { PageParams } from "@/models/Common/PageParams";
import SecurityGroupsEndpoints from "@/endpoints/Security/SecurityGroupsEndpoints";
import { UpsertSecurityGroupModel } from "@/models/Security/SecurityGroups/UpsertSecurityGroupModel";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { SecurityGroupInfoModel } from "@/models/Security/SecurityGroups/SecurityGroupInfoModel";
import { SecurityGroupPermissionsModel } from "@/models/Security/SecurityGroups/SecurityGroupPermissionsModel";
import { AddUsersToSecurityGroup } from "@/models/Users/AddUsersToSecurityGroup";
import { UserModel } from "@/models/Users/UserModel";
import { FilterSecurityGroupUsersModel } from "@/models/Tenant/FilterSecurityGroupUsersModel";
import { DeleteUserFromSecurityGroupModel } from "@/models/Security/SecurityGroups/DeleteUserFromSecurityGroupModel";

export const securityGroupsAPI = createApi({
  reducerPath: "securityGroupsAPI",
  tagTypes: [
    "tenant-security-groups",
    "security-group-info",
    "tenant-security-groups-lookup",
    "security-group-permissions",
    "security-group-users",
    "security-group-basic-details",
  ],
  baseQuery: AuthorizedBaseQuery,
  endpoints: (builder) => ({
    getAllTenantSecurityGroups: builder.query<
      ApiResponse<PagedList<SecurityRole>>,
      PageParams
    >({
      query: (payload) => ({
        url: SecurityGroupsEndpoints.getAllTenantSecurityGroups,
        method: "POST",
        body: payload,
      }),
      providesTags: ["tenant-security-groups"],
    }),
    getBasicSecurityGroupDetails: builder.query<
      ApiResponse<SecurityGroupBasicDetails[]>,
      string[]
    >({
      query: (payload: string[]) => ({
        url: SecurityGroupsEndpoints.getAllBasicSecurityGroupDetails,
        method: "POST",
        body: payload,
      }),
      providesTags: ["security-group-basic-details"],
    }),
    // getAllTenantSecurityGroupsLookup: builder.query<
    //   ApiResponse<KeyValuePair<string, string>[]>,
    //   null
    // >({
    //   query: () => ({
    //     url: SecurityGroupsEndpoints.getAllTenantSecurityGroupsLookup,
    //     method: "GET",
    //   }),
    //   providesTags: ["tenant-security-groups-lookup"],
    // }),
    addNewSecurityGroup: builder.mutation<
      ApiResponse<boolean>,
      UpsertSecurityGroupModel
    >({
      query: (payload: UpsertSecurityGroupModel) => ({
        url: SecurityGroupsEndpoints.addSecurityGroup,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["tenant-security-groups"],
    }),
    updateSecurityGroup: builder.mutation<
      ApiResponse<boolean>,
      UpsertSecurityGroupModel
    >({
      query: (payload: UpsertSecurityGroupModel) => ({
        url: SecurityGroupsEndpoints.updateSecurityGroup,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["tenant-security-groups"],
    }),
    getSecurityGroupPermissions: builder.query<
      ApiResponse<SecurityGroupPermissionsModel[]>,
      string
    >({
      query: (groupId) => ({
        url: SecurityGroupsEndpoints.getSecurityGroupPermissions(groupId),
        method: "GET",
        providesTags: ["security-group-permissions"],
      }),
    }),
    getSecurityGroupInfo: builder.query<
      ApiResponse<SecurityGroupInfoModel>,
      string
    >({
      query: (groupId) => ({
        url: SecurityGroupsEndpoints.getSecurityGroupInfo(groupId),
        method: "GET",
      }),
      providesTags: ["security-group-info"],
    }),
    addUsersToSecurityGroup: builder.mutation<
      ApiResponse<null>,
      AddUsersToSecurityGroup
    >({
      query: (payload: AddUsersToSecurityGroup) => ({
        url: SecurityGroupsEndpoints.addUserToSecurityGroup,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        "security-group-info",
        "security-group-users",
        "tenant-security-groups",
      ],
    }),
    getAllSecurityGroupUsers: builder.query<
      ApiResponse<PagedList<UserModel[]>>,
      FilterSecurityGroupUsersModel
    >({
      query: (payload: FilterSecurityGroupUsersModel) => ({
        url: SecurityGroupsEndpoints.getAllSecurityGroupUsers,
        method: "POST",
        body: payload,
      }),
      providesTags: ["security-group-users"],
    }),
    deleteUserFromSecurityGroup: builder.mutation<
      ApiResponse<boolean>,
      DeleteUserFromSecurityGroupModel
    >({
      query: (payload: DeleteUserFromSecurityGroupModel) => ({
        url: SecurityGroupsEndpoints.deleteUserFromSecurityGroup,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: [
        "tenant-security-groups",
        "security-group-users",
        "security-group-info",
      ],
    }),
    deleteSecurityGroup: builder.mutation<ApiResponse<boolean>, string>({
      query: (payload: string) => ({
        url: SecurityGroupsEndpoints.deleteSecurityGroup(payload),
        method: "DELETE",
      }),
      invalidatesTags: ["tenant-security-groups"],
    }),
  }),
});

export const {
  useGetSecurityGroupInfoQuery,
  useGetSecurityGroupPermissionsQuery,
  useGetAllTenantSecurityGroupsQuery,
  // useGetAllTenantSecurityGroupsLookupQuery,
  useDeleteUserFromSecurityGroupMutation,
  useLazyGetBasicSecurityGroupDetailsQuery,
  useAddNewSecurityGroupMutation,
  useGetAllSecurityGroupUsersQuery,
  useUpdateSecurityGroupMutation,
  useAddUsersToSecurityGroupMutation,
  useDeleteSecurityGroupMutation,
} = securityGroupsAPI;
