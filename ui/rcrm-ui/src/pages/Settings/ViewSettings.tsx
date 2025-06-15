import { CardContent, Stack, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import AppTabPanel from "@/components/ui-components/AppTabPanel";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppPage from "@/components/ui-components/AppPage";
import AppPaper from "@/components/ui-components/AppPaper";
import AppConstants from "@/constants/constants";
import BasicSettings from "./BasicSettings";
import AdvancedSettings from "./AdvancedSettings";

const ViewSettings = () => {
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
    <AppPage
      title="Settings"
      content={
        <AppPaper>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label="Basic" />
            <Tab label="Advanced" />
          </Tabs>
          <AppTabPanel value={value} index={0}>
            <BasicSettings />
          </AppTabPanel>
          <AppTabPanel value={value} index={1}>
            <AdvancedSettings />
          </AppTabPanel>
        </AppPaper>
      }
    />
  );
};

export default ViewSettings;
