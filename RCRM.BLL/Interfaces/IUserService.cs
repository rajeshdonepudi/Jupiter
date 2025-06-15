using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Account;
using Jupiter.Models.Dtos.Security.Permissions;
using Jupiter.Models.Dtos.Tags;
using Jupiter.Models.Dtos.Tenants;
using Jupiter.Models.Dtos.Users;

namespace Jupiter.BLL.Interfaces
{
    public interface ITagService
    {
        /// <summary>
        /// Method to tag entity async.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<bool> TagEntityAsync(TagEntityDto model, CancellationToken cancellationToken);
    }
    public interface IUserService
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<PagedList<UserInfoDto>> GetAllActiveAsync(PageParams model);
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        Task<UserManagementDashboardInfoDto> GetUserDashboardInfoAsync(CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        Task<UserDto> GetByIdAsync(Guid userId, CancellationToken cancellationToken);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<bool> UpdateUserAsync(int id, SignupRequestDto model);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<bool> UpsertUser(UpsertUserDto model);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<bool> UpsertTenantUser(UpsertTenantUserDto model, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        Task<bool> RevokeAccess(string refreshToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="resourceAlias"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<bool> DeleteUserAsync(string resourceAlias, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        Task<IEnumerable<UserCreatedByYearDTO>> UserCreatedByYears();
        /// <summary>
        /// 
        /// </summary>
        /// <param name="resourceAliases"></param>
        /// <param name="action"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<bool> UpdateBulkActionsAsync(UserBulkActionDto model, CancellationToken cancellationToken);
        /// <summary>
        /// All user info for directory
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<PagedList<UserInfoDto>> GetAllUsersForUserDirectoryAsync(FilterUserDirectoryDto model, CancellationToken cancellationToken);
        /// <summary>
        /// User lookup for directory
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<IEnumerable<KeyValuePair<string, Guid>>> GetUsersLookupForDirectoryAsync(CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<bool> UpdateProfilePictureAsync(UpdateProfilePictureDto model, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<UserDto> GetUserByResourceId(string resourceId, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<IEnumerable<string>> GetUserRolesByResourceId(string resourceId, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="resourceId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<IEnumerable<UserPermissionsDto>> GetUserPermissions(string resourceId, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<PagedList<UserInfoDto>> GetAllActiveTenantUsersAsync(FilterTenantUsers model, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="accountAlias"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<UserManagementDashboardInfoDto> GetTenantUserManagementDashboardInfo(string accountAlias, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<bool> RemoveUserPermission(RemoveUserPermission model, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<UserProfileInfoDto> GetUserProfileInfoAsync(Guid userId, CancellationToken cancellationToken);
        Task<IEnumerable<UserLookupDto>> GetUsersBasicDetailsAsync(List<Guid> userIds, CancellationToken cancellationToken);
    }
}
