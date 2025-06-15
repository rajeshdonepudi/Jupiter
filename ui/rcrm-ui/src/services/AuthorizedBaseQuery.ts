import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { toast } from "react-toastify";
import { logout, tokenReceived } from "@/store/Slices/authSlice";
import { ApiResponse } from "@models/Common/ApiResponse";
import NavUtilities from "@/utilities/NavUtilities";

const baseQuery = retry(
  fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
    prepareHeaders: (headers, { getState }: { getState: any }) => {
      const token = getState().auth.accessToken;

      return headers.set("Authorization", `Bearer ${token}`);
    },
  }),
  {
    maxRetries: 0,
  }
);

const mutex = new Mutex();
const AuthorizedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 400) {
    let { message } = result.error.data as any;
    toast(message);
  }
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      const token = (api.getState() as any)?.auth?.refreshToken;

      try {
        const refreshResult = await baseQuery(
          {
            url: `${import.meta.env.VITE_API_BASE_URL}Account/refresh-token`,
            body: JSON.stringify({
              refreshToken: token,
            }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "post",
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          var refreshTokenResp = refreshResult.data as ApiResponse<{
            jwtToken: string;
            refreshToken: string;
          }>;

          api.dispatch(tokenReceived(refreshTokenResp.data));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  if (result.meta?.response?.status === 403) {
    window.location.href = NavUtilities.ToSecureArea("forbidden");
    toast.error("You do not have access to the request resource.");
  }
  return result;
};

export default AuthorizedBaseQuery;
