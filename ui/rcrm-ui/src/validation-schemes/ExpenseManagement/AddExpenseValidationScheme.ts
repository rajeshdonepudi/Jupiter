import * as yup from "yup";
import { ExpenseTypeEnum } from "@/enumerations/ExpenseManagement/ExpenseTypeEnum";
import dayjs, { Dayjs } from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

export const AddExpenseValidationScheme = () => {
  return yup.object({
    amount: yup
      .number()
      .required("Amount is required")
      .positive("Amount must be greater than zero")
      .typeError("Amount must be a valid number"),

    expenseDate: yup.mixed<Dayjs>(),

    type: yup
      .mixed<ExpenseTypeEnum>()
      .oneOf(Object.values(ExpenseTypeEnum) as any, "Invalid expense type")
      .required("Expense type is required"),

    description: yup
      .string()
      .optional()
      .max(250, "Description cannot exceed 250 characters"),

    categoryId: yup
      .string()
      .required("Category ID is required")
      .matches(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
        "Invalid category ID"
      ),
  });
};
