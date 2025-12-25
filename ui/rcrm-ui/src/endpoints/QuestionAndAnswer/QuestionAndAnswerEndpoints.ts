export default {
  upsertQuestion: "Question/upsert-question",
  allQuestions: "Question/all-questions",
  deleteQuestion: (questionId: string) => `Question/${questionId}`,

  upsertQuestionBank: "QuestionBank/upsert-question-bank",
  allQuestionBanks: "QuestionBank/all-question-banks",
  deleteQuestionBank: (questionBankId: string) => `QuestionBank/${questionBankId}`,
  getQuestionBank: (questionBankId: string) => `QuestionBank/${questionBankId}`,
};
