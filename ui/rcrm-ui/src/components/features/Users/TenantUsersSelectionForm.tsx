import AppAutoComplete from "@/components/ui-components/AppAutoComplete";
import AppConstants from "@/constants/constants";
import { TenantUsersSelectionModel } from "@/models/Users/TenantUsersSelectionModel";
import { selectAuth } from "@/store/Slices/authSlice";
import TenantUsersSelectionValidationScheme from "@/validation-schemes/Users/TenantUsersSelectionValidationScheme";
import { useFormik } from "formik";
import { lazy, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
const Stack = lazy(() => import("@mui/material/Stack"));
import Grid from "@mui/material/Grid2";

const TenantUsersSelectionForm = (props: any) => {
  const { t: commonLocale } = useTranslation();

  const [usersInputState, setUsersInputState] = useState<string[]>([]);

  /***
   * Event handler's
   */

  const formik = useFormik<TenantUsersSelectionModel>({
    initialValues: {
      users: [],
    },
    validationSchema: TenantUsersSelectionValidationScheme(),
    onSubmit: (values: TenantUsersSelectionModel, h) => {
      console.log("ss", h);
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
  const { accessToken } = useSelector(selectAuth);

  const fetchOptions = async (inputValue: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }UserLookup/users-lookup?searchTerm=${inputValue ?? ""}`,
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
      usersRef?.current?.setOptions(data?.data);
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
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <Grid container spacing={1.5} sx={{ minWidth: "300px" }}>
            <Grid size={{ xs: 12, md: 12 }}>
              <AppAutoComplete
                value={formik.values.users}
                setValue={(values: any) => {
                  formik.setFieldValue("users", values);
                }}
                getOptionKey={(option: any) => option.id}
                fetchOptions={fetchOptions}
                getOptionLabel={(option: any) => option.email}
                setInputValue={setUsersInputState}
                inputValue={usersInputState}
                label={"Users"}
                ref={usersRef}
              />
            </Grid>
          </Grid>
        </form>
      </Stack>
    </>
  );
};

export default TenantUsersSelectionForm;
