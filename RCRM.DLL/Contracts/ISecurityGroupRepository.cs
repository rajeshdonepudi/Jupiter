using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Security.Permissions;
using Jupiter.Models.Dtos.Security.SecurityGroups;
using Jupiter.Models.Dtos.Users;
using Jupiter.Models.Entities.Security;
using Jupiter.Models.EntityContracts;

namespace Jupiter.DAL.Contracts
{
    public interface ISecurityGroupRepository : IGenericRepository<SecurityGroup>
    {
        Task<PagedList<UserInfoDto>> GetAllUsersBySecurityGroupPaginatedAsync(Guid securityGroupId, PageParams pageParams, CancellationToken cancellationToken);
        Task<bool> DeleteSecurityGroup(Guid securityGroupId, CancellationToken cancellationToken);
        Task<bool> AddSecurityGroup(CreateSecurityGroupDto model, Guid tenantId, CancellationToken cancellationToken);
        Task<PagedList<SecurityGroupsListDto>> GetTenantSecurityGroupsAsync(FilterSecurityGroupsDto model, Guid tenantId, CancellationToken cancellationToken);
        Task<IEnumerable<KeyValuePair<string, Guid>>> GetTenantSecurityGroupsLookupAsync(Guid tenantId, string searchTerm, CancellationToken cancellationToken);
        Task<SecurityGroupInfoDto> GetSecurityGroupInfo(Guid tenantId, Guid securityGroupId, CancellationToken cancellationToken);
        Task<IEnumerable<SecurityGroupsListDto>> GetSecurityGroupsBasicDetailsAsync(Guid tenantId, List<Guid> securityGroupIds, CancellationToken cancellationToken);
    }
}
