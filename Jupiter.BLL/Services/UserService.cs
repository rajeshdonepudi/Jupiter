using IdenticonSharp.Identicons;
using Jupiter.BLL.Helpers;
using Jupiter.BLL.Hubs.Dashboards;
using Jupiter.BLL.HubsContracts;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Account;
using Jupiter.Models.Dtos.Security.Permissions;
using Jupiter.Models.Dtos.Tenants;
using Jupiter.Models.Dtos.Users;
using Jupiter.Models.Entities.Security;
using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.Entities.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace Jupiter.BLL.Services
{
    public class UserService : BaseService, IUserService
    {
        #region Fields
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly ITenantProvider _tenantService;
        private readonly IHubContext<UserDashboardHub, IUserDashboardHub> _userDashboardHubContext;
        #endregion

        #region Constructor
        public UserService(UserManager<User> userManager,
            IUnitOfWork unitOfWork,
            RoleManager<ApplicationRole> roleManager,
            ITenantProvider tenantService,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration, IIdenticonProvider identiconProvider, IHubContext<UserDashboardHub, IUserDashboardHub> userDashboardHubContext) : base(userManager, unitOfWork, httpContextAccessor, configuration, tenantService, identiconProvider)
        {
            _roleManager = roleManager;
            _tenantService = tenantService;
            _userDashboardHubContext = userDashboardHubContext;
        }
        #endregion

        public async Task<IEnumerable<UserLookupDto>> GetUsersBasicDetailsAsync(List<Guid> userIds, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.UserRepository.GetUsersBasicDetailsAsync(TenantId, userIds, cancellationToken);

            return result;
        }
        public async Task<bool> RevokeAccess(string refreshToken)
        {
            User? account = await _userManager.Users.FirstOrDefaultAsync(x => x.RefreshTokens.Any(x => x.Token == refreshToken));

            var token = await _unitOfWork.RefreshTokenRepository.QueryAsync(x => x.Token == refreshToken, CancellationToken.None);

            if (account is null)
            {
                throw new Exception(ErrorMessages.INVALID_REFRESH_TOKEN);
            }

            if (!token.IsActive)
            {
                throw new Exception(ErrorMessages.REFRESH_TOKEN_EXPIRED);
            }

            token.Revoked = DateTime.UtcNow;
            token.RevokedByIp = IpAddress;
            token.ReasonRevoked = ErrorMessages.REFRESH_TOKEN_REVOKED;
            token.ReplacedByToken = string.Empty;

            var result = await _userManager.UpdateAsync(account);

            if (!result.Succeeded)
            {
                throw new Exception(FormatIdentityErrors(result.Errors));
            }

            return result.Succeeded;
        }

        public async Task<bool> RemoveUserPermission(RemoveUserPermission model, CancellationToken cancellationToken)
        {
            var user = await _unitOfWork.UserRepository.QueryAsync(x => x.ResourceAlias == model.ResourceId, cancellationToken);
            var permission = await _unitOfWork.PermissionRepository.QueryAsync(x => x.Type == ClaimTypes.System && x.Value == model.Permission, cancellationToken);

            if (user is not null && permission is not null)
            {
                var claims = await _userManager.GetClaimsAsync(user);

                var claimToDelete = claims.FirstOrDefault(x => x.Type == permission.Type && x.Value == permission.Value);

                if (claimToDelete is not null)
                {
                    var result = await _userManager.RemoveClaimAsync(user, claimToDelete);

                    return result.Succeeded;
                }
            }
            return false;
        }

        public async Task<bool> DeleteUserAsync(string resourceAlias, CancellationToken cancellationToken)
        {
            var user = await _unitOfWork.UserRepository.GetUserByResourceAlias(resourceAlias, cancellationToken);

            if (user is null)
            {
                throw new Exception("User deleted successfully.");
            }

            user.IsDeleted = true;
            user.IsActive = false;
            user.DeletedOn = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);

            return result.Succeeded;
        }

        public async Task<bool> UpdateProfilePictureAsync(UpdateProfilePictureDto model, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.UserRepository.UploadUserProfilePictureAsync(model, cancellationToken);

            return result;
        }


        public async Task<PagedList<UserInfoDto>> GetAllActiveAsync(PageParams model)
        {
            if (model is null)
            {
                throw new Exception(ErrorMessages.INVALID_REQUEST);
            }

            var users = await _unitOfWork.UserRepository
                                         .GetAllUsersByTenantIdPaginatedAsync(TenantId, model, CancellationToken.None);


            return users;
        }

        public async Task<PagedList<UserInfoDto>> GetAllActiveTenantUsersAsync(FilterTenantUsers model, CancellationToken cancellationToken)
        {
            if (model is null)
            {
                throw new Exception(ErrorMessages.INVALID_REQUEST);
            }

            var users = await _unitOfWork.UserRepository
                                         .GetAllUsersByAccountAliasPaginatedAsync(TenantId, model, cancellationToken);


            return users;
        }

        public async Task<UserProfileInfoDto> GetUserProfileInfoAsync(Guid userId, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.UserRepository.GetUserInfoByIdAsync(userId, cancellationToken);

            var user = new UserProfileInfoDto(result);

            return user;
        }

        public async Task<UserDto> GetUserByResourceId(string resourceId, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.UserRepository.GetUserByResourceAlias(resourceId, cancellationToken);

            var user = new UserDto(result);

            return user;
        }

        public async Task<IEnumerable<string>> GetUserRolesByResourceId(string resourceId, CancellationToken cancellationToken)
        {
            var user = await _unitOfWork.UserRepository.QueryAsync(x => x.ResourceAlias == resourceId, cancellationToken);

            var roles = await _userManager.GetRolesAsync(user);

            return roles.ToList();
        }

        public async Task<IEnumerable<UserPermissionsDto>> GetUserPermissions(string resourceId, CancellationToken cancellationToken)
        {
            var user = await _unitOfWork.UserRepository.QueryAsync(x => x.ResourceAlias == resourceId, cancellationToken);

            var claims = await _userManager.GetClaimsAsync(user);

            var groupedPermissions = new Dictionary<string, List<string>>();

            foreach (var claim in claims)
            {
                var group = await _unitOfWork.PermissionRepository.GetPermissionGroupName(claim.Value, cancellationToken);

                if (!groupedPermissions.ContainsKey(group))
                {
                    groupedPermissions[group] = new List<string>();
                }
                groupedPermissions[group].Add(claim.Value);
            }

            var permissions = groupedPermissions.Select(pg => new UserPermissionsDto
            {
                Name = pg.Key,
                Permissions = pg.Value,

            }).ToList();

            return permissions;
        }

        public async Task<UserDto> GetByIdAsync(Guid userId, CancellationToken cancellationToken)
        {
            var user = await _unitOfWork.UserRepository.QueryAsync(expression: x => x.Id == userId,
                                                              includeProperties: query => query.Include(x => x.ProfilePicture),
                                                              cancellationToken: cancellationToken);
            if (user is null)
            {
                throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
            }

            var result = new UserDto(user);

            return result;
        }

        public async Task<PagedList<UserInfoDto>> GetAllUsersForUserDirectoryAsync(FilterUserDirectoryDto model, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.UserRepository.GetAllUsersForUserDirectoryAsync(model, cancellationToken);

            return result;
        }

        public async Task<bool> UpdateUserAsync(int id, SignupRequestDto model)
        {
            return await Task.FromResult(false);
        }



        public async Task<bool> UpsertUser(UpsertUserDto model)
        {
            if (!string.IsNullOrEmpty(model.ResourceAlias))
            {
                var user = await _unitOfWork.UserRepository.GetUserByResourceAlias(model.ResourceAlias, CancellationToken.None);

                if (user is not null)
                {
                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;
                    user.Email = model.Email;
                    user.IsActive = model.IsActive;
                    user.EmailConfirmed = model.EmailConfirmed;
                    user.PhoneNumberConfirmed = model.PhoneConfirmed;
                    user.LockoutEnabled = model.LockoutEnabled;
                    user.TwoFactorEnabled = model.TwoFactorEnabled;
                    user.PhoneNumber = model.Phone;

                    if (!string.IsNullOrEmpty(model.ConfirmPassword))
                    {
                        user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, model.ConfirmPassword);
                    }

                    var updateResult = await _userManager.UpdateAsync(user);

                    return updateResult.Succeeded;
                }
            }
            else
            {
                var newUser = new User()
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email,
                    CreatedOn = DateTime.UtcNow,
                    IsActive = model.IsActive,
                    EmailConfirmed = model.EmailConfirmed,
                    PhoneNumberConfirmed = model.PhoneConfirmed,
                    LockoutEnabled = model.LockoutEnabled,
                    TwoFactorEnabled = model.TwoFactorEnabled,
                    PhoneNumber = model.Phone,
                    UserName = Guid.NewGuid().ToString(),
                    PasswordHash = model.ConfirmPassword,
                    Tenants = new List<TenantUser>
                    {
                        new TenantUser
                        {
                            TenantId = TenantId
                        }
                    }
                };

                var userCreation = await _userManager.CreateAsync(newUser, model.ConfirmPassword);

                if (!userCreation.Succeeded)
                {
                    throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
                }

                var info = await _unitOfWork.UserRepository.GetUserManagementDashboardInfoByTenant(TenantId, default);

                await _userDashboardHubContext.Clients.All.SEND_USER_METRIC_INFO(info);

                return userCreation.Succeeded;
            }
            return false;
        }

        public async Task<UserManagementDashboardInfoDto> GetUserDashboardInfoAsync(CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.UserRepository.GetUserManagementDashboardInfoByTenant(TenantId, cancellationToken);

            return result;
        }

        public async Task<UserManagementDashboardInfoDto> GetTenantUserManagementDashboardInfo(string accountAlias, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.UserRepository.GetTenantUserManagementDashboardInfoByAccountAlias(accountAlias, cancellationToken);

            return result;
        }

        public async Task<IEnumerable<UserCreatedByYearDTO>> UserCreatedByYears()
        {
            var user = await _unitOfWork.UserRepository.UserCreatedByYear();

            return user;
        }

        public async Task<bool> UpdateBulkActionsAsync(UserBulkActionDto model, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.UserRepository
                                          .TakeBulkActionAsync(model.ResourceAliases, model.Action, cancellationToken);

            return result;
        }

        public async Task<IEnumerable<KeyValuePair<string, Guid>>> GetUsersLookupForDirectoryAsync(CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.UserRepository
                                          .GetUsersLookupForDirectoryAsync(cancellationToken);

            return result;
        }

        public async Task<bool> UpsertTenantUser(UpsertTenantUserDto model, CancellationToken cancellationToken)
        {
            if (!string.IsNullOrEmpty(model.ResourceAlias))
            {
                var user = await _unitOfWork.UserRepository.GetUserByResourceAlias(model.ResourceAlias, CancellationToken.None);

                if (user is not null)
                {
                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;
                    user.Email = model.Email;
                    user.IsActive = model.IsActive;
                    user.EmailConfirmed = model.EmailConfirmed;
                    user.PhoneNumberConfirmed = model.PhoneConfirmed;
                    user.LockoutEnabled = model.LockoutEnabled;
                    user.TwoFactorEnabled = model.TwoFactorEnabled;
                    user.PhoneNumber = model.Phone;

                    if (!string.IsNullOrEmpty(model.ConfirmPassword))
                    {
                        user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, model.ConfirmPassword);
                    }

                    var updateResult = await _userManager.UpdateAsync(user);

                    return updateResult.Succeeded;
                }
            }
            else
            {
                var tenant = await _unitOfWork.TenantRepository.QueryAsync(x => x.AccountAlias == model.AccountAlias, cancellationToken);

                var newUser = new User()
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Email = model.Email,
                    CreatedOn = DateTime.UtcNow,
                    IsActive = model.IsActive,
                    EmailConfirmed = model.EmailConfirmed,
                    PhoneNumberConfirmed = model.PhoneConfirmed,
                    LockoutEnabled = model.LockoutEnabled,
                    TwoFactorEnabled = model.TwoFactorEnabled,
                    PhoneNumber = model.Phone,
                    UserName = Guid.NewGuid().ToString(),
                    PasswordHash = model.ConfirmPassword,
                    Tenants = new List<TenantUser>
                    {
                        new TenantUser
                        {
                            TenantId = tenant.Id
                        }
                    }
                };

                var userCreation = await _userManager.CreateAsync(newUser, model.ConfirmPassword);

                if (!userCreation.Succeeded)
                {
                    throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
                }
                return userCreation.Succeeded;
            }
            return false;
        }

        public async Task<bool> AddUsersToSecurityGroup(AddUsersToSecurityGroupDto model, CancellationToken cancellationToken)
        {
            var group = await _unitOfWork.SecurityGroupRepository.FindAsync(model.SecurityGroupId, cancellationToken);

            foreach (var user in model.Users)
            {
                var isUserPresent = await _unitOfWork.TenantUserSecurityGroupRepository.QueryAsync(x => x.SecurityGroupId == group.Id && x.TenantUser.UserId == user, cancellationToken);

                if (isUserPresent is null)
                {
                    await _unitOfWork.TenantUserSecurityGroupRepository.AddAsync(new TenantUserSecurityGroup
                    {
                        SecurityGroupId = group.Id,
                        TenantUserId = user
                    }, cancellationToken);

                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                }
            }
            return true;
        }
    }
}
