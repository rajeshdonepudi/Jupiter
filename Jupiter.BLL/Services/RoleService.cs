using IdenticonSharp.Identicons;
using Jupiter.BLL.Helpers;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Security.Roles;
using Jupiter.Models.Dtos.Users;
using Jupiter.Models.Entities.Security;
using Jupiter.Models.Entities.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Jupiter.BLL.Services
{
    public class RoleService : BaseService, IRoleService
    {
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IPasswordHasher<User> _passwordHasher;

        public RoleService(UserManager<User> userManager,
            IUnitOfWork unitOfWork,
            ITenantProvider tenantService,
            RoleManager<ApplicationRole> roleManager,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration, IPasswordHasher<User> passwordHasher, IIdenticonProvider identiconProvider) : base(userManager, unitOfWork, httpContextAccessor, configuration, tenantService, identiconProvider)
        {
            _roleManager = roleManager;
            _passwordHasher = passwordHasher;
        }

        public async Task<bool> AddUserToRoleAsync(AddUserToRoleDto model, CancellationToken cancellationToken)
        {
            if (model is null)
            {
                throw new Exception(ErrorMessages.INVALID_REQUEST);
            }

            var role = await _roleManager.Roles.FirstOrDefaultAsync(x => x.Id == model.RoleId && x.TenantId == TenantId);

            if (role is null)
            {
                throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
            }

            var userIds = await _userManager.Users.Where(x => model.Users.Contains(x.Id) && x.Tenants.Any(y => y.TenantId == TenantId))
                                                  .Select(x => x.Id)
                                                  .ToListAsync();

            model.Users = userIds;

            var result = await _unitOfWork.UserRoleRepository.AddUsersToRoleAsync(TenantId, model, cancellationToken);

            if (!result)
            {
                throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
            }
            return result;
        }

        public async Task<string> HashPasswordForUserAsync(HashPasswordForUserDto model)
        {
            if (model is null || model.UserId is null || model.UserId is null)
            {
                throw new Exception(ErrorMessages.INVALID_REQUEST);
            }

            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user is null)
            {
                throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
            }

            var hashedPassword = await Task.FromResult(_passwordHasher.HashPassword(user, model.Password));

            return hashedPassword;
        }

        public async Task<bool> CreateRoleAsync(RoleDto model, CancellationToken cancellationToken)
        {
            if (model is null)
            {
                throw new Exception(ErrorMessages.INVALID_REQUEST);
            }

            var tenantId = TenantId;

            var role = new ApplicationRole()
            {
                Name = model.Name,
                CreatedOn = DateTime.UtcNow,
                TenantId = tenantId,
            };

            var result = await _roleManager.CreateAsync(role);

            if (!result.Succeeded)
            {
                throw new Exception(FormatIdentityErrors(result.Errors));
            }
            return result.Succeeded;
        }

        public async Task<bool> DeleteRoleAsync(string roleId, CancellationToken cancellationToken)
        {
            var role = await _roleManager.FindByIdAsync(roleId);

            if (role is null)
            {
                throw new Exception(ErrorMessages.INVALID_REQUEST);
            }

            var result = await _roleManager.DeleteAsync(role);

            return result.Succeeded;
        }

        public async Task<IEnumerable<ApplicationRole>> GetAllTenantRolesAsync(CancellationToken cancellationToken)
        {
            var roles = await _roleManager.Roles.ToListAsync(cancellationToken);

            return roles;
        }

        public async Task<PagedList<SecurityRoleDto>> GetAllUserRolesAsync(PageParams pageParams, CancellationToken cancellationToken)
        {
            var roles = await _unitOfWork.SecurityRolesRepository.GetAllUserRolesAsync(TenantId, pageParams, cancellationToken);

            return roles;
        }

        public async Task<PagedList<UserInRoleDto>> GetAllUsersInRoleAsync(GetUsersInRoleDto model, CancellationToken cancellationToken)
        {
            var users = await _unitOfWork.SecurityRolesRepository.GetUsersInRoleAsync(model, cancellationToken);

            return users;
        }

        public async Task<SecurityRoleDto> GetRoleAsync(Guid roleId, CancellationToken cancellationToken)
        {
            if (IsGodSession)
            {

            }
            var role = await _unitOfWork.SecurityRolesRepository.GetTenantRoleInfoAsync(roleId, TenantId, IsGodSession, cancellationToken);

            if (role is null)
            {
                throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
            }
            return role;
        }

        public async Task<bool> RemoveUserFromRoleAsync(RemoveUserFromRoleDto model, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(model.UserId.ToString());
            var role = await _roleManager.FindByIdAsync(model.RoleId.ToString());

            if (user is null || role is null)
            {
                throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
            }

            var result = await _userManager.RemoveFromRoleAsync(user, role.Name);

            return result.Succeeded;
        }
    }
}
