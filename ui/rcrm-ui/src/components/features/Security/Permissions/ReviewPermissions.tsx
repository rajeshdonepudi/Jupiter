import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { Divider, Stack, Typography, Box } from "@mui/material";
import { useMemo } from "react";
import Grid from "@mui/material/Grid2";
import AppCard from "@/components/ui-components/AppCard";
import AppPaper from "@/components/ui-components/AppPaper";
import ViewSelectedTenants from "./ViewSelectedTenants";
import AppConstants from "@/constants/constants";

interface ReviewPermissionsProps {
  selectedPermissions: Record<string, KeyValuePair<string, string>[]>;
  tenantIds: string[];
}

const ReviewPermissions = ({
  selectedPermissions,
  tenantIds,
}: ReviewPermissionsProps) => {
  const permissionsSelected = useMemo(
    () =>
      Object.values(selectedPermissions).some(
        (permissions) => permissions.length > 0
      ),
    [selectedPermissions]
  );

  return (
    <Stack gap={2}>
      <Stack spacing={AppConstants.layout.StandardSpacing}>
        <Stack spacing={AppConstants.layout.StandardSpacing}>
          <Typography variant="h6" fontWeight="bold">
            Permissions Review
          </Typography>
          <Divider />
          {!permissionsSelected ? (
            <AppPaper>
              <Stack
                sx={{ height: "150px" }}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Typography variant="h5">No permissions selected.</Typography>
              </Stack>
            </AppPaper>
          ) : (
            Object.entries(selectedPermissions).map(([groupId, permissions]) =>
              permissions.length > 0 ? (
                <AppCard key={groupId}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {groupId}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={AppConstants.layout.StandardSpacing}>
                    {permissions.map((permission) => (
                      <Grid
                        key={permission.key}
                        size={{ md: 4, lg: 3, sm: 6, xs: 12 }}
                      >
                        <Typography variant="body2">
                          {permission.value}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </AppCard>
              ) : null
            )
          )}
        </Stack>
      </Stack>
      <Stack spacing={AppConstants.layout.StandardSpacing}>
        <Stack spacing={AppConstants.layout.StandardSpacing}>
          <Typography variant="h6" fontWeight="bold">
            Tenants Review
          </Typography>
          <Divider />
          {tenantIds.length > 0 ? (
            <ViewSelectedTenants
              isReviewPage={true}
              tenantIds={tenantIds ?? []}
            />
          ) : (
            <AppPaper>
              <Stack
                sx={{ height: "150px" }}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Typography variant="h5">No Tenants Selected.</Typography>
              </Stack>
            </AppPaper>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ReviewPermissions;
