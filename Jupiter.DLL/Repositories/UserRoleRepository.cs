using Jupiter.DAL.Contracts;
using Jupiter.Models.Dtos.Security.Roles;
using Jupiter.Models.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class UserRoleRepository : GenericRepository<UserRole>, IUserRoleRepository
    {
        public UserRoleRepository(JupiterContext context, IMemoryCache cache) : base(context, cache)
        {

        }

        public async Task<bool> AddUsersToRoleAsync(Guid tenantId, AddUserToRoleDto model, CancellationToken cancellationToken)
        {
            var userIds = new List<Guid>();
            var userRoles = new List<UserRole>();

            foreach (var user in model.Users)
            {
                var isExist = await _context.UserRoles.AnyAsync(x => x.UserId == user && x.RoleId == model.RoleId);

                if (!isExist)
                {
                    userIds.Add(user);
                }
            }

            foreach (var userId in userIds)
            {
                userRoles.Add(new UserRole
                {
                    CreatedOn = DateTime.UtcNow,
                    RoleId = model.RoleId,
                    TenantId = tenantId,
                    UserId = userId
                });
            }

            await _context.UserRoles.AddRangeAsync(userRoles);

            var result = await _context.SaveChangesAsync(cancellationToken);

            return result > 0;
        }
    }
}

