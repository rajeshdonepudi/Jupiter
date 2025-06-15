import { ExpenseTypeEnum } from "@/enumerations/ExpenseManagement/ExpenseTypeEnum";

export interface ExpenseTypeDto {
  type: ExpenseTypeEnum;
  name: string;
}

export interface ExpenseCategoryDto {
  id: string;
  name: string;
}

export interface BasicExpenseDetail {
  id: string;
  amount: number;
  description: string;
  expenseType: ExpenseTypeDto;
  category: ExpenseCategoryDto;
}
