import { createApi } from "@reduxjs/toolkit/query/react";
import AuthorizedBaseQuery from "../AuthorizedBaseQuery";
import { ApiResponse } from "@models/Common/ApiResponse";
import { Question } from "@/models/QuestionAndAnswer/QuestionModel";
import QuestionAndAnswerEndpoints from "@/endpoints/QuestionAndAnswer/QuestionAndAnswerEndpoints";
import { PagedList } from "@/models/Common/PagedResponse";
import { FilterQuestions } from "@/models/QuestionAndAnswer/FilterQuestionModel";

export const questionsAPI = createApi({
  reducerPath: "questionsAPI",
  tagTypes: ["all-questions"],
  baseQuery: AuthorizedBaseQuery,

  endpoints: (builder) => ({
    upsertQuestion: builder.mutation<ApiResponse<boolean>, Question>({
      query: (payload: Question) => ({
        url: QuestionAndAnswerEndpoints.upsertQuestion,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["all-questions"],
    }),
    deleteQuestion: builder.mutation<ApiResponse<null>, string>({
      query: (payload: string) => ({
        url: QuestionAndAnswerEndpoints.deleteQuestion(payload),
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["all-questions"],
    }),
    getAllQuestions: builder.query<
      ApiResponse<PagedList<Question>>,
      FilterQuestions
    >({
      query: (payload: FilterQuestions) => ({
        url: QuestionAndAnswerEndpoints.allQuestions,
        method: "POST",
        body: payload,
      }),
      keepUnusedDataFor: 0,
      providesTags: ["all-questions"],
    }),
  }),
});

export const {
  useUpsertQuestionMutation,
  useDeleteQuestionMutation,
  useGetAllQuestionsQuery,
} = questionsAPI;
