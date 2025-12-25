import { ExpenseTypeEnum } from "@/enumerations/ExpenseManagement/ExpenseTypeEnum";
import { Dayjs } from "dayjs";

export interface AddExpense {
  amount: number;
  type: ExpenseTypeEnum;
  description: string;
  expenseDate: Dayjs | null;
  categoryId: string | null;
}
