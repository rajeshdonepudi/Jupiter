import AppConstants from "@/constants/constants";
import MenuProps from "@/constants/menu-props";
import { ExpenseTypeEnum } from "@/enumerations/ExpenseManagement/ExpenseTypeEnum";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { AddExpense } from "@/models/ExpenseManagement/AddExpense";
import { UpdateExpense } from "@/models/ExpenseManagement/UpdateExpense";
import { useGetAllCategoriesForLookupQuery } from "@/services/ExpenseManagement/ExpenseCategoryService";
import { useGetAllExpenseTypesQuery } from "@/services/ExpenseManagement/ExpenseService";
import { AddExpenseValidationScheme } from "@/validation-schemes/ExpenseManagement/AddExpenseValidationScheme";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useFormik } from "formik";
import { lazy, useEffect, useImperativeHandle, useMemo } from "react";
import { useTranslation } from "react-i18next";
const Stack = lazy(() => import("@mui/material/Stack"));
const TextField = lazy(() => import("@mui/material/TextField"));
import Grid from "@mui/material/Grid2";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const UpsertExpenseForm = (props: any) => {
  const { t: commonLocale } = useTranslation();
  const { data: expenseTypesData } = useGetAllExpenseTypesQuery(null);
  const { data: categoriesData } = useGetAllCategoriesForLookupQuery(null);

  const categories = useMemo(() => {
    return categoriesData?.data ?? [];
  }, [categoriesData]);

  const expenseTypes = useMemo(() => {
    return expenseTypesData?.data ?? [];
  }, [expenseTypesData]);

  const formik = useFormik<AddExpense | UpdateExpense>({
    initialValues: {
      amount: 0,
      description: "",
      type: ExpenseTypeEnum.Miscellaneous,
      categoryId: null,
      expenseDate: null,
    },
    validationSchema: AddExpenseValidationScheme,
    onSubmit: (values: AddExpense | UpdateExpense, hel) => {
      props?.onSubmit(values);
    },
  });

  useEffect(() => {
    console.log("Formik errors:", formik.errors);
  }, [formik.errors]);

  useImperativeHandle(props?.formikRef, () => {
    return {
      submitForm: formik.submitForm,
      resetForm: formik.resetForm,
      setValues: formik.setValues,
    };
  });

  return (
    <>
      <Stack
        direction="column"
        alignItems="center"
        spacing={AppConstants.layout.StandardSpacing}
      >
        <form
          autoComplete="off"
          onSubmit={formik.handleSubmit}
          style={{ width: "100%" }}
        >
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 12 }}>
              <TextField
                id="amount"
                name="amount"
                size="medium"
                required={true}
                label={commonLocale("amount")}
                variant="outlined"
                fullWidth
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={formik.touched?.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched?.amount && formik.errors.amount}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <TextField
                id="description"
                name="description"
                size="medium"
                required={true}
                label={commonLocale("description")}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={formik.values?.description}
                onChange={formik.handleChange}
                error={
                  formik.touched?.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched?.description && formik.errors.description
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <FormControl sx={{ width: "100%" }} size="medium">
                <InputLabel id="expense-type">Expense Type</InputLabel>
                <Select
                  labelId="expense-type"
                  id="type"
                  fullWidth
                  name="type"
                  label="Expense Type"
                  value={formik.values.type ?? []}
                  onChange={formik.handleChange}
                  input={<OutlinedInput label="Expense Type" />}
                  MenuProps={MenuProps}
                >
                  {expenseTypes.map((user: KeyValuePair<string, number>) => (
                    <MenuItem key={user.value} value={user.value}>
                      <ListItemText primary={user.key} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <FormControl sx={{ width: "100%" }} size="medium">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="categoryId"
                  fullWidth
                  name="categoryId"
                  label="Category"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  input={<OutlinedInput label="Category" />}
                  MenuProps={MenuProps}
                >
                  {categories.map((user: KeyValuePair<string, number>) => (
                    <MenuItem key={user.value} value={user.value}>
                      <ListItemText primary={user.key} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <DatePicker
                name="expenseDate"
                sx={{ width: "100%" }}
                label="Expense Date"
                value={formik.values.expenseDate}
                onChange={(value) => formik.setFieldValue("expenseDate", value)}
              />
            </Grid>
          </Grid>
        </form>
      </Stack>
    </>
  );
};

export default UpsertExpenseForm;
