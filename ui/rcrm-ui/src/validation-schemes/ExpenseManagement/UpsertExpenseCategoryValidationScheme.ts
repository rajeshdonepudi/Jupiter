import * as yup from "yup";

export const UpsertExpenseCategoryValidationScheme = () => {
  return yup.object({
    id: yup.string().optional(),
    name: yup
      .string()
      .required()
      .max(250, "Description cannot exceed 250 characters"),
    description: yup
      .string()
      .optional()
      .max(250, "Description cannot exceed 250 characters"),
  });
};
