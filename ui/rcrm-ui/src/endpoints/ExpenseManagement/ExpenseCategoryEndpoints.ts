var ExpenseCategoryEndpoints = {
  updateExpenseCategory: "ExpenseCategory/update-category",
  addExpenseCategory: "ExpenseCategory/add-category",
  getAllExpenseCategories: "ExpenseCategory/get-all-categories",
  getAllExpenseCategoriesForLookup: "ExpenseCategory/get-all-categories/lookup",
  deleteExpenseCategory: (categoryId: string) =>
    `ExpenseCategory/${categoryId}/delete`,
};

export default ExpenseCategoryEndpoints;
