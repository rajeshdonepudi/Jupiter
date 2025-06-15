import { createApi } from "@reduxjs/toolkit/query/react";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { ApiResponse } from "@/models/Common/ApiResponse";
import { PagedList } from "@/models/Common/PagedResponse";
import {
  BasicExpenseCategory,
  GetExpenseCategories,
} from "@/models/ExpenseManagement/GetExpenses";
import ExpenseCategoryEndpoints from "@/endpoints/ExpenseManagement/ExpenseCategoryEndpoints";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { AddExpenseCategory } from "@/models/ExpenseManagement/AddExpenseCategory";
import { UpdateExpenseCategory } from "@/models/ExpenseManagement/UpdateExpenseCategory";
import ExpenseManagementSharedServiceTags from "./ExpenseManagementSharedServiceTags";

const serviceTags = {
  allExpenseCategoriesForLookup: "get-all-categories/lookup",
  allExpenseCategories: "get-all-categories",
};

export const expenseCategoryServiceAPI = createApi({
  reducerPath: "expenseCategoryServiceAPI",
  tagTypes: [
    ...Object.values(ExpenseManagementSharedServiceTags),
    ...Object.values(serviceTags),
  ],
  baseQuery: AuthorizedBaseQuery,
  endpoints: (builder) => ({
    getAllCategoriesForLookup: builder.query<
      ApiResponse<KeyValuePair<string, number>[]>,
      null
    >({
      query: () => ({
        url: ExpenseCategoryEndpoints.getAllExpenseCategoriesForLookup,
        method: "GET",
      }),
      providesTags: [serviceTags.allExpenseCategoriesForLookup],
    }),
    getAllExpenseCategories: builder.query<
      ApiResponse<PagedList<BasicExpenseCategory[]>>,
      GetExpenseCategories
    >({
      query: (payload: GetExpenseCategories) => ({
        url: ExpenseCategoryEndpoints.getAllExpenseCategories,
        method: "POST",
        body: payload,
      }),
      providesTags: [serviceTags.allExpenseCategories],
    }),
    addExpenseCategory: builder.mutation<ApiResponse<null>, AddExpenseCategory>(
      {
        query: (payload: AddExpenseCategory) => ({
          url: ExpenseCategoryEndpoints.addExpenseCategory,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [
          serviceTags.allExpenseCategories,
          serviceTags.allExpenseCategoriesForLookup,
        ],
      }
    ),
    updateExpenseCategory: builder.mutation<
      ApiResponse<null>,
      UpdateExpenseCategory
    >({
      query: (payload: UpdateExpenseCategory) => ({
        url: ExpenseCategoryEndpoints.updateExpenseCategory,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [
        serviceTags.allExpenseCategories,
        serviceTags.allExpenseCategoriesForLookup,
      ],
    }),
    deleteExpenseCategory: builder.mutation<ApiResponse<null>, string>({
      query: (categoryId: string) => ({
        url: ExpenseCategoryEndpoints.deleteExpenseCategory(categoryId),
        method: "DELETE",
      }),
      invalidatesTags: [
        serviceTags.allExpenseCategories,
        ExpenseManagementSharedServiceTags.dashboardInfo,
      ],
    }),
  }),
});

export const {
  useAddExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
  useGetAllExpenseCategoriesQuery,
  useGetAllCategoriesForLookupQuery,
} = expenseCategoryServiceAPI;
