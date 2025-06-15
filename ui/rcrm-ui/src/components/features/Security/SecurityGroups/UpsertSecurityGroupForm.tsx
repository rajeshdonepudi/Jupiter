import AppConstants from "@/constants/constants";
import { UpsertSecurityGroupModel } from "@/models/Security/SecurityGroups/UpsertSecurityGroupModel";
import UpsertSecurityGroupValidationScheme from "@/validation-schemes/Security/SecurityGroups/UpsertSecurityGroupValidationScheme";
import Grid from "@mui/material/Grid2";
import { useFormik } from "formik";
import { lazy, useImperativeHandle } from "react";
const Stack = lazy(() => import("@mui/material/Stack"));
const TextField = lazy(() => import("@mui/material/TextField"));

const UpsertSecurityGroupForm = (props: any) => {
  const formik = useFormik<UpsertSecurityGroupModel>({
    initialValues: {
      name: "",
      id: "",
    },
    validationSchema: UpsertSecurityGroupValidationScheme(props?.actionId),
    onSubmit: (values: UpsertSecurityGroupModel) => {
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
                size="small"
                required={true}
                label={"Name"}
                variant="outlined"
                fullWidth
                value={formik.values?.name}
                onChange={formik.handleChange}
                error={formik.touched?.name && Boolean(formik.errors.name)}
                helperText={formik.touched?.name && formik.errors.name}
              />
            </Grid>
          </Grid>
        </form>
      </Stack>
    </>
  );
};

export default UpsertSecurityGroupForm;
