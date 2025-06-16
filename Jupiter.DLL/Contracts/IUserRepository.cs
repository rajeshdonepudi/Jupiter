using Jupiter.Enumerations.User;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Tenants;
using Jupiter.Models.Dtos.Users;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityContracts;

namespace Jupiter.DAL.Contracts
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<PagedList<UserInfoDto>> GetAllUsersByTenantIdPaginatedAsync(Guid tenantId, PageParams pageParams, CancellationToken cancellationToken);
        Task<bool> IsUserNameAvailable(string username, CancellationToken cancellationToken);
        Task<User> GetTenantUserInfoByEmail(Guid tenantId, string email, CancellationToken cancellationToken);
        Task<User> GetUserInfoByEmail(string email, CancellationToken cancellationToken);
        Task<User> GetUserByResourceAlias(string resourceAlias, CancellationToken cancellationToken);
        Task<UserInfoDto> GetUserInfoByResourceAlias(string resourceAlias, CancellationToken cancellationToken);
        Task<UserManagementDashboardInfoDto> GetUserManagementDashboardInfoByTenant(Guid tenantId, CancellationToken cancellationToken);
        Task<List<string>> GetTenantUserRoles(Guid tenantId, Guid userId, CancellationToken cancellationToken);
        Task<PagedList<UserInfoDto>> GetAllActiveUsersByTenantIdPaginatedAsync(Guid tenantId, PageParams pageParams, CancellationToken cancellationToken);
        Task<IEnumerable<UserCreatedByYearDTO>> UserCreatedByYear();
        Task<bool> TakeBulkActionAsync(List<string> resourceAliases, UserBulkActionsEnum action, CancellationToken cancellationToken);
        Task<IEnumerable<UserLookupDto>> GetAllTenantUsersLookupAsync(Guid tenantId, string searchTerm, CancellationToken cancellationToken);
        Task<bool> UpdateProfilePictureForAllUsers(byte[] data, CancellationToken cancellationToken);
        Task<PagedList<UserInfoDto>> GetAllUsersForUserDirectoryAsync(FilterUserDirectoryDto filter, CancellationToken cancellationToken);
        Task<IEnumerable<KeyValuePair<string, Guid>>> GetUsersLookupForDirectoryAsync(CancellationToken cancellationToken);
        Task<bool> UploadUserProfilePictureAsync(UpdateProfilePictureDto model, CancellationToken cancellationToken);
        Task<List<string>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken);
        Task<PagedList<UserInfoDto>> GetAllUsersByAccountAliasPaginatedAsync(string accountAlias, PageParams pageParams, CancellationToken cancellationToken);
        Task<PagedList<UserInfoDto>> GetAllUsersByAccountAliasPaginatedAsync(Guid tenantId, FilterTenantUsers pageParams, CancellationToken cancellationToken);
        Task<UserManagementDashboardInfoDto> GetTenantUserManagementDashboardInfoByAccountAlias(string accountAlias, CancellationToken cancellationToken);
        Task<User> GetUserInfoByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<IEnumerable<UserLookupDto>> GetUsersBasicDetailsAsync(Guid tenantId, List<Guid> userIds, CancellationToken cancellationToken);
    }
}
