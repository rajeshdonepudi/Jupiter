import { createApi } from "@reduxjs/toolkit/query/react";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { ApiResponse } from "@models/Common/ApiResponse";
import { DomainWhois } from "@/models/Domain/ViewDomainInfoModel";
import DomainEndpoints from "@/endpoints/Domain/DomainEndpoints";

export const domainServiceAPI = createApi({
  reducerPath: "domainServiceAPI",
  tagTypes: ["view-domain-info"],
  baseQuery: AuthorizedBaseQuery,
  endpoints: (builder) => ({
    getDomainInfo: builder.query<ApiResponse<DomainWhois>, string>({
      query: (payload) => ({
        url: DomainEndpoints.getDomainInfo(payload),
        method: "GET",
      }),
      providesTags: ["view-domain-info"],
    }),
  }),
});

export const { useLazyGetDomainInfoQuery } = domainServiceAPI;
