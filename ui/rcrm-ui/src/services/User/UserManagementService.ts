import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "@models/Common/ApiResponse";
import { PageParams } from "@models/Common/PageParams";
import { PagedList } from "@models/Common/PagedResponse";
import { UserManagementDashboardInfoModel } from "@models/Users/DashboardInfoModel";
import { UserModel } from "@models/Users/UserModel";
import { UpsertTenantUserModel } from "@/models/Users/UpsertTenantUserModel";
import { UpsertUserModel } from "@/models/Users/UpsertUserModel";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import UserManagementEndpoints from "@/endpoints/User/UserManagementEndpoints";
import { UserCreatedByYear } from "@/models/Users/reports/UsersCreatedByYear";
import { TakeUserBulkAction } from "@/models/Users/TakeUserBulkActionModel";
import { FilterUserDirectory } from "@/models/Users/FilterUserDirectory";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { FilterTenantUsersModel } from "@/models/Tenant/FilterTenantUsersModel";

const userManagementTags = {
  manageUserList: "USER_MANAGEMENT_USERS_LIST",
  userManagementDashboardInfo: "USER_MANAGEMENT_DASHBOARD_INFO",
  userCreatedByYear: "users-created-by-year",
  getAllUsersForDirectory: "users-list-for-directory",
  userLookupForDirectory: "user-lookup-for-directory",
  getUser: "user-info",
  securityGroupUsers: "security-group-users",
};

export const userManagementAPI = createApi({
  reducerPath: "userManagementAPI",
  baseQuery: AuthorizedBaseQuery,
  tagTypes: [
    userManagementTags.manageUserList,
    userManagementTags.userManagementDashboardInfo,
    userManagementTags.userCreatedByYear,
    userManagementTags.getAllUsersForDirectory,
    userManagementTags.securityGroupUsers,
  ],
  endpoints: (builder) => ({
    getUser: builder.query<ApiResponse<UserModel>, string>({
      query: (userId) => ({
        url: UserManagementEndpoints.getUser(userId),
        method: "GET",
        providesTags: [userManagementTags.getUser],
      }),
    }),
    getAllUsers: builder.query<ApiResponse<PagedList<UserModel[]>>, PageParams>(
      {
        query: (payload: PageParams) => ({
          url: UserManagementEndpoints.allUsers,
          method: "POST",
          body: payload,
        }),
        providesTags: [userManagementTags.manageUserList],
      }
    ),
    getAllTenantUsers: builder.query<
      ApiResponse<PagedList<UserModel[]>>,
      FilterTenantUsersModel
    >({
      query: (payload: FilterTenantUsersModel) => ({
        url: UserManagementEndpoints.allTenantUsers,
        method: "POST",
        body: payload,
      }),
      providesTags: [userManagementTags.manageUserList],
    }),
    getUserManagementDashboardInfo: builder.query<
      ApiResponse<UserManagementDashboardInfoModel>,
      null
    >({
      query: () => ({
        url: UserManagementEndpoints.userManagementDashboardInfo,
        method: "GET",
        providesTags: [userManagementTags.userManagementDashboardInfo],
      }),
      providesTags: [userManagementTags.userManagementDashboardInfo],
    }),
    getTenantUserManagementDashboardInfo: builder.query<
      ApiResponse<UserManagementDashboardInfoModel>,
      string
    >({
      query: (accountAlias) => ({
        url: UserManagementEndpoints.tenantUserManagementDashboardInfo(
          accountAlias
        ),
        method: "GET",
        providesTags: [userManagementTags.userManagementDashboardInfo],
      }),
      providesTags: [userManagementTags.userManagementDashboardInfo],
    }),
    upsertUser: builder.mutation<ApiResponse<null>, UpsertUserModel>({
      query: (payload: UpsertUserModel) => ({
        url: UserManagementEndpoints.addUser,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        userManagementTags.manageUserList,
        userManagementTags.userManagementDashboardInfo,
        userManagementTags.userCreatedByYear,
      ],
    }),
    upsertTenantUser: builder.mutation<
      ApiResponse<null>,
      UpsertTenantUserModel
    >({
      query: (payload: UpsertTenantUserModel) => ({
        url: UserManagementEndpoints.upsertTenantUser,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        userManagementTags.manageUserList,
        userManagementTags.userManagementDashboardInfo,
        userManagementTags.userCreatedByYear,
      ],
    }),
    deleteUser: builder.mutation<ApiResponse<boolean>, string>({
      query: (resourceAlias: string) => ({
        url: UserManagementEndpoints.deleteUser(resourceAlias),
        method: "DELETE",
      }),
      invalidatesTags: [
        userManagementTags.manageUserList,
        userManagementTags.userManagementDashboardInfo,
        userManagementTags.userCreatedByYear,
      ],
    }),
    getUsersCreatedByYear: builder.query<ApiResponse<UserCreatedByYear>, null>({
      query: () => ({
        url: UserManagementEndpoints.userCreatedByYear,
      }),
      providesTags: [userManagementTags.userCreatedByYear],
    }),
    takeUserBulkAction: builder.mutation<ApiResponse<null>, TakeUserBulkAction>(
      {
        query: (payload: TakeUserBulkAction) => ({
          url: UserManagementEndpoints.takeBulkAction,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [
          userManagementTags.manageUserList,
          userManagementTags.userManagementDashboardInfo,
          userManagementTags.userCreatedByYear,
          userManagementTags.getAllUsersForDirectory,
        ],
      }
    ),
    getAllUsersForUserDirectory: builder.query<
      ApiResponse<PagedList<UserModel>>,
      FilterUserDirectory
    >({
      query: (payload: FilterUserDirectory) => ({
        url: UserManagementEndpoints.filterUserDirectory,
        method: "POST",
        body: payload,
      }),
      keepUnusedDataFor: 0,
      providesTags: [userManagementTags.getAllUsersForDirectory],
    }),
    getUsersLookupForUserDirectory: builder.query<
      ApiResponse<KeyValuePair<string, string>[]>,
      null
    >({
      query: () => ({
        url: UserManagementEndpoints.userLookupForDirectory,
        method: "GET",
        providesTags: [userManagementTags.userManagementDashboardInfo],
      }),
      providesTags: [userManagementTags.userLookupForDirectory],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetAllTenantUsersQuery,
  useUpsertTenantUserMutation,
  useUpsertUserMutation,
  useGetUserQuery,
  useDeleteUserMutation,
  useGetUserManagementDashboardInfoQuery,
  useGetTenantUserManagementDashboardInfoQuery,
  useGetUsersCreatedByYearQuery,
  useTakeUserBulkActionMutation,
  useGetAllUsersForUserDirectoryQuery,
  useGetUsersLookupForUserDirectoryQuery,
} = userManagementAPI;
