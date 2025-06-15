import { ExpenseTypeEnum } from "@/enumerations/ExpenseManagement/ExpenseTypeEnum";
import { AddExpense } from "./AddExpense";

export interface UpdateExpense extends AddExpense {
  id: string;
}
