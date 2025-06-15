import { CardContent, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import AppTabPanel from "@/components/ui-components/AppTabPanel";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppPage from "@/components/ui-components/AppPage";
import AppPaper from "@/components/ui-components/AppPaper";
import AppConstants from "@/constants/constants";
import ManageTenants from "../Tenant/ManageTenants";
import UserDirectory from "@/components/features/Users/UserDirectory";
import ManageTenantPermissionsNew from "../Security/Permissions/ManageTenantPermissionNew";

const AdvancedSettings = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("from") && Number(searchParams.get("from")) > -1) {
      setValue(Number(searchParams.get("from")));
    }
  }, [searchParams]);

  return (
    <Stack spacing={AppConstants.layout.StandardSpacing}>
      <AppPage
        title=""
        content={
          <AppPaper>
            <CardContent>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab label="Tenants" />
                <Tab label="Global User Directory" />
                <Tab label="Permission Pool" />
              </Tabs>
              <AppTabPanel value={value} index={0}>
                <ManageTenants />
              </AppTabPanel>
              <AppTabPanel value={value} index={1}>
                <UserDirectory />
              </AppTabPanel>
              <AppTabPanel value={value} index={2}>
                <ManageTenantPermissionsNew />
              </AppTabPanel>
            </CardContent>
          </AppPaper>
        }
      />
    </Stack>
  );
};

export default AdvancedSettings;
