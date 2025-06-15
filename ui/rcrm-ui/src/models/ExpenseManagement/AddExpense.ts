import { ExpenseTypeEnum } from "@/enumerations/ExpenseManagement/ExpenseTypeEnum";

export interface AddExpense {
  amount: number;
  type: ExpenseTypeEnum;
  description: string;
  expenseDate: Date | undefined;
  categoryId: string | null;
}
