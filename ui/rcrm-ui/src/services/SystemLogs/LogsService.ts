import { createApi } from "@reduxjs/toolkit/query/react";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { ApiResponse } from "@models/Common/ApiResponse";
import { SystemLog } from "@/models/SystemLogs/SystemLog";
import { FilterLog } from "@/models/SystemLogs/FilterLog";
import { PagedList } from "@/models/Common/PagedResponse";
import LogEndpoints from "@/endpoints/SystemLogs/LogEndpoints";
import { KeyValuePair } from "@/models/Common/KeyValuePair";

export const logsAPI = createApi({
  reducerPath: "logsAPI",
  tagTypes: [
    "system-logs",
    "resource-codes",
    "requests-by-resource-code",
    "controller-codes",
  ],
  baseQuery: AuthorizedBaseQuery,
  endpoints: (builder) => ({
    getResourceCodes: builder.query<ApiResponse<string[]>, null>({
      query: () => ({
        url: LogEndpoints.getResourceCodes,
      }),
      providesTags: ["resource-codes"],
    }),
    getControllerCodes: builder.query<ApiResponse<string[]>, null>({
      query: () => ({
        url: LogEndpoints.getControllerCodes,
      }),
      providesTags: ["controller-codes"],
    }),
    getSystemLogs: builder.query<ApiResponse<PagedList<SystemLog>>, FilterLog>({
      query: (payload: FilterLog) => ({
        url: LogEndpoints.getSystemLogs,
        method: "POST",
        body: payload,
      }),
      keepUnusedDataFor: 0,
    }),
    getNoOfRequestsByResourceCode: builder.query<
      ApiResponse<KeyValuePair<string, number>[]>,
      null
    >({
      query: () => ({
        url: LogEndpoints.getNoOfRequestsByResourceCode,
      }),
      providesTags: ["requests-by-resource-code"],
    }),
  }),
});

export const {
  useLazyGetSystemLogsQuery,
  useGetResourceCodesQuery,
  useGetControllerCodesQuery,
  useGetNoOfRequestsByResourceCodeQuery,
} = logsAPI;
