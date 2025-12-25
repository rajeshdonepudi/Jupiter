// components/tabs/TabController.tsx
import { Tab, Tabs, Box } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import RouterUtilities from "@/utilities/RouterUtilities";
import { useEffect, useState } from "react";
import AppTabContainer from "./AppTabContainer";
import { AppAnimatedTabPanel } from "./AppTabPanel";

interface TabItem {
  label: string;
  key: string; // URL param value → ?tab=key
  component: React.ReactNode;
}

interface TabControllerProps {
  tabs: TabItem[];
}

const TabController = ({ tabs }: TabControllerProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tabMap = tabs.map((t) => t.key);

  // Initialize tab value
  const initialIndex = (() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabMap.includes(tabParam)) {
      return tabMap.indexOf(tabParam);
    }
    return 0;
  })();

  const [value, setValue] = useState(initialIndex);

  // Handle tab switch
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const tabKey = tabMap[newValue];
    setValue(newValue);

    RouterUtilities.UpdateQueryParams(navigate, searchParams, {
      tab: tabKey,
      page: undefined, // Reset pagination on tab change
    });
  };

  // Sync with URL when changed externally
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      const index = tabMap.indexOf(tabParam);
      if (index !== -1 && index !== value) setValue(index);
    }
  }, [searchParams]);

  return (
    <>
      {/* TAB BAR */}
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((t, i) => (
          <Tab key={t.key} label={t.label} />
        ))}
      </Tabs>

      {/* CONTENT AREA */}
      <AppTabContainer>
        {tabs.map((t, i) => (
          <AppAnimatedTabPanel key={i} value={value} index={i}>
            {t.component}
          </AppAnimatedTabPanel>
        ))}
      </AppTabContainer>
    </>
  );
};

export default TabController;
