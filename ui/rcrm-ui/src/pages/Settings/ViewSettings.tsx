import BasicSettings from "./BasicSettings";
import AdvancedSettings from "./AdvancedSettings";
import TabController from "@/components/ui-components/AppTabController";

const ViewSettings = () => {
  return (
    <TabController
      tabs={[
        { label: "Basic", key: "basic", component: <BasicSettings /> },
        { label: "Advanced", key: "advanced", component: <AdvancedSettings /> },
      ]}
    />
  );
};

export default ViewSettings;
