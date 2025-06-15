import AppAutoComplete from "@/components/ui-components/AppAutoComplete";
import AppConstants from "@/constants/constants";
import UserEndpoints from "@/endpoints/User/UserEndpoints";
import { PermissionsActions } from "@/enumerations/Security/Permissions/permissions-actions.enum";
import { ApiResponse } from "@/models/Common/ApiResponse";
import { AssignOrUnassignPermissionModel } from "@/models/Security/Permissions/AssignOrUnassignPermissionModel";
import { UserLookupModel } from "@/models/Users/UserLookupModel";
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
import { Avatar, Typography } from "@mui/material";
import ImageUtilities from "@/utilities/ImageUtilities";

const SelectUsersView = (props: any) => {
  const { t: commonLocale } = useTranslation();

  const [usersInputState, setUsersInputState] = useState<string[]>([]);

  /***
   * Event handler's
   */

  const usersRef = useRef<any>(null);
  const securityGroupsRef = useRef<any>(null);
  const { accessToken } = useSelector(selectAuth);

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

  const optionTemplate = (props: any, option: any) => {
    const { key, ...optionProps } = props;

    return (
      <Stack
        {...props}
        key={key}
        direction={"row"}
        gap={AppConstants.layout.StandardSpacing}
        alignItems={"center"}
        margin={AppConstants.layout.StandardMargin}
      >
        {!option.profilePicture ? (
          <Avatar {...ImageUtilities.getStringAvatar(`${option.fullName}`)} />
        ) : (
          <Avatar
            alt="Remy Sharp"
            src={ImageUtilities.getImageAsBase64ImageSource(
              option.profilePicture
            )}
          />
        )}
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={AppConstants.layout.StandardSpacing}
        >
          <Typography variant="subtitle2">{`${option.fullName}`}</Typography>
          <Typography variant="caption">{`(${option.email})`}</Typography>
        </Stack>
      </Stack>
    );
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
                  value={props.formik.values.users}
                  setValue={(values: any) => {
                    console.log(values);
                    props.formik.setFieldValue("users", values);
                  }}
                  getOptionKey={(option: any) => option.id}
                  fetchOptions={fetchUsers}
                  renderOption={(props: any, option: any) => {
                    return optionTemplate(props, option);
                  }}
                  getOptionLabel={(option: any) => option.fullName}
                  setInputValue={setUsersInputState}
                  inputValue={usersInputState}
                  label={"Users"}
                  ref={usersRef}
                />
              </Grid>
            </Grid>
          </form>
        </Stack>
      </AppPaper>
    </>
  );
};

export default SelectUsersView;
