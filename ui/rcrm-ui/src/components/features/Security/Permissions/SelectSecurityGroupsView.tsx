import AppAutoComplete from "@/components/ui-components/AppAutoComplete";
import AppConstants from "@/constants/constants";
import SecurityGroupsEndpoints from "@/endpoints/Security/SecurityGroupsEndpoints";
import { PermissionsActions } from "@/enumerations/Security/Permissions/permissions-actions.enum";
import { ApiResponse } from "@/models/Common/ApiResponse";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { AssignOrUnassignPermissionModel } from "@/models/Security/Permissions/AssignOrUnassignPermissionModel";
import { selectAuth } from "@/store/Slices/authSlice";
import fetchWrapper from "@/utilities/HttpUtilities";
import ManagePermissionValidationScheme from "@/validation-schemes/Security/Permissions/ManagePermissionValidationScheme";
import { useFormik } from "formik";
import { lazy, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
const Stack = lazy(() => import("@mui/material/Stack"));
import Grid from "@mui/material/Grid2";
import AppPaper from "@/components/ui-components/AppPaper";

const SelectSecurityGroupsView = (props: any) => {
  const { t: commonLocale } = useTranslation();

  const [permissionsInputState, setPermissionsInputState] = useState<string[]>(
    []
  );
  /***
   * Event handler's
   */

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

  return (
    <>
      <AppPaper>
        <Stack
          direction="column"
          alignItems="center"
          spacing={AppConstants.layout.StandardSpacing}
        >
          <form
            autoComplete="off"
            style={{ minWidth: "100%" }}
            onSubmit={props.formik.handleSubmit}
          >
            <Grid
              container
              spacing={AppConstants.layout.StandardSpacing}
              sx={{ width: "100%" }}
            >
              <Grid size={{ xs: 12, md: 12 }}>
                <AppAutoComplete
                  value={props.formik.values.securityGroups}
                  setValue={(values: any) => {
                    props.formik.setFieldValue("securityGroups", values);
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
      </AppPaper>
    </>
  );
};

export default SelectSecurityGroupsView;
