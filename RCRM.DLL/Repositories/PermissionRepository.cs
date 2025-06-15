using Jupiter.DAL.Contracts;
using Jupiter.Enumerations.Security;
using Jupiter.Models.Dtos.Security.Permissions;
using Jupiter.Models.Entities.Security;
using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class PermissionRepository : GenericRepository<Permission>, IPermissionRepository
    {
        public PermissionRepository(JupiterContext context, IMemoryCache cache) : base(context, cache)
        {

        }

        public async Task<IEnumerable<SecurityGroupDto>> GetPermissionsAsync(CancellationToken cancellationToken)
        {
            var permissions = await _context.PermissionGroups.Select(g => new SecurityGroupDto
            {
                Id = g.Id,
                Name = g.Name,
                Permissions = g.Permissions.Select(y => new KeyValuePair<Guid, string>(y.Id, y.Value))
            }).ToListAsync();

            return permissions;
        }

        public async Task<IEnumerable<SecurityGroupDto>> GetTenantPermissionsAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            var permissions = await _context.PermissionGroups.Select(g => new SecurityGroupDto
            {
                Id = g.Id,
                Name = g.Name,
                Permissions = g.Permissions.Where(x => x.AssociatedTenants.Select(x => x.TenantId).Contains(tenantId))
                                           .Select(y => new KeyValuePair<Guid, string>(y.Id, y.Value))
            }).OrderByDescending(x => x.Permissions.Count()).ToListAsync();

            return permissions;
        }

        public async Task<bool> ManagePermissionsAsync(Guid tenantId, ManagePermissionsDto model, CancellationToken cancellationToken)
        {
            foreach (var permission in model.Permissions)
            {
                var entity = await _context.TenantPermissions
                                           .Where(x => x.TenantId == tenantId && x.PermissionId == permission)
                                           .Select(x => x.Permission)
                                           .FirstOrDefaultAsync(cancellationToken);

                if (entity is not null)
                {
                    foreach (var user in model.Users)
                    {
                        await ManagePermissionForUser(tenantId, user, entity, cancellationToken, model.Action);
                    }

                    foreach (var securityGroup in model.SecurityGroups)
                    {
                        await ManagePermissionForSecurityGroup(tenantId, securityGroup, entity, cancellationToken, model.Action);
                    }
                }
            }
            return true;
        }


        private async Task ManagePermissionForUser(Guid tenantId, Guid userId, Permission permission, CancellationToken cancellationToken, PermissionActionEnum action)
        {
            var permissionExist = await _context.UserClaims
                                                .FirstOrDefaultAsync(x => x.TenantId == tenantId && x.ClaimType == permission.Type && x.ClaimValue == permission.Value);

            switch (action)
            {
                case PermissionActionEnum.Assign:

                    if (permissionExist is null)
                    {
                        await _context.UserClaims.AddAsync(new UserClaim
                        {
                            ClaimType = permission.Type,
                            ClaimValue = permission.Value,
                            TenantId = tenantId,
                            CreatedOn = DateTime.UtcNow,
                            UserId = userId,
                        });
                        await _context.SaveChangesAsync(cancellationToken);
                    }

                    break;
                case PermissionActionEnum.Unassign:

                    if (permissionExist is not null)
                    {
                        _context.UserClaims.Remove(permissionExist);
                        await _context.SaveChangesAsync(cancellationToken);
                    }
                    break;
            }
        }

        private async Task ManagePermissionForSecurityGroup(Guid tenantId, Guid securityGroupId, Permission permission, CancellationToken cancellationToken, PermissionActionEnum action)
        {
            var entity = await _context.SecurityGroupPermissions
                                       .FirstOrDefaultAsync(x => x.PermissionId == permission.Id && x.SecurityGroupId == securityGroupId);

            switch (action)
            {
                case PermissionActionEnum.Assign:

                    if (entity is null)
                    {
                        await _context.SecurityGroupPermissions.AddAsync(new SecurityGroupPermission
                        {
                            PermissionId = permission.Id,
                            SecurityGroupId = securityGroupId,
                            CreatedOn = DateTime.UtcNow,
                        });

                        await _context.SaveChangesAsync(cancellationToken);
                    }

                    break;
                case PermissionActionEnum.Unassign:

                    if (entity is not null)
                    {
                        _context.SecurityGroupPermissions.Remove(entity);

                        await _context.SaveChangesAsync(cancellationToken);
                    }
                    break;
            }
        }

        public async Task<bool> ManagePermissionsForTenantAsync(ManagePermissionsForTenantDto model, CancellationToken cancellationToken)
        {
            foreach (var permission in model.Permissions)
            {
                var poolPermission = await _context.Permissions.AnyAsync(x => x.Id == permission);

                if (poolPermission)
                {
                    foreach (var tenant in model.Tenants)
                    {
                        var tenantPermission = await _context.TenantPermissions.FirstOrDefaultAsync(x => x.TenantId == tenant && x.PermissionId == permission);

                        switch (model.Action)
                        {
                            case PermissionActionEnum.Assign:

                                if (tenantPermission is null)
                                {
                                    await _context.TenantPermissions.AddAsync(new TenantPermission
                                    {
                                        TenantId = tenant,
                                        PermissionId = permission
                                    });

                                    await _context.SaveChangesAsync(cancellationToken);
                                }

                                break;
                            case PermissionActionEnum.Unassign:

                                if (tenantPermission is not null)
                                {
                                    _context.TenantPermissions.Remove(tenantPermission);

                                    await _context.SaveChangesAsync(cancellationToken);
                                }

                                break;
                        }
                    }
                }
            }

            return true;
        }

        public async Task<string> GetPermissionGroupName(string permission, CancellationToken cancellationToken)
        {
            var res = await _context.PermissionGroups.FirstOrDefaultAsync(x => x.Permissions.Any(x => x.Value == permission), cancellationToken);

            return res.Name;
        }
    }
}

