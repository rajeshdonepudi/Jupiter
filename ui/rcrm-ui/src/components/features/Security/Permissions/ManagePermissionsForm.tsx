import AppAutoComplete from "@/components/ui-components/AppAutoComplete";
import AppConstants from "@/constants/constants";
import SecurityGroupsEndpoints from "@/endpoints/Security/SecurityGroupsEndpoints";
import UserEndpoints from "@/endpoints/User/UserEndpoints";
import { PermissionsActions } from "@/enumerations/Security/Permissions/permissions-actions.enum";
import { ApiResponse } from "@/models/Common/ApiResponse";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { AssignOrUnassignPermissionModel } from "@/models/Security/Permissions/AssignOrUnassignPermissionModel";
import { UserLookupModel } from "@/models/Users/UserLookupModel";
import { selectAuth } from "@/store/Slices/authSlice";
import fetchWrapper from "@/utilities/HttpUtilities";
import ManagePermissionValidationScheme from "@/validation-schemes/Security/Permissions/ManagePermissionValidationScheme";
import { Typography } from "@mui/material";
import { useFormik } from "formik";
import { lazy, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
const Stack = lazy(() => import("@mui/material/Stack"));
import Grid from "@mui/material/Grid2";

const ManagePermissionsForm = (props: any) => {
  const { t: commonLocale } = useTranslation();

  const [usersInputState, setUsersInputState] = useState<string[]>([]);
  const [permissionsInputState, setPermissionsInputState] = useState<string[]>(
    []
  );
  /***
   * Event handler's
   */

  const formik = useFormik<AssignOrUnassignPermissionModel>({
    initialValues: {
      users: [],
      securityGroups: [],
      action: PermissionsActions.NotSpecified,
    },
    validationSchema: ManagePermissionValidationScheme(),
    validateOnBlur: true,
    onSubmit: (values: AssignOrUnassignPermissionModel, h) => {
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

  const usersRef = useRef<any>(null);
  const securityGroupsRef = useRef<any>(null);
  const { accessToken } = useSelector(selectAuth);

  const fetchSecurityGroups = async (inputValue: string) => {
    const data = await fetchWrapper<
      ApiResponse<KeyValuePair<string, string>[]>
    >(
      `${
        import.meta.env.VITE_API_BASE_URL
      }${SecurityGroupsEndpoints.getAllTenantSecurityGroupsLookup(inputValue)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    securityGroupsRef?.current?.setOptions(data?.data);
  };

  const fetchUsers = async (inputValue: string) => {
    const data = await fetchWrapper<ApiResponse<UserLookupModel[]>>(
      `${import.meta.env.VITE_API_BASE_URL}${UserEndpoints.getUsersForLookup(
        inputValue
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    usersRef?.current?.setOptions(data?.data);
  };

  return (
    <>
      <Stack
        direction="column"
        alignItems="center"
        spacing={AppConstants.layout.StandardSpacing}
      >
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <Grid container spacing={4} sx={{ minWidth: "350px" }}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Typography variant="caption" display="block" gutterBottom>
                Select users
              </Typography>
              <AppAutoComplete
                value={formik.values.users}
                setValue={(values: any) => {
                  formik.setFieldValue("users", values);
                }}
                getOptionKey={(option: any) => option.id}
                fetchOptions={fetchUsers}
                getOptionLabel={(option: any) => option.email}
                setInputValue={setUsersInputState}
                inputValue={usersInputState}
                label={"Users"}
                ref={usersRef}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <AppAutoComplete
                value={formik.values.securityGroups}
                setValue={(values: any) => {
                  formik.setFieldValue("securityGroups", values);
                }}
                getOptionLabel={(option: any) => option.key}
                fetchOptions={fetchSecurityGroups}
                setInputValue={setPermissionsInputState}
                inputValue={permissionsInputState}
                label={"Security Groups"}
                ref={securityGroupsRef}
              />
            </Grid>
          </Grid>
        </form>
      </Stack>
    </>
  );
};

export default ManagePermissionsForm;
