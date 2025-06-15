const UserManagementEndpoints = {
  allUsers: "UserManagement/all-users",
  userManagementDashboardInfo: "UserManagement/user-management-dashboard-info",
  allTenantUsers: "UserManagement/all-tenant-users",
  allSecurityGroupUsers: "UserManagement/all-security-group-users",
  addUser: "UserManagement/add-user",
  upsertTenantUser: "UserManagement/upsert-tenant-user",
  takeBulkAction: "UserManagement/bulk-action",
  userCreatedByYear: "UserManagement/user-created-year",
  deleteUser: (resourceAlias: string) =>
    `UserManagement/delete-user/${resourceAlias}`,
  tenantUserManagementDashboardInfo: (accountAlias: string) =>
    `UserManagement/user-management-dashboard-info?accountAlias=${accountAlias}`,
  filterUserDirectory: "UserManagement/filter-user-directory",
  userLookupForDirectory: "UserManagement/user-lookup-for-directory",
  getUser: (userId: string) => `UserManagement/get-user?userId=${userId}`,
};

export default UserManagementEndpoints;
