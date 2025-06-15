import AppAutoComplete from "@/components/ui-components/AppAutoComplete";
import AppConstants from "@/constants/constants";
import { selectAuth } from "@/store/Slices/authSlice";
import {
  lazy,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid2";
import AppPaper from "@/components/ui-components/AppPaper";
import { useLazyGetBasicTenantDetailsQuery } from "@/services/Tenant/TenantService";
import CommonUtilities from "@/utilities/CommonUtilities";
import { Stack } from "@mui/material";

interface SelectTenantsViewProps {
  formikRef: RefObject<any>;
  formik: any;
}

const SelectTenantsView = (props: SelectTenantsViewProps) => {
  const { t: commonLocale } = useTranslation();

  const [tenantsInputState, setTenantsInputState] = useState<string[]>([]);
  const [getTenantDetails, { data, isLoading }] =
    useLazyGetBasicTenantDetailsQuery();

  const tenantsDetails = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  /***
   * Event handler's
   */

  useImperativeHandle(props?.formikRef, () => {
    return {
      submitForm: props.formik.submitForm,
      resetForm: props.formik.resetForm,
      setValues: props.formik.setValues,
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

  const debouncedFetchTenants = useCallback(
    CommonUtilities.debounce((searchTerm: string) => {
      if (searchTerm) {
        fetchTenants(searchTerm);
      }
    }, 600),
    []
  );

  const debouncedGetTenantDetails = useCallback(
    CommonUtilities.debounce((tenantIds: string[]) => {
      getTenantDetails(tenantIds);
    }, 500),
    []
  );

  useEffect(() => {
    if (props.formik.values.tenants) {
      const tenantIds = props.formik.values.tenants.map((x: any) => x.value);
      debouncedGetTenantDetails(tenantIds); // Use memoized debounced function
    }
  }, [props.formik.values.tenants, debouncedGetTenantDetails]);

  return (
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
                value={props.formik.values.tenants}
                setValue={(values: any) => {
                  props.formik.setFieldValue("tenants", values);
                }}
                placeholder="Enter tenant name"
                size="large"
                getOptionKey={(option: any) => option.value}
                fetchOptions={debouncedFetchTenants}
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
    </AppPaper>
  );
};

export default SelectTenantsView;
