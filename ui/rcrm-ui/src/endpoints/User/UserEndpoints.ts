const UserEndpoints = {
  updateProfilePicture: "User/upload-profile-picture",
  userDashboardInfo: "User/user-dashboard-info",
  getUserInfo: (resourceId: string) =>
    `User/get-user-info?resourceId=${resourceId}`,
  getUserProfileInfo: (resourceId: string) =>
    `User/get-user-profile-info?userId=${resourceId}`,
  getUsersBasicDetails: "User/get-users-basic-details",
  getUserPermissions: (resourceId: string) =>
    `User/get-user-permissions?resourceId=${resourceId}`,
  getUserRoles: (resourceId: string) =>
    `User/get-user-roles?resourceId=${resourceId}`,
  getUsersForLookup: (searchTerm: string) =>
    `UserLookup/users-lookup?searchTerm=${searchTerm}`,
  removeUserPermission: "User/remove-user-permission",
};

export default UserEndpoints;
