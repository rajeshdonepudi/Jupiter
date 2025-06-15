export default {
  addTenant: "Tenant/add-tenant",
  getTenantInfo: `Tenant/tenant-info`,
  getTenantDashboardInfo: `Tenant/tenant-dashboard-info`,
  getAllTenants: `Tenant/all-tenants`,
  tenantsLookupForDirectory: "Tenant/tenant-lookup-for-directory",
  getTenantDetails: (accountId: string) =>
    `Tenant/get-tenant-details?accountId=${accountId}`,
  getTenantBasicDetails: `Tenant/tenant-basic-details`,
};
