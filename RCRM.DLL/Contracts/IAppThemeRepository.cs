using Jupiter.Models.Dtos.Theme;
using Jupiter.Models.Entities;
using Jupiter.Models.EntityContracts;

namespace Jupiter.DAL.Contracts
{
    public interface IAppThemeRepository : IGenericRepository<AppTheme>
    {
        Task<SiteThemeDto> GetTenantPrimarySiteThemeAsync(Guid tenantId, CancellationToken cancellationToken);
        Task<IEnumerable<SiteThemeDto>> GetAllSiteThemesAsync(Guid tenantId, CancellationToken cancellationToken);
        Task<List<AppTheme>> GetAllTenantSiteThemesAsync(Guid tenantId, CancellationToken cancellationToken);
    }
}
