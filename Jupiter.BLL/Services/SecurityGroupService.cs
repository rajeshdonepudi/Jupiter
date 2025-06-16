using IdenticonSharp.Identicons;
using Jupiter.BLL.Helpers;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Security.Permissions;
using Jupiter.Models.Dtos.Security.SecurityGroups;
using Jupiter.Models.Dtos.Tenants;
using Jupiter.Models.Dtos.Users;
using Jupiter.Models.Entities.Security;
using Jupiter.Models.Entities.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Jupiter.BLL.Services
{
    public class SecurityGroupService : BaseService, ISecurityGroupService
    {

        public SecurityGroupService(UserManager<User> userManager, IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ITenantProvider tenantService, IIdenticonProvider identiconProvider) : base(userManager, unitOfWork, httpContextAccessor, configuration, tenantService, identiconProvider)
        {
        }

        public async Task<IEnumerable<SecurityGroupsListDto>> GetSecurityGroupsBasicDetails(List<Guid> securityGroupIds, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.SecurityGroupRepository.GetSecurityGroupsBasicDetailsAsync(TenantId, securityGroupIds, cancellationToken);

            return result;
        }

        public async Task<bool> AddSecurityGroupAsync(CreateSecurityGroupDto model, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.SecurityGroupRepository.AddSecurityGroup(model, TenantId, cancellationToken);

            return result;
        }

        public async Task<bool> DeleteSecurityGroupAsync(Guid securityGroupId, CancellationToken cancellationToken)
        {
            var group = await _unitOfWork.SecurityGroupRepository.QueryAsync(x => x.Id == securityGroupId && x.TenantId == TenantId, cancellationToken);

            if (group is null)
            {
                throw new Exception(MessageHelper.GeneralErrors.SOMETHING_WENT_WRONG);
            }

            _unitOfWork.SecurityGroupRepository.Remove(group);

            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);

            return result > 0;
        }

        public async Task<PagedList<UserInfoDto>> GetAllSecurityGroupUsersAsync(FilterSecurityGroupUsers model, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.SecurityGroupRepository.GetAllUsersBySecurityGroupPaginatedAsync(model.SecurityGroupId, model, cancellationToken);

            return result;
        }

        public async Task<bool> AddUsersToSecurityGroupAsync(AddUsersToSecurityGroupDto model, CancellationToken cancellationToken)
        {
            var group = await _unitOfWork.SecurityGroupRepository.FindAsync(model.SecurityGroupId, cancellationToken);

            var tenantUserIds = new List<Guid>();

            foreach (var item in model.Users)
            {
                var tenantUser = await _unitOfWork.TenantUserRepository.QueryAsync(x => x.UserId == item && x.TenantId == TenantId, cancellationToken);

                if (tenantUser is not null)
                {
                    tenantUserIds.Add(tenantUser.Id);
                }
            }

            foreach (var user in tenantUserIds)
            {
                var isUserPresent = await _unitOfWork.TenantUserSecurityGroupRepository.QueryAsync(x => x.SecurityGroupId == group.Id && x.TenantUserId == user, cancellationToken);

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

        public async Task<PagedList<SecurityGroupsListDto>> GetTenantSecurityGroupsAsync(FilterSecurityGroupsDto model, CancellationToken cancellationToken)
        {
            return await _unitOfWork.SecurityGroupRepository.GetTenantSecurityGroupsAsync(model, TenantId, cancellationToken);
        }

        public async Task<bool> UpdateSecurityGroupAsync(UpdateSecurityGroupDto model, CancellationToken cancellationToken)
        {
            var group = await _unitOfWork.SecurityGroupRepository.QueryAsync(x => x.Id == model.Id && x.TenantId == TenantId, cancellationToken);

            if (group is null)
            {
                throw new Exception(MessageHelper.GeneralErrors.INVALID_REQUEST);
            }

            group.Name = model.Name;

            _unitOfWork.SecurityGroupRepository.UpdateAsync(group);

            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);

            return result > 0;
        }

        public async Task<IEnumerable<KeyValuePair<string, Guid>>> GetTenantSecurityGroupsLookupAsync(string searchTerm, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.SecurityGroupRepository.GetTenantSecurityGroupsLookupAsync(TenantId, searchTerm, cancellationToken);

            return result;
        }

        public async Task<SecurityGroupInfoDto> GetSecurityGroupInfoAsync(Guid securityGroupId, CancellationToken cancellationToken)
        {
            var securityGroup = await _unitOfWork.SecurityGroupRepository.GetSecurityGroupInfo(TenantId, securityGroupId, cancellationToken);

            if (securityGroup is null)
            {
                throw new Exception(MessageHelper.GeneralErrors.INVALID_REQUEST);
            }

            return securityGroup;
        }

        public async Task<IEnumerable<GroupPermissionsDto>> GetSecurityGroupPermissionsAsync(Guid securityGroupId, CancellationToken cancellationToken)
        {
            var securityGroup = await _unitOfWork.SecurityGroupRepository.QueryAsync(x => x.Id == securityGroupId, includeProperties: y => y.Include(x => x.AssociatedPermissions).ThenInclude(x => x.Permission), cancellationToken);

            var groupedPermissions = new Dictionary<string, List<string>>();

            foreach (var claim in securityGroup.AssociatedPermissions)
            {
                var group = await _unitOfWork.PermissionRepository.GetPermissionGroupName(claim.Permission.Value, cancellationToken);

                if (!groupedPermissions.ContainsKey(group))
                {
                    groupedPermissions[group] = new List<string>();
                }
                groupedPermissions[group].Add(claim.Permission.Value);
            }

            var permissions = groupedPermissions.Select(pg => new GroupPermissionsDto
            {
                Name = pg.Key,
                Permissions = pg.Value
            }).ToList();

            return permissions;
        }

        public async Task<bool> DeleteUserFromSecurityGroup(DeleteUserFromSecurityGroupDto model, CancellationToken cancellationToken)
        {
            var userSecurityGroup = await _unitOfWork.TenantUserSecurityGroupRepository.QueryAsync(x => x.TenantUser.User.ResourceAlias == model.ResourceAlias &&
                                                                                                 x.TenantUser.TenantId == TenantId &&
                                                                                                 x.SecurityGroupId == model.SecurityGroupId, cancellationToken);

            _unitOfWork.TenantUserSecurityGroupRepository.Remove(userSecurityGroup);

            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);

            return result > 0;
        }
    }
}
