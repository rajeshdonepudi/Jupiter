import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "@models/Common/ApiResponse";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { UpdateProfilePictureDto } from "@/models/Users/UpdateUserProfilePicture";
import UserEndpoints from "@/endpoints/User/UserEndpoints";
import {
  UserBasicDetails,
  UserModel,
  UserProfileInfo,
} from "@/models/Users/UserModel";
import { UserPermissionsModel } from "@/models/Users/UserPermissionsModel";
import { UserManagementDashboardInfoModel } from "@/models/Users/DashboardInfoModel";
import { RemoveUserPermissionModel } from "@/models/Security/Permissions/RemoveUserPermissionModel";

const userTags = {
  updateProfilePicture: "upload-profile-picture",
  userDetails: "user-details",
  userDashboardInfo: "user-dashboard-info",
  userPermissions: "user-permissions",
  userRoles: "user-roles",
  userProfileInfo: "user-profile-info",
  usersBasicDetails: "users-basic-details",
};

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: AuthorizedBaseQuery,
  tagTypes: Object.values(userTags),
  endpoints: (builder) => ({
    getUserDetails: builder.query<ApiResponse<UserModel>, string>({
      query: (resourceId) => ({
        url: UserEndpoints.getUserInfo(resourceId),
        method: "GET",
      }),
      providesTags: [userTags.userDetails],
    }),
    getUserProfileInfo: builder.query<ApiResponse<UserProfileInfo>, string>({
      query: (resourceId) => ({
        url: UserEndpoints.getUserProfileInfo(resourceId),
        method: "GET",
      }),
      providesTags: [userTags.userProfileInfo],
    }),
    getUsersBasicDetails: builder.query<
      ApiResponse<UserBasicDetails[]>,
      string[]
    >({
      query: (payload: string[]) => ({
        url: UserEndpoints.getUsersBasicDetails,
        method: "POST",
        body: payload,
      }),
      providesTags: [userTags.usersBasicDetails],
    }),
    getUserDashboardInfo: builder.query<
      ApiResponse<UserManagementDashboardInfoModel>,
      null
    >({
      query: () => ({
        url: UserEndpoints.userDashboardInfo,
        method: "GET",
      }),
      providesTags: [userTags.userDashboardInfo],
    }),
    getUserPermissions: builder.query<
      ApiResponse<UserPermissionsModel[]>,
      string
    >({
      query: (resourceId) => ({
        url: UserEndpoints.getUserPermissions(resourceId),
        method: "GET",
      }),
      providesTags: [userTags.userPermissions],
    }),
    getUserRoles: builder.query<ApiResponse<string[]>, string>({
      query: (resourceId) => ({
        url: UserEndpoints.getUserRoles(resourceId),
        method: "GET",
      }),
      providesTags: [userTags.userRoles],
    }),
    removeUserPermission: builder.mutation<
      ApiResponse<boolean>,
      RemoveUserPermissionModel
    >({
      query: (payload: RemoveUserPermissionModel) => ({
        url: UserEndpoints.removeUserPermission,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [userTags.userPermissions],
    }),
    updateProfilePicture: builder.mutation<
      ApiResponse<null>,
      UpdateProfilePictureDto
    >({
      query: (payload: UpdateProfilePictureDto) => ({
        url: UserEndpoints.updateProfilePicture,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["site-primary-theme", userTags.userDetails],
    }),
  }),
});

export const {
  useGetUserDashboardInfoQuery,
  useGetUserPermissionsQuery,
  useGetUserRolesQuery,
  useGetUserDetailsQuery,
  useLazyGetUsersBasicDetailsQuery,
  useRemoveUserPermissionMutation,
  useGetUserProfileInfoQuery,
  useUpdateProfilePictureMutation,
} = userAPI;
