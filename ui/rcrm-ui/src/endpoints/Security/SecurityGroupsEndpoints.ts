const SecurityGroupsEndpoints = {
  // Security group management
  getAllTenantSecurityGroups: "SecurityGroup/tenant-security-groups",
  getAllTenantSecurityGroupsLookup: (searchTerm: string) =>
    `SecurityGroup/tenant-security-groups-lookup?searchTerm=${searchTerm}`,
  getAllBasicSecurityGroupDetails:
    "SecurityGroup/get-security-group-basic-details",

  addSecurityGroup: "SecurityGroup/add-security-group",
  updateSecurityGroup: "SecurityGroup/update-security-group",
  deleteSecurityGroup: (groupId: string) =>
    `SecurityGroup/delete-tenant-security-group?securityGroupId=${groupId}`,

  // Security group information and permissions
  getSecurityGroupInfo: (groupId: string) =>
    `SecurityGroup/security-group-info?securityGroupId=${groupId}`,
  getSecurityGroupPermissions: (groupId: string) =>
    `SecurityGroup/get-security-group-permissions?securityGroupId=${groupId}`,

  // User management within security groups
  addUserToSecurityGroup: "SecurityGroup/add-users-to-security-group",
  getAllSecurityGroupUsers: "SecurityGroup/all-security-group-users",
  deleteUserFromSecurityGroup: "SecurityGroup/delete-user-from-security-group",
};

export default SecurityGroupsEndpoints;
