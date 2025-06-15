import { createApi } from "@reduxjs/toolkit/query/react";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { ApiResponse } from "@models/Common/ApiResponse";
import { UpsertSiteTheme } from "@/models/Theme/UpsertSiteTheme";
import ThemeEndpoints from "@/endpoints/Theme/ThemeEndpoints";
import { SiteTheme } from "@/models/Theme/SiteTheme";

export const siteThemesAPI = createApi({
  reducerPath: "siteThemesAPI",
  tagTypes: ["site-primary-theme", "all-site-themes"],
  baseQuery: AuthorizedBaseQuery,
  endpoints: (builder) => ({
    getPrimaryTheme: builder.query<ApiResponse<SiteTheme>, null>({
      query: () => ({
        url: ThemeEndpoints.getPrimarySiteTheme,
        method: "GET",
      }),
      providesTags: ["site-primary-theme"],
    }),
    getAllThemes: builder.query<ApiResponse<SiteTheme[]>, null>({
      query: () => ({
        url: ThemeEndpoints.getAllThemes,
        method: "GET",
      }),
      providesTags: ["all-site-themes"],
    }),
    deleteTheme: builder.mutation<ApiResponse<any>, string>({
      query: (themeId: string) => ({
        url: ThemeEndpoints.deleteTheme(themeId),
        method: "DELETE",
      }),
      invalidatesTags: ["all-site-themes"],
    }),
    updateTheme: builder.mutation<ApiResponse<any>, UpsertSiteTheme>({
      query: (payload: UpsertSiteTheme) => ({
        url: ThemeEndpoints.updateTheme,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["all-site-themes"],
    }),
    addTheme: builder.mutation<ApiResponse<any>, UpsertSiteTheme>({
      query: (payload: UpsertSiteTheme) => ({
        url: ThemeEndpoints.addTheme,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["all-site-themes"],
    }),
  }),
});

export const {
  useAddThemeMutation,
  useUpdateThemeMutation,
  useLazyGetPrimaryThemeQuery,
  useGetPrimaryThemeQuery,
  useGetAllThemesQuery,
  useDeleteThemeMutation,
} = siteThemesAPI;
