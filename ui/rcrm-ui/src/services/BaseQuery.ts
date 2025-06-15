import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
  prepareHeaders: (headers) => {
    return headers.set("Access-Control-Allow-Origin", "*");
  },
});

const BaseQuery: BaseQueryFn<
  string | FetchArgs,
  any,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);

  switch (result?.meta?.response?.status) {
    case 400:
      // toast(result.error?.data);
      break;
    case 200:
      break;
  }

  return result;
};
export default BaseQuery;
