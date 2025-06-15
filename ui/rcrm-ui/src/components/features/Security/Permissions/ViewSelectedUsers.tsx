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
import { useLazyGetUsersBasicDetailsQuery } from "@/services/User/UserService";

interface ViewSelectedUsersProps {
  userIds: string[];
  isReviewPage?: boolean;
}
const ViewSelectedUsers = (props: ViewSelectedUsersProps) => {
  const [getTenantDetails, { data, isLoading }] =
    useLazyGetUsersBasicDetailsQuery();

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
    if (props.userIds) {
      debouncedGetTenantDetails(props.userIds); // Use memoized debounced function
    }
  }, [props.userIds, debouncedGetTenantDetails]);

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
          <Grid
            key={x.resourceAlias}
            size={{ xs: 12, sm: 6, md: 3, lg: 4, xl: 2 }}
          >
            <TenantBasicInfoCard
              imageUrl={x.profilePicture}
              name={x.fullName}
              accountAlias={x.resourceAlias}
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
            <Typography variant="h5">No Users Selected.</Typography>
          </Stack>
        </AppPaper>
      )}
    </Grid>
  ) : (
    <Grid container spacing={2}>
      {tenantsDetails.map((t) => (
        <Grid key={t.resourceAlias} size={{ md: 4, lg: 2, sm: 6, xs: 12 }}>
          <AppCard>
            <Stack>
              <Stack>
                <Typography variant="caption">Name</Typography>
                <Typography variant="body2">{t.fullName}</Typography>
              </Stack>
              <Stack>
                <Typography variant="caption">Account Alias</Typography>
                <Typography variant="body2">{t.resourceAlias}</Typography>
              </Stack>
            </Stack>
          </AppCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default ViewSelectedUsers;
