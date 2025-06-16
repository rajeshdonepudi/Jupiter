using Jupiter.DAL.Contracts;
using Jupiter.Enumerations.User;
using Jupiter.Extensions.EntityFramework;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Tenants;
using Jupiter.Models.Dtos.Users;
using Jupiter.Models.Entities.Common;
using Jupiter.Models.Entities.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(JupiterContext context, IMemoryCache memoryCache) : base(context, memoryCache)
        {
        }



        public async Task<PagedList<UserInfoDto>> GetAllUsersForUserDirectoryAsync(FilterUserDirectoryDto filter, CancellationToken cancellationToken)
        {
            var query = _context.Users.Where(x => !x.IsDeleted);

            if (filter.Tenants is not null && filter.Tenants.Any())
            {
                query = query.Where(x => x.Tenants.Any(x => filter.Tenants.Any(t => t == x.TenantId)));
            }

            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                query = _context.Users.Where(x => x.FirstName.ToLower().Contains(filter.SearchTerm.ToLower())
                                               || x.LastName.ToLower().Contains(filter.SearchTerm.ToLower())
                                               || x.Email.ToLower().Contains(filter.SearchTerm.ToLower())
                                               || (x.FirstName + " " + x.LastName).ToLower().Contains(filter.SearchTerm.ToLower())
                                               || x.Email.ToLower() == filter.SearchTerm.ToLower());
            }

            var result = await query.Select(u => new UserInfoDto
            {
                Avatar = u.ProfilePicture.Base64,
                Email = u.Email,
                LastName = u.LastName,
                FirstName = u.FirstName,
                FullName = u.FirstName + " " + u.LastName,
                ResourceAlias = u.ResourceAlias,
                Phone = u.PhoneNumber,
                IsActive = u.IsActive,
                EmailConfirmed = u.EmailConfirmed,
                PhoneNumberConfirmed = u.PhoneNumberConfirmed,
                LockoutEnabled = u.LockoutEnabled,
                TwoFactorEnabled = u.TwoFactorEnabled,
                IsLocked = u.LockoutEnd.HasValue,
                LockoutEnd = u.LockoutEnd.HasValue ? u.LockoutEnd.Value.DateTime : null,
                CreatedOn = u.CreatedOn,
                AssociatedTenants = u.Tenants.Select(t => new KeyValuePair<string, Guid>(t.Tenant.Name, t.Tenant.Id)).ToList()
            }).OrderByDescending(x => x.CreatedOn)
            .ToPagedListAsync(filter, cancellationToken);

            return result;
        }

        public async Task<PagedList<UserInfoDto>> GetAllUsersByTenantIdPaginatedAsync(Guid tenantId, PageParams pageParams, CancellationToken cancellationToken)
        {
            var result = await _context.Users.Where(x => !x.IsDeleted && x.Tenants.Any(x => x.TenantId == tenantId))
                                             .AsNoTracking()
                                             .AsSplitQuery()
                                             .Select(u => new UserInfoDto
                                             {
                                                 Avatar = u.ProfilePicture.Base64,
                                                 Email = u.Email,
                                                 LastName = u.LastName,
                                                 FirstName = u.FirstName,
                                                 FullName = u.FirstName + " " + u.LastName,
                                                 ResourceAlias = u.ResourceAlias,
                                                 Phone = u.PhoneNumber,
                                                 IsActive = u.IsActive,
                                                 EmailConfirmed = u.EmailConfirmed,
                                                 PhoneNumberConfirmed = u.PhoneNumberConfirmed,
                                                 LockoutEnabled = u.LockoutEnabled,
                                                 TwoFactorEnabled = u.TwoFactorEnabled,
                                                 IsLocked = u.LockoutEnd.HasValue,
                                                 LockoutEnd = u.LockoutEnd.HasValue ? u.LockoutEnd.Value.DateTime : null,
                                                 CreatedOn = u.CreatedOn
                                             })
                                             .OrderByDescending(x => x.CreatedOn)
                                             .ToPagedListAsync(pageParams, cancellationToken);

            return result;
        }

        public async Task<PagedList<UserInfoDto>> GetAllUsersBySecurityGroupPaginatedAsync(Guid securityGroupId, PageParams pageParams, CancellationToken cancellationToken)
        {
            var result = await _context.UserSecurityGroups
                                       .Where(x => x.SecurityGroupId == securityGroupId)
                                       .Select(u => u.TenantUser.User)
                                       .Select(u => new UserInfoDto
                                       {
                                           Avatar = u.ProfilePicture.Base64,
                                           Email = u.Email,
                                           LastName = u.LastName,
                                           FirstName = u.FirstName,
                                           FullName = u.FirstName + " " + u.LastName,
                                           ResourceAlias = u.ResourceAlias,
                                           Phone = u.PhoneNumber,
                                           IsActive = u.IsActive,
                                           EmailConfirmed = u.EmailConfirmed,
                                           PhoneNumberConfirmed = u.PhoneNumberConfirmed,
                                           LockoutEnabled = u.LockoutEnabled,
                                           TwoFactorEnabled = u.TwoFactorEnabled,
                                           IsLocked = u.LockoutEnd.HasValue,
                                           LockoutEnd = u.LockoutEnd.HasValue ? u.LockoutEnd.Value.DateTime : null,
                                           CreatedOn = u.CreatedOn

                                       }).ToPagedListAsync(pageParams, cancellationToken);

            return result;
        }

        public async Task<PagedList<UserInfoDto>> GetAllUsersByAccountAliasPaginatedAsync(string accountAlias, PageParams pageParams, CancellationToken cancellationToken)
        {
            var result = await _context.Users.Where(x => !x.IsDeleted && x.Tenants.Any(x => x.Tenant.AccountAlias == accountAlias))
                                             .AsNoTracking()
                                             .AsSplitQuery()
                                             .Select(u => new UserInfoDto
                                             {
                                                 Avatar = u.ProfilePicture.Base64,
                                                 Email = u.Email,
                                                 LastName = u.LastName,
                                                 FirstName = u.FirstName,
                                                 FullName = u.FirstName + " " + u.LastName,
                                                 ResourceAlias = u.ResourceAlias,
                                                 Phone = u.PhoneNumber,
                                                 IsActive = u.IsActive,
                                                 EmailConfirmed = u.EmailConfirmed,
                                                 PhoneNumberConfirmed = u.PhoneNumberConfirmed,
                                                 LockoutEnabled = u.LockoutEnabled,
                                                 TwoFactorEnabled = u.TwoFactorEnabled,
                                                 IsLocked = u.LockoutEnd.HasValue,
                                                 LockoutEnd = u.LockoutEnd.HasValue ? u.LockoutEnd.Value.DateTime : null,
                                                 CreatedOn = u.CreatedOn
                                             })
                                             .OrderByDescending(x => x.CreatedOn)
                                             .ToPagedListAsync(pageParams, cancellationToken);

            return result;
        }

        public async Task<PagedList<UserInfoDto>> GetAllActiveUsersByTenantIdPaginatedAsync(Guid tenantId, PageParams pageParams, CancellationToken cancellationToken)
        {
            var result = await _context.Users.Where(x => x.IsActive && !x.IsDeleted && x.Tenants.Any(x => x.TenantId == tenantId))
                                             .OrderByDescending(x => x.CreatedOn)
                                             .AsNoTracking()
                                             .Select(u => new UserInfoDto
                                             {
                                                 Email = u.Email,
                                                 LastName = u.LastName,
                                                 FirstName = u.FirstName,
                                                 FullName = u.FirstName + " " + u.LastName,
                                                 ResourceAlias = u.ResourceAlias,
                                                 Phone = u.PhoneNumber,
                                                 IsActive = u.IsActive,
                                                 EmailConfirmed = u.EmailConfirmed,
                                                 PhoneNumberConfirmed = u.PhoneNumberConfirmed,
                                                 LockoutEnabled = u.LockoutEnabled,
                                                 TwoFactorEnabled = u.TwoFactorEnabled,
                                                 IsLocked = u.LockoutEnd.HasValue,
                                                 LockoutEnd = u.LockoutEnd.HasValue ? u.LockoutEnd.Value.DateTime : null
                                             })
                                             .ToPagedListAsync(pageParams, cancellationToken);

            return result;
        }

        public async Task<User> GetTenantUserInfoByEmail(Guid tenantId, string email, CancellationToken cancellationToken)
        {
            var user = await _context.Users.Where(x => x.Email == email && x.Tenants.Any(x => x.TenantId == tenantId))
                                           .Include(x => x.ProfilePicture)
                                           .FirstOrDefaultAsync(cancellationToken)!;
            return user;
        }

        public async Task<User> GetUserInfoByEmail(string email, CancellationToken cancellationToken)
        {
            var user = await _context.Users.Where(x => x.Email == email)
                                           .Include(x => x.ProfilePicture)
                                           .FirstOrDefaultAsync(cancellationToken)!;
            return user;
        }

        public async Task<User> GetUserInfoByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            var user = await _context.Users.Where(x => x.Id == id)
                                           .Include(x => x.ProfilePicture)
                                           .FirstOrDefaultAsync(cancellationToken)!;
            return user;
        }

        public async Task<User> GetUserByResourceAlias(string resourceAlias, CancellationToken cancellationToken)
        {
            var user = await _context.Users.Include(x => x.ProfilePicture).Where(x => x.ResourceAlias == resourceAlias)
                                           .FirstOrDefaultAsync(cancellationToken)!;
            return user;
        }

        public async Task<bool> UpdateProfilePictureForAllUsers(byte[] data, CancellationToken cancellationToken)
        {
            var users = await _context.Users.Include(x => x.ProfilePicture).ToListAsync();

            foreach (var item in users)
            {
                if (item.ProfilePicture != null)
                {
                    item.ProfilePicture.Data = data;
                    item.ProfilePicture.Title = item.FirstName + " " + item.LastName;
                }
            }

            _context.UpdateRange(users);

            var result = await _context.SaveChangesAsync(cancellationToken);

            return result > 0;
        }


        public async Task<UserInfoDto> GetUserInfoByResourceAlias(string resourceAlias, CancellationToken cancellationToken)
        {
            var user = await _context.Users.Where(x => x.ResourceAlias == resourceAlias)
                                           .Select(u => new UserInfoDto
                                           {
                                               Email = u.Email,
                                               LastName = u.LastName,
                                               FirstName = u.FirstName,
                                               FullName = u.FirstName + " " + u.LastName,
                                               ResourceAlias = u.ResourceAlias,
                                               Phone = u.PhoneNumber,
                                               IsActive = u.IsActive,
                                               EmailConfirmed = u.EmailConfirmed,
                                               PhoneNumberConfirmed = u.PhoneNumberConfirmed,
                                               LockoutEnabled = u.LockoutEnabled,
                                               TwoFactorEnabled = u.TwoFactorEnabled,
                                               LockoutEnd = u.LockoutEnd.HasValue ? u.LockoutEnd.Value.DateTime : null
                                           }).FirstOrDefaultAsync(cancellationToken);
            return user;
        }

        public async Task<UserManagementDashboardInfoDto> GetUserManagementDashboardInfoByTenant(Guid tenantId, CancellationToken cancellationToken)
        {
            var query = _context.Users.AsQueryable()
                                      .Where(x => !x.IsDeleted && x.Tenants.Any(x => x.TenantId == tenantId));

            var info = new UserManagementDashboardInfoDto();

            info.TotalUsers = await query.CountAsync();
            info.DeactivatedUsers = await query.CountAsync(x => !x.IsActive);
            info.ActiveUsers = await query.CountAsync(x => x.IsActive);
            info.VerifiedUsers = await query.CountAsync(x => x.EmailConfirmed);
            info.LockedUsers = await query.CountAsync(x => x.LockoutEnd != null);
            info.UnVerifiedUsers = await query.CountAsync(x => !x.EmailConfirmed);

            return info;
        }

        public async Task<UserManagementDashboardInfoDto> GetTenantUserManagementDashboardInfoByAccountAlias(string accountAlias, CancellationToken cancellationToken)
        {
            var query = _context.Users.AsQueryable()
                                      .Where(x => !x.IsDeleted && x.Tenants.Any(x => x.Tenant.AccountAlias == accountAlias));

            var info = new UserManagementDashboardInfoDto();

            info.TotalUsers = await query.CountAsync(cancellationToken);
            info.DeactivatedUsers = await query.CountAsync(x => !x.IsActive, cancellationToken);
            info.ActiveUsers = await query.CountAsync(x => x.IsActive, cancellationToken);
            info.VerifiedUsers = await query.CountAsync(x => x.EmailConfirmed, cancellationToken);
            info.LockedUsers = await query.CountAsync(x => x.LockoutEnd != null, cancellationToken);
            info.UnVerifiedUsers = await query.CountAsync(x => !x.EmailConfirmed, cancellationToken);

            return info;
        }

        public async Task<IEnumerable<UserCreatedByYearDTO>> UserCreatedByYear()
        {
            var result = await _context.Users.GroupBy(x => x.CreatedOn.Year).Select(x => new UserCreatedByYearDTO
            {
                Year = x.Key,
                TotalUsers = x.Count()
            }).OrderByDescending(x => x.Year).AsNoTracking().ToListAsync();

            return result;
        }

        public async Task<List<string>> GetTenantUserRoles(Guid tenantId, Guid userId, CancellationToken cancellationToken)
        {
            var result = await _context.Roles.Where(x => x.TenantId == tenantId)
                                             .Select(x => x.Name)
                                             .ToListAsync(cancellationToken);
            return result;
        }

        public async Task<List<string>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken)
        {
            var result = await _context.UserRoles.Where(x => x.UserId == userId)
                                                 .Select(x => x.RoleId)
                                                 .ToListAsync(cancellationToken);

            var roles = await _context.Roles.Where(x => result.Contains(x.Id))
                                            .Select(x => x.Name)
                                            .ToListAsync(cancellationToken);
            return roles;
        }

        public async Task<bool> IsUserNameAvailable(string username, CancellationToken cancellationToken)
        {
            var result = await _context.Users.AnyAsync(x => x.UserName != username, cancellationToken);

            return result;
        }

        public async Task<bool> TakeBulkActionAsync(List<string> resourceAliases, UserBulkActionsEnum action, CancellationToken cancellationToken)
        {
            var query = _context.Users.Where(x => resourceAliases.Contains(x.ResourceAlias));

            query = ApplyQuery(query, action);

            return await TakeActionAsync(query, action, cancellationToken);
        }

        public async Task<IEnumerable<UserLookupDto>> GetAllTenantUsersLookupAsync(Guid tenantId, string searchTerm, CancellationToken cancellationToken)
        {
            var query = _context.TenantUsers
                                .Where(x => x.TenantId == tenantId && !x.IsDeleted)
                                .Where(x => x.User.FirstName.Contains(searchTerm) || x.User.LastName.Contains(searchTerm))
                                .Select(z => new UserLookupDto
                                {
                                    ProfilePicture = z.User.ProfilePicture.Base64,
                                    Email = z.User.Email,
                                    Id = z.User.Id,
                                    ResourceAlias = z.User.ResourceAlias,
                                    FullName = z.User.FirstName + " " + z.User.LastName
                                });

            return await query.ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<UserLookupDto>> GetUsersBasicDetailsAsync(Guid tenantId, List<Guid> userIds, CancellationToken cancellationToken)
        {
            var query = _context.TenantUsers
                                .Where(x => x.TenantId == tenantId && !x.IsDeleted)
                                .Where(x => userIds.Contains(x.UserId) && !x.IsDeleted)
                                .Select(z => new UserLookupDto
                                {
                                    ProfilePicture = z.User.ProfilePicture.Base64,
                                    Email = z.User.Email,
                                    Id = z.User.Id,
                                    ResourceAlias = z.User.ResourceAlias,
                                    FullName = z.User.FirstName + " " + z.User.LastName
                                });

            return await query.ToListAsync(cancellationToken);
        }

        public async Task<IEnumerable<KeyValuePair<string, Guid>>> GetUsersLookupForDirectoryAsync(CancellationToken cancellationToken)
        {
            var result = await _context.Users
                                       .Select(u => new KeyValuePair<string, Guid>(u.FirstName + " " + u.LastName, u.Id))
                                       .ToListAsync(cancellationToken);

            return result;
        }

        public async Task<bool> UploadUserProfilePictureAsync(UpdateProfilePictureDto model, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                                     .Include(x => x.ProfilePicture)
                                     .FirstOrDefaultAsync(x => x.Id == model.UserId, cancellationToken);

            if (user is not null)
            {
                if (user.ProfilePicture is not null)
                {
                    user.ProfilePicture.Data = Convert.FromBase64String(model.Image);
                    user.ProfilePicture.Title = user.FirstName + " " + user.LastName;
                }
                else
                {
                    user.ProfilePicture = new Image
                    {
                        Data = Convert.FromBase64String(model.Image),
                        Title = user.FirstName + " " + user.LastName
                    };
                }
            }

            _context.Update(user);

            var result = await _context.SaveChangesAsync(cancellationToken);

            return result > 0;
        }

        #region Private methods

        private async Task<bool> TakeActionAsync(IQueryable<User> query, UserBulkActionsEnum action, CancellationToken cancellationToken)
        {
            var users = await query.ToListAsync();

            switch (action)
            {
                case UserBulkActionsEnum.Delete:
                    DeleteUsers(users);
                    break;
                case UserBulkActionsEnum.EmailConfirmed:
                    SetEmailConfirmed(users);
                    break;
                case UserBulkActionsEnum.Activate:
                    ActivateUsers(users);
                    break;
                case UserBulkActionsEnum.Deactivate:
                    DeactivateUsers(users);
                    break;
                case UserBulkActionsEnum.EmailNotConfirmed:
                    SetNotEmailConfirmed(users);
                    break;
                case UserBulkActionsEnum.LockUser:
                    LockUsers(users);
                    break;
                case UserBulkActionsEnum.UnlockUser:
                    UnlockUsers(users);
                    break;
            }

            _context.Users.UpdateRange(users);

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }

        private IQueryable<User> ApplyQuery(IQueryable<User> query, UserBulkActionsEnum action)
        {
            switch (action)
            {
                case UserBulkActionsEnum.Delete:
                    query = query.Where(x => !x.IsDeleted);
                    break;
                case UserBulkActionsEnum.EmailConfirmed:
                    query = query.Where(x => !x.EmailConfirmed);
                    break;
                case UserBulkActionsEnum.Activate:
                    query = query.Where(x => !x.IsActive);
                    break;
                case UserBulkActionsEnum.Deactivate:
                    query = query.Where(x => x.IsActive);
                    break;
                case UserBulkActionsEnum.EmailNotConfirmed:
                    query = query.Where(x => x.EmailConfirmed);
                    break;
                case UserBulkActionsEnum.LockUser:
                    query = query.Where(x => x.LockoutEnabled && (x.LockoutEnd == null || x.LockoutEnd != null && x.LockoutEnd.Value < DateTime.UtcNow));
                    break;
                case UserBulkActionsEnum.UnlockUser:
                    query = query.Where(x => x.LockoutEnabled && x.LockoutEnd.HasValue);
                    break;
            }

            return query;
        }

        private List<User> LockUsers(List<User> users)
        {
            users.ForEach(u =>
            {
                u.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
            });

            return users;
        }

        private List<User> UnlockUsers(List<User> users)
        {
            users.ForEach(u =>
            {
                u.LockoutEnd = null;
            });

            return users;
        }

        private List<User> DeleteUsers(List<User> users)
        {
            users.ForEach(u =>
            {
                u.IsDeleted = true;
                u.DeletedOn = DateTime.UtcNow;
            });

            return users;
        }

        private List<User> SetEmailConfirmed(List<User> users)
        {
            users.ForEach(u =>
            {
                u.EmailConfirmed = true;
                u.ModifiedOn = DateTime.UtcNow;
            });

            return users;
        }

        private List<User> SetNotEmailConfirmed(List<User> users)
        {
            users.ForEach(u =>
            {
                u.EmailConfirmed = false;
                u.ModifiedOn = DateTime.UtcNow;
            });

            return users;
        }

        private List<User> DeactivateUsers(List<User> users)
        {
            users.ForEach(u =>
            {
                u.IsActive = false;
                u.ModifiedOn = DateTime.UtcNow;
            });

            return users;
        }

        private List<User> ActivateUsers(List<User> users)
        {
            users.ForEach(u =>
            {
                u.IsActive = true;
                u.ModifiedOn = DateTime.UtcNow;
            });

            return users;
        }

        public async Task<PagedList<UserInfoDto>> GetAllUsersByAccountAliasPaginatedAsync(Guid tenantId, FilterTenantUsers model, CancellationToken cancellationToken)
        {
            var query = _context.Users.Where(x => !x.IsDeleted && x.Tenants.Any(x => x.TenantId == tenantId))
                                             .AsNoTracking()
                                             .AsSplitQuery();

            if (!string.IsNullOrEmpty(model.SearchTerm))
            {
                model.SearchTerm = model.SearchTerm.Trim();

                query = query.Where(x => (x.FirstName + " " + x.LastName).Contains(model.SearchTerm) || x.FirstName.Contains(model.SearchTerm) ||
                            x.LastName.Contains(model.SearchTerm) ||
                             !string.IsNullOrEmpty(x.Email) && x.Email.Contains(model.SearchTerm) ||
                             !string.IsNullOrEmpty(x.PhoneNumber) && x.PhoneNumber.Contains(model.SearchTerm) ||
                              !string.IsNullOrEmpty(x.UserName) && x.UserName.Contains(model.SearchTerm)
                            );
            }


            var result = await query
                                             .Select(u => new UserInfoDto
                                             {
                                                 Avatar = u.ProfilePicture.Base64,
                                                 Email = u.Email,
                                                 LastName = u.LastName,
                                                 FirstName = u.FirstName,
                                                 FullName = u.FirstName + " " + u.LastName,
                                                 ResourceAlias = u.ResourceAlias,
                                                 Phone = u.PhoneNumber,
                                                 IsActive = u.IsActive,
                                                 EmailConfirmed = u.EmailConfirmed,
                                                 PhoneNumberConfirmed = u.PhoneNumberConfirmed,
                                                 LockoutEnabled = u.LockoutEnabled,
                                                 TwoFactorEnabled = u.TwoFactorEnabled,
                                                 IsLocked = u.LockoutEnd.HasValue,
                                                 LockoutEnd = u.LockoutEnd.HasValue ? u.LockoutEnd.Value.DateTime : null,
                                                 CreatedOn = u.CreatedOn
                                             })
                                             .OrderByDescending(x => x.CreatedOn)
                                             .ToPagedListAsync(model, cancellationToken);

            return result;
        }

        #endregion
    }
}

