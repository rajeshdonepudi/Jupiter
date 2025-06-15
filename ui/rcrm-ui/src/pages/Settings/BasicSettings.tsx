import { CardContent, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import AppTabPanel from "@/components/ui-components/AppTabPanel";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppPage from "@/components/ui-components/AppPage";
import AppPaper from "@/components/ui-components/AppPaper";
import ManageSiteTheme from "../Themes/ManageSiteTheme";
import ManageUsers from "../Users/ManageUsers";
import ViewRoles from "../Security/Roles/ViewRoles";
import ViewSecurityGroups from "../Security/SecurityGroups/ViewSecurityGroups";
import ManagePermissions from "../Security/Permissions/ManagePermissions";
import AppConstants from "@/constants/constants";

const BasicSettings = () => {
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
                <Tab label="Themes" />
                <Tab label="Permissions" />
                <Tab label="Users" />
                <Tab label="Roles" />
                <Tab label="Security Groups" />
              </Tabs>
              <AppTabPanel value={value} index={0}>
                <ManageSiteTheme />
              </AppTabPanel>
              <AppTabPanel value={value} index={1}>
                <ManagePermissions />
              </AppTabPanel>
              <AppTabPanel value={value} index={2}>
                <ManageUsers />
              </AppTabPanel>
              <AppTabPanel value={value} index={3}>
                <ViewRoles />
              </AppTabPanel>
              <AppTabPanel value={value} index={4}>
                <ViewSecurityGroups />
              </AppTabPanel>
            </CardContent>
          </AppPaper>
        }
      />
    </Stack>
  );
};

export default BasicSettings;
