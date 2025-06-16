using Jupiter.Models.Dtos.Security.Roles;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityContracts;

namespace Jupiter.DAL.Contracts
{
    public interface IUserRoleRepository : IGenericRepository<UserRole>
    {
        Task<bool> AddUsersToRoleAsync(Guid tenantId, AddUserToRoleDto model, CancellationToken cancellationToken);
    }
}
