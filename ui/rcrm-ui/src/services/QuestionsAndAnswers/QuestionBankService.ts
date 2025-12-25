import { createApi } from "@reduxjs/toolkit/query/react";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { ApiResponse } from "@models/Common/ApiResponse";
import QuestionAndAnswerEndpoints from "@/endpoints/QuestionAndAnswer/QuestionAndAnswerEndpoints";
import { PagedList } from "@/models/Common/PagedResponse";
import { QuestionBank } from "@/models/QuestionAndAnswer/QuestionBankModel";
import { FilterQuestionBanks } from "@/models/QuestionAndAnswer/FilterQuestionBankModel";

export const questionBanksAPI = createApi({
    reducerPath: "questionBanksAPI",
    tagTypes: ["all-question-banks"],
    baseQuery: AuthorizedBaseQuery,

    endpoints: (builder) => ({
        upsertQuestionBank: builder.mutation<ApiResponse<boolean>, QuestionBank>({
            query: (payload: QuestionBank) => ({
                url: QuestionAndAnswerEndpoints.upsertQuestionBank,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["all-question-banks"],
        }),
        deleteQuestionBank: builder.mutation<ApiResponse<null>, string>({
            query: (payload: string) => ({
                url: QuestionAndAnswerEndpoints.deleteQuestionBank(payload),
                method: "DELETE",
                body: payload,
            }),
            invalidatesTags: ["all-question-banks"],
        }),
        getAllQuestionBanks: builder.query<
            ApiResponse<PagedList<QuestionBank>>,
            FilterQuestionBanks
        >({
            query: (payload: FilterQuestionBanks) => ({
                url: QuestionAndAnswerEndpoints.allQuestionBanks,
                method: "POST",
                body: payload,
            }),
            keepUnusedDataFor: 0,
            providesTags: ["all-question-banks"],
        }),
        getQuestionBank: builder.query<ApiResponse<QuestionBank>, string>({
            query: (payload: string) => ({
                url: QuestionAndAnswerEndpoints.getQuestionBank(payload),
                method: "GET",
            }),
            keepUnusedDataFor: 0,
        }),
    }),
});

export const {
    useUpsertQuestionBankMutation,
    useDeleteQuestionBankMutation,
    useGetAllQuestionBanksQuery,
    useGetQuestionBankQuery,
} = questionBanksAPI;
