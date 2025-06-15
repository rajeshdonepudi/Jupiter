import * as yup from "yup";
import { ExpenseTypeEnum } from "@/enumerations/ExpenseManagement/ExpenseTypeEnum";

export const AddExpenseValidationScheme = () => {
  return yup.object({
    amount: yup
      .number()
      .required("Amount is required")
      .positive("Amount must be greater than zero")
      .typeError("Amount must be a valid number"),

    expenseDate: yup
      .date()
      .max(new Date(), "Expense date cannot be in the future.")
      .min(new Date(2025, 0, 1), "Expense date can't be before the year 2000.")
      .required("Expense date is required."),

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
