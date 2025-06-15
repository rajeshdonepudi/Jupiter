import React, { useCallback, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid2";
import AppLoader from "@/components/ui-components/AppLoader";
import TenantBasicInfoCard from "../../Tenant/TenantBasicInfoCard";
import { useLazyGetBasicTenantDetailsQuery } from "@/services/Tenant/TenantService";
import CommonUtilities from "@/utilities/CommonUtilities";
import AppConstants from "@/constants/constants";
import { Box, Stack, Typography } from "@mui/material";
import AppPaper from "@/components/ui-components/AppPaper";
import AppCard from "@/components/ui-components/AppCard";

interface ViewSelectedTenantsProps {
  tenantIds: string[];
  isReviewPage?: boolean;
}
const ViewSelectedTenants = (props: ViewSelectedTenantsProps) => {
  const [getTenantDetails, { data, isLoading }] =
    useLazyGetBasicTenantDetailsQuery();

  const tenantsDetails = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  const debouncedGetTenantDetails = useCallback(
    CommonUtilities.debounce((tenantIds: string[]) => {
      getTenantDetails(tenantIds);
    }, 500),
    []
  );

  useEffect(() => {
    if (props.tenantIds) {
      debouncedGetTenantDetails(props.tenantIds); // Use memoized debounced function
    }
  }, [props.tenantIds, debouncedGetTenantDetails]);

  return !props.isReviewPage ? (
    <Grid
      container
      spacing={AppConstants.layout.StandardSpacing}
      size={{ xs: 12, md: 12 }}
    >
      {isLoading ? (
        <AppLoader />
      ) : tenantsDetails.length > 0 ? (
        tenantsDetails.map((x) => (
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 4, xl: 2 }}>
            <TenantBasicInfoCard
              imageUrl={x.image}
              name={x.name}
              accountAlias={x.accountAlias}
            />
          </Grid>
        ))
      ) : (
        <AppPaper>
          <Stack
            sx={{ height: "300px" }}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography variant="h5">No Tenants Selected.</Typography>
          </Stack>
        </AppPaper>
      )}
    </Grid>
  ) : (
    <Grid container spacing={2}>
      {tenantsDetails.map((t) => (
        <Grid key={t.accountAlias} size={{ md: 4, lg: 2, sm: 6, xs: 12 }}>
          <AppCard>
            <Stack>
              <Stack>
                <Typography variant="caption">Name</Typography>
                <Typography variant="body2">{t.name}</Typography>
              </Stack>
              <Stack>
                <Typography variant="caption">Account Alias</Typography>
                <Typography variant="body2">{t.accountAlias}</Typography>
              </Stack>
            </Stack>
          </AppCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default ViewSelectedTenants;
