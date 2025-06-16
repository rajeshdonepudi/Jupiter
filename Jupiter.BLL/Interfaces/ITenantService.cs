using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Tenants;

namespace Jupiter.BLL.Interfaces
{
    public interface ITenantService
    {
        Task<TenantDetailsDto> GetTenantDetailsAsync(string resoureAlias, CancellationToken cancellationToken);
        Task<bool> AddTenantAsync(AddTenantDto model, CancellationToken cancellationToken);
        Task<PagedList<TenantDetailsDto>> GetAllTenantsAsync(PageParams model, CancellationToken cancellationToken);
        Task<TenantLookupDto> GetTenantInfoAsync(CancellationToken cancellationToken);
        Task<TenantManagementDashboardInfoDto> GetTenantManagementDashboardInfo(CancellationToken cancellationToken);
        Task<IEnumerable<KeyValuePair<string, Guid>>> GetTenantsLookupForDirectoryAsync(string? searchTerm, CancellationToken cancellationToken);
        Task<IEnumerable<TenantBasicDetailDto>> GetTenantBasicDetailsAsync(List<Guid> tenantIds, CancellationToken cancellationToken);
    }
}
