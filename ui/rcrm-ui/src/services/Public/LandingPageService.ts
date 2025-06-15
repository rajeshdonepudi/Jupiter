import { createApi } from "@reduxjs/toolkit/query/react";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { ApiResponse } from "@models/Common/ApiResponse";
import { SettingTypeEnum } from "@/enumerations/SettingTypeEnum";
import { SiteTheme } from "@/models/Theme/SiteTheme";
import ThemeEndpoints from "@/endpoints/Theme/ThemeEndpoints";

export const landingPageAPI = createApi({
  reducerPath: "landingPageAPI",
  tagTypes: ["site-theme"],
  baseQuery: AuthorizedBaseQuery,

  endpoints: (builder) => ({
    getSiteTheme: builder.query<ApiResponse<SiteTheme>, SettingTypeEnum>({
      query: (type: SettingTypeEnum) => ({
        url: ThemeEndpoints.getPrimarySiteTheme,
      }),
      providesTags: ["site-theme"],
    }),
  }),
});

export const { useGetSiteThemeQuery } = landingPageAPI;
