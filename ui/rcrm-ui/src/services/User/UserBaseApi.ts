import { createApi } from "@reduxjs/toolkit/query";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { commonUserTags, userTags } from "@/service-tags/user-tags";

export const userBaseApi = createApi({
  reducerPath: "userAPI",
  baseQuery: AuthorizedBaseQuery,
  tagTypes: Object.values(userTags),
  endpoints: (builder) => ({}),
});
