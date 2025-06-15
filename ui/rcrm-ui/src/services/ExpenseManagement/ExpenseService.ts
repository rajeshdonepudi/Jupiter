import { createApi } from "@reduxjs/toolkit/query/react";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { ApiResponse } from "@/models/Common/ApiResponse";
import { BasicExpenseDetail } from "@/models/ExpenseManagement/BasicExpenseDetail";
import { PagedList } from "@/models/Common/PagedResponse";
import { GetExpenses } from "@/models/ExpenseManagement/GetExpenses";
import ExpenseEndpoints from "@/endpoints/ExpenseManagement/ExpenseEndpoints";
import { AddExpense } from "@/models/ExpenseManagement/AddExpense";
import {
  ExpenseDashboardInfo,
  ViewExpenseDetail,
} from "@/models/ExpenseManagement/ExpenseDashboardInfo";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { UpdateExpense } from "@/models/ExpenseManagement/UpdateExpense";
import ExpenseManagementSharedServiceTags from "./ExpenseManagementSharedServiceTags";

const serviceTags = {
  allExpenses: "all-expenses",
  dashboardInfo: "dashboard-info",
  expenseDetails: "expense-details",
};

export const expenseServiceAPI = createApi({
  reducerPath: "expenseServiceAPI",
  tagTypes: [
    ...Object.values(ExpenseManagementSharedServiceTags),
    ...Object.values(serviceTags),
  ],
  baseQuery: AuthorizedBaseQuery,
  endpoints: (builder) => ({
    getExpenseDetails: builder.query<ApiResponse<ViewExpenseDetail>, string>({
      query: (expenseId) => ({
        url: ExpenseEndpoints.getExpenseDetails(expenseId),
        method: "GET",
      }),
      providesTags: [serviceTags.expenseDetails],
    }),
    getExpensesDashboardInfo: builder.query<
      ApiResponse<ExpenseDashboardInfo>,
      null
    >({
      query: () => ({
        url: ExpenseEndpoints.getExpenseDashboardInfo,
        method: "GET",
      }),
      providesTags: [serviceTags.dashboardInfo],
    }),
    getAllExpenseTypes: builder.query<
      ApiResponse<KeyValuePair<string, number>[]>,
      null
    >({
      query: () => ({
        url: ExpenseEndpoints.getAllExpenseTypes,
        method: "GET",
      }),
    }),
    getAllExpenses: builder.query<
      ApiResponse<PagedList<BasicExpenseDetail[]>>,
      GetExpenses
    >({
      query: (payload: GetExpenses) => ({
        url: ExpenseEndpoints.getAllExpenses,
        method: "POST",
        body: payload,
      }),
      providesTags: [serviceTags.allExpenses],
    }),
    addExpense: builder.mutation<ApiResponse<BasicExpenseDetail>, AddExpense>({
      query: (payload: AddExpense) => ({
        url: ExpenseEndpoints.addExpense,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [serviceTags.allExpenses, serviceTags.dashboardInfo],
    }),
    updateExpense: builder.mutation<ApiResponse<null>, UpdateExpense>({
      query: (payload: UpdateExpense) => ({
        url: ExpenseEndpoints.updateExpense,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [serviceTags.allExpenses, serviceTags.dashboardInfo],
    }),
    deleteExpense: builder.mutation<ApiResponse<null>, string>({
      query: (expenseId: string) => ({
        url: ExpenseEndpoints.deleteExpense(expenseId),
        method: "DELETE",
      }),
      invalidatesTags: [serviceTags.allExpenses, serviceTags.dashboardInfo],
    }),
  }),
});

export const {
  useLazyGetExpenseDetailsQuery,
  useGetExpensesDashboardInfoQuery,
  useGetAllExpenseTypesQuery,
  useGetAllExpensesQuery,
  useDeleteExpenseMutation,
  useUpdateExpenseMutation,
  useAddExpenseMutation,
} = expenseServiceAPI;
