import { CardContent, Divider, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AppTabPanel from "@/components/ui-components/AppTabPanel";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppPage from "@/components/ui-components/AppPage";
import AppPaper from "@/components/ui-components/AppPaper";
import SelectUsersView from "./SelectUsersView";
import SelectSecurityGroupsView from "./SelectSecurityGroupsView";
import ViewSelectedUsers from "./ViewSelectedUsers";
import ViewSelectedSecurityGroups from "./ViewSelectedSecurityGroups";
import AppConstants from "@/constants/constants";

const PermissionAssignment = (props: any) => {
  const [value, setValue] = useState(0);
  const formikRef = useRef<any>(null);

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

  const selectedInfo = useMemo(() => {
    const users =
      props.users.length > 0 ? props.users.map((x: any) => x.id) : [];

    const groups =
      props.securityGroups.length > 0
        ? props.securityGroups.map((x: any) => x.value)
        : [];

    return {
      users,
      groups,
    };
  }, [props.users, props.securityGroups]);

  return (
    <AppPage
      content={
        <Stack>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label="Users" />
            <Tab label="Security Groups" />
          </Tabs>
          <AppTabPanel value={value} index={0}>
            <Stack spacing={AppConstants.layout.StandardSpacing}>
              <SelectUsersView formik={props.formik} />
              {/* <Divider /> */}
              <ViewSelectedUsers userIds={selectedInfo.users} />
            </Stack>
          </AppTabPanel>
          <AppTabPanel value={value} index={1}>
            <SelectSecurityGroupsView formik={props.formik} />
            <ViewSelectedSecurityGroups
              securityGroupIds={selectedInfo.groups}
            />
          </AppTabPanel>
        </Stack>
      }
    />
  );
};

export default PermissionAssignment;
