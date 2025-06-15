export default {
  getSecurityClaims: "claims/lookup",
  getSecurityRoles: "roles/lookup",
  getAllSecurityRoles: "Role/view-user-roles",
  getUsersInRole: "Role/view-users-in-role",
  getRoleInfo: (roleId: string) => `Role/view-role-info?roleId=${roleId}`,
  addRole: "Role/add-role",
  deleteRole: (roleId: string) => `Role/delete-role?roleId=${roleId}`,
  updateRole: "Role/update-role",
  addUserToRole: "Role/add-user-to-role",
  removeUserFromRole: "Role/remove-user-from-role",
};
