import AppAutoComplete from "@/components/ui-components/AppAutoComplete";
import AppConstants from "@/constants/constants";
import { AssignOrUnassignPermissionForTenantModel } from "@/models/Security/Permissions/AssignOrUnassignPermissionForTenantModel";
import { selectAuth } from "@/store/Slices/authSlice";
import ManagePermissionForTenantValidationScheme from "@/validation-schemes/Security/Permissions/ManagePermissionForTenantValidationScheme";
import { useFormik } from "formik";
import { lazy, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
const Stack = lazy(() => import("@mui/material/Stack"));
import Grid from "@mui/material/Grid2";

const ManageTenantPermissionsForm = (props: any) => {
  const { t: commonLocale } = useTranslation();

  const [tenantsInputState, setTenantsInputState] = useState<string[]>([]);

  /***
   * Event handler's
   */

  const formik = useFormik<AssignOrUnassignPermissionForTenantModel>({
    initialValues: {
      tenants: [],
    },
    validationSchema: ManagePermissionForTenantValidationScheme(
      props?.actionId
    ),
    onSubmit: (values: AssignOrUnassignPermissionForTenantModel, h) => {
      props?.onSubmit({
        ...values,
        action: props?.actionId,
      });
    },
  });

  useImperativeHandle(props?.formikRef, () => {
    return {
      submitForm: formik.submitForm,
      resetForm: formik.resetForm,
      setValues: formik.setValues,
    };
  });

  const tenantsRef = useRef<any>(null);
  const { accessToken } = useSelector(selectAuth);

  const fetchTenants = async (inputValue: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }Tenant/tenant-lookup-for-directory?searchTerm=${inputValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Add your token here
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch options");
      }

      const data = await response.json();
      tenantsRef?.current?.setOptions(data?.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  return (
    <>
      <Stack
        direction="column"
        alignItems="center"
        spacing={AppConstants.layout.StandardSpacing}
      >
        <form
          autoComplete="off"
          style={{ minWidth: "300px" }}
          onSubmit={formik.handleSubmit}
        >
          <Grid container spacing={1.5} sx={{ width: "100%" }}>
            <Grid size={{ xs: 12, md: 12 }}>
              <AppAutoComplete
                value={formik.values.tenants}
                setValue={(values: any) => {
                  formik.setFieldValue("tenants", values);
                }}
                getOptionKey={(option: any) => option.value}
                fetchOptions={fetchTenants}
                getOptionLabel={(option: any) => option.key}
                setInputValue={setTenantsInputState}
                inputValue={tenantsInputState}
                label={"Tenants"}
                ref={tenantsRef}
              />
            </Grid>
          </Grid>
        </form>
      </Stack>
    </>
  );
};

export default ManageTenantPermissionsForm;
