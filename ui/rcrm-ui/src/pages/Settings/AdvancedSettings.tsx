import ManageTenants from "../Tenant/ManageTenants";
import UserDirectory from "@/components/features/Users/UserDirectory";
import ManageTenantPermissionsNew from "../Security/Permissions/ManageTenantPermissionNew";
import TabController from "@/components/ui-components/AppTabController";

const AdvancedSettings = () => {
  return (
    <TabController
      tabs={[
        { label: "Tenants", key: "tenants", component: <ManageTenants /> },
        {
          label: "Global User Directory",
          key: "directory",
          component: <UserDirectory />,
        },
        {
          label: "Permission Pool",
          key: "permission-pool",
          component: <ManageTenantPermissionsNew />,
        },
      ]}
    />
  );
};

export default AdvancedSettings;
