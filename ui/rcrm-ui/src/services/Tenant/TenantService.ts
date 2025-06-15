import { createApi } from "@reduxjs/toolkit/query/react";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { ApiResponse } from "@models/Common/ApiResponse";
import { TenantInfo } from "@/models/Tenant/TenantInfo";
import TenantEndpoints from "@/endpoints/Tenant/TenantEndpoints";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { TenantManagementDashboardInfoDto } from "@/models/Tenant/TenantManagementDashboardInfo";
import { PagedList } from "@/models/Common/PagedResponse";
import { PageParams } from "@/models/Common/PageParams";
import { UpsertTenantModel } from "@/models/Tenant/UpsertTenantModel";
import {
  TenantBasicDetail,
  TenantDetails,
} from "@/models/Tenant/TenantDetails";

export const tenantsAPI = createApi({
  reducerPath: "tenantsAPI",
  tagTypes: [
    "tenant-info",
    "tenants-lookup",
    "tenants-dashboard-info",
    "all-tenants",
    "tenant-details",
    "tenant-basic-details",
  ],
  baseQuery: AuthorizedBaseQuery,

  endpoints: (builder) => ({
    getTenantInfo: builder.query<ApiResponse<TenantInfo>, null>({
      query: () => ({
        url: TenantEndpoints.getTenantInfo,
      }),
      providesTags: ["tenant-info"],
    }),
    getTenantDetails: builder.query<ApiResponse<TenantDetails>, string>({
      query: (accountId) => ({
        url: TenantEndpoints.getTenantDetails(accountId),
      }),
      providesTags: ["tenant-details"],
    }),
    getBasicTenantDetails: builder.query<
      ApiResponse<TenantBasicDetail[]>,
      string[]
    >({
      query: (payload: string[]) => ({
        url: TenantEndpoints.getTenantBasicDetails,
        method: "POST",
        body: payload,
      }),
      providesTags: ["tenant-basic-details"],
    }),
    getAllTenants: builder.query<
      ApiResponse<PagedList<TenantDetails>>,
      PageParams
    >({
      query: (payload: PageParams) => ({
        url: TenantEndpoints.getAllTenants,
        method: "POST",
        body: payload,
      }),
      providesTags: ["all-tenants"],
    }),
    getTenantDashboardInfo: builder.query<
      ApiResponse<TenantManagementDashboardInfoDto>,
      null
    >({
      query: () => ({
        url: TenantEndpoints.getTenantDashboardInfo,
      }),
      providesTags: ["tenants-dashboard-info"],
    }),
    getTenantLookupForUserDirectory: builder.query<
      ApiResponse<KeyValuePair<string, string>[]>,
      null
    >({
      query: () => ({
        url: TenantEndpoints.tenantsLookupForDirectory,
        method: "GET",
      }),
      providesTags: ["tenants-lookup"],
    }),
    addTenant: builder.mutation<ApiResponse<any>, UpsertTenantModel>({
      query: (payload: UpsertTenantModel) => ({
        url: TenantEndpoints.addTenant,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["all-tenants", "tenants-dashboard-info"],
    }),
  }),
});

export const {
  useAddTenantMutation,
  useLazyGetTenantInfoQuery,
  useGetTenantDetailsQuery,
  useGetAllTenantsQuery,
  useLazyGetBasicTenantDetailsQuery,
  useGetTenantLookupForUserDirectoryQuery,
  useGetTenantDashboardInfoQuery,
} = tenantsAPI;
