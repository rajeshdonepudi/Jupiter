using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Security.Roles;
using Jupiter.Models.Dtos.Users;
using Jupiter.Models.Entities.Security;

namespace Jupiter.BLL.Interfaces
{
    public interface IRoleService
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<string> HashPasswordForUserAsync(HashPasswordForUserDto model);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        Task<SecurityRoleDto> GetRoleAsync(Guid roleId, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="userRole"></param>
        /// <returns></returns>
        Task<bool> CreateRoleAsync(RoleDto userRole, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        Task<bool> DeleteRoleAsync(string roleId, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        Task<IEnumerable<ApplicationRole>> GetAllTenantRolesAsync(CancellationToken cancellationToken);
        Task<PagedList<SecurityRoleDto>> GetAllUserRolesAsync(PageParams pageParams, CancellationToken cancellationToken);
        Task<PagedList<UserInRoleDto>> GetAllUsersInRoleAsync(GetUsersInRoleDto model, CancellationToken cancellationToken);
        Task<bool> AddUserToRoleAsync(AddUserToRoleDto model, CancellationToken cancellationToken);
        Task<bool> RemoveUserFromRoleAsync(RemoveUserFromRoleDto model, CancellationToken cancellationToken);
    }
}
