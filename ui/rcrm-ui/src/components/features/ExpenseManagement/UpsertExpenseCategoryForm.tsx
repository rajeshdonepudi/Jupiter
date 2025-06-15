import AppConstants from "@/constants/constants";
import { AddExpenseCategory } from "@/models/ExpenseManagement/AddExpenseCategory";
import { UpdateExpenseCategory } from "@/models/ExpenseManagement/UpdateExpenseCategory";
import { UpsertExpenseCategoryValidationScheme } from "@/validation-schemes/ExpenseManagement/UpsertExpenseCategoryValidationScheme";
import { useFormik } from "formik";
import Grid from "@mui/material/Grid2";
import { lazy, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
const Stack = lazy(() => import("@mui/material/Stack"));
const TextField = lazy(() => import("@mui/material/TextField"));

const UpsertExpenseCategoryForm = (props: any) => {
  const { t: commonLocale } = useTranslation();
  const formik = useFormik<AddExpenseCategory | UpdateExpenseCategory>({
    initialValues: {
      description: "",
      name: "",
      id: "",
    },
    validationSchema: UpsertExpenseCategoryValidationScheme,
    onSubmit: (values: AddExpenseCategory | UpdateExpenseCategory) => {
      props?.onSubmit(values);
    },
  });

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
                id="name"
                name="name"
                size="medium"
                required={true}
                label={commonLocale("name")}
                variant="outlined"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched?.name && Boolean(formik.errors.name)}
                helperText={formik.touched?.name && formik.errors.name}
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
          </Grid>
        </form>
      </Stack>
    </>
  );
};

export default UpsertExpenseCategoryForm;
