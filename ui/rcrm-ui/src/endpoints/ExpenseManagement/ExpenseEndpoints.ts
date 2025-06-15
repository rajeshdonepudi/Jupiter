export default {
  getExpenseDashboardInfo: "Expense/dashboard-info",
  getAllExpenseTypes: "Expense/types",
  getAllExpenses: "Expense/get-all-expenses",
  addExpense: "Expense/add-expense",
  addExpenseBulk: "Expense/add-expenses-bulk",
  updateExpense: `Expense/update`,
  deleteExpense: (expenseId: string) => `Expense/${expenseId}/delete`,
  getExpenseDetails: (expenseId: string) => `Expense/${expenseId}/details`,
};
