export default {
  upsertQuestion: "Question/upsert-question",
  allQuestions: "Question/all-questions",
  deleteQuestion: (questionId: string) => `Question/${questionId}`,
};
