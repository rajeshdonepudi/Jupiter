import ManageSiteTheme from "../Themes/ManageSiteTheme";
import ManagePermissions from "../Security/Permissions/ManagePermissions";
import ManageUsers from "../Users/ManageUsers";
import ViewRoles from "../Security/Roles/ViewRoles";
import ViewSecurityGroups from "../Security/SecurityGroups/ViewSecurityGroups";
import TabController from "@/components/ui-components/AppTabController";

const BasicSettings = () => {
  return (
    <TabController
      tabs={[
        { label: "Themes", key: "themes", component: <ManageSiteTheme /> },
        {
          label: "Permissions",
          key: "permissions",
          component: <ManagePermissions />,
        },
        { label: "Users", key: "users", component: <ManageUsers /> },
        { label: "Roles", key: "roles", component: <ViewRoles /> },
        {
          label: "Security Groups",
          key: "security-groups",
          component: <ViewSecurityGroups />,
        },
      ]}
    />
  );
};

export default BasicSettings;
