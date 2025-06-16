using Jupiter.DAL.Contracts;
using Jupiter.Extensions.EntityFramework;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Security.Roles;
using Jupiter.Models.Dtos.Tenants;
using Jupiter.Models.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class SecurityRolesRepository : GenericRepository<ApplicationRole>, ISecurityRolesRepository
    {
        public SecurityRolesRepository(JupiterContext falconOneContext,
            IMemoryCache memoryCache) : base(falconOneContext, memoryCache) { }

        public async Task<IEnumerable<KeyValuePair<Guid, string>>> GetSecurityRolesForLookup(CancellationToken cancellationToken)
        {
            return await _context.Roles.Select(x => new KeyValuePair<Guid, string>(x.Id, x.Name)).ToListAsync(cancellationToken);
        }

        public async Task<PagedList<UserInRoleDto>> GetUsersInRoleAsync(GetUsersInRoleDto model, CancellationToken cancellationToken)
        {
            var userIds = await _context.UserRoles
                                        .Where(x => x.RoleId == model.RoleId)
                                        .Select(x => x.UserId)
                                        .ToListAsync(cancellationToken);

            var users = await _context.Users
                                      .Where(x => userIds.Contains(x.Id))
                                      .Select(x => new UserInRoleDto
                                      {
                                          UserId = x.Id,
                                          Email = x.Email ?? "N/A",
                                          ResourceAlias = x.ResourceAlias,
                                          TenantInfo = x.Tenants.Select(t => new TenantLookupDto
                                          {
                                              Id = t.TenantId,
                                              Name = t.Tenant.Name
                                          }).ToList(),

                                      }).ToPagedListAsync(model, cancellationToken);

            return users;
        }

        public async Task<SecurityRoleDto> GetTenantRoleInfoAsync(Guid roleId, Guid tenantId, bool isGodSession, CancellationToken cancellationToken)
        {
            var userCount = await _context.UserRoles
                                          .Where(x => x.RoleId == roleId)
                                          .CountAsync(cancellationToken);

            var query = _context.Roles.AsQueryable();


            if (!isGodSession)
            {
                query = query.Where(x => x.TenantId == tenantId);
            }

            var result = await query.Select(s => new SecurityRoleDto
            {
                CreatedOn = s.CreatedOn,
                Id = s.Id,
                ModifiedOn = s.ModifiedOn,
                Name = s.Name,
                NormalizedName = s.NormalizedName,
                UsersInRole = userCount
            }).FirstOrDefaultAsync(x => x.Id == roleId, cancellationToken);
            return result;
        }

        public async Task<PagedList<SecurityRoleDto>> GetAllUserRolesAsync(Guid tenantId, PageParams model, CancellationToken cancellationToken)
        {
            var baseQuery = _context.Roles.Where(x => x.TenantId == tenantId);

            var roleIds = await baseQuery.Select(x => x.Id).ToListAsync(cancellationToken);

            var dict = new Dictionary<Guid, long>();

            foreach (var roleId in roleIds)
            {
                var userCount = await _context.UserRoles.Where(x => x.RoleId == roleId).CountAsync(cancellationToken);

                dict.Add(roleId, userCount);
            }

            var result = await baseQuery.Select(s => new SecurityRoleDto
            {
                CreatedOn = s.CreatedOn,
                Id = s.Id,
                ModifiedOn = s.ModifiedOn,
                Name = s.Name,
                NormalizedName = s.NormalizedName,
                UsersInRole = dict.ContainsKey(s.Id) ? dict[s.Id] : 0
            }).ToPagedListAsync(model, cancellationToken);

            return result;
        }
    }
}

