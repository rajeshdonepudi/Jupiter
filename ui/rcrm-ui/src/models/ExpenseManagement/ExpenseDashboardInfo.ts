import { KeyValuePair } from "../Common/KeyValuePair";

export interface ExpenseDashboardInfo {
  totalExpenses: number;
  expensesByType: KeyValuePair<string, number>[];
  expensesByCategory: KeyValuePair<string, number>[];
  last30DaysExpenses: KeyValuePair<string, number>[];
}

export interface ViewExpenseDetail {
  id: string;
  amount: number;
  description: string;
  expenseType: string;
  categoryName: string;
  addedOn: string;
}
