using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Tenants;
using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.EntityContracts;

namespace Jupiter.DAL.Contracts
{
    public interface ITenantRepository : IGenericRepository<Tenant>
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="host"></param>
        /// <returns></returns>
        Guid GetTenantIdByHost(string host);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<PagedList<TenantDetailsDto>> GetAllTenantsAsync(PageParams model, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="host"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<Tenant> GetTenantByHost(string host, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="tenantId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<TenantLookupDto> GetTenantBasicInfoByIdAsync(Guid tenantId, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<TenantManagementDashboardInfoDto> GetTenantManagementDashboardInfoAsync(CancellationToken cancellationToken);
        Task<IEnumerable<KeyValuePair<string, Guid>>> GetTenantsLookupForDirectoryAsync(string? searchTerm, CancellationToken cancellationToken);
        Task<TenantDetailsDto> GetTenantDetailsAsync(string accountAlias, CancellationToken cancellationToken);
        Task<IEnumerable<TenantBasicDetailDto>> GetTenantBasicDetailsAsync(List<Guid> tenantIds, CancellationToken cancellationToken);
    }
}
