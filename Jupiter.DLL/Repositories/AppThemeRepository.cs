using Jupiter.DAL.Contracts;
using Jupiter.Models.Dtos.Theme;
using Jupiter.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class AppThemeRepository : GenericRepository<AppTheme>, IAppThemeRepository
    {
        public AppThemeRepository(JupiterContext context, IMemoryCache cache) : base(context, cache)
        {
        }

        public async Task<IEnumerable<SiteThemeDto>> GetAllSiteThemesAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            var themes = await _context.AppThemes.Where(x => !x.IsDeleted && x.TenantId == tenantId)
                                                 .OrderByDescending(x => x.IsPrimary).ThenByDescending(x => x.CreatedOn)
                                                 .Select(x => new SiteThemeDto
                                                 {
                                                     Id = x.Id,
                                                     PrimaryColor = x.PrimaryColor,
                                                     SecondaryColor = x.SecondaryColor,
                                                     ThemePreference = x.ThemePreference,
                                                     IsPrimary = x.IsPrimary,
                                                     FontFamily = x.FontFamily
                                                 })
                                                 .ToListAsync(cancellationToken);
            return themes;
        }

        public async Task<SiteThemeDto> GetTenantPrimarySiteThemeAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            var themes = await _context.AppThemes.Where(x => !x.IsDeleted && x.TenantId == tenantId && x.IsPrimary)
                                                 .Select(x => new SiteThemeDto
                                                 {
                                                     Id = x.Id,
                                                     PrimaryColor = x.PrimaryColor,
                                                     SecondaryColor = x.SecondaryColor,
                                                     ThemePreference = x.ThemePreference,
                                                     IsPrimary = x.IsPrimary,
                                                     FontFamily = x.FontFamily
                                                 })
                                                 .FirstOrDefaultAsync(cancellationToken);
            return themes;
        }

        public async Task<List<AppTheme>> GetAllTenantSiteThemesAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            var themes = await _context.AppThemes.Where(x => !x.IsDeleted && x.TenantId == tenantId)
                                                 .ToListAsync(cancellationToken);

            return themes;
        }
    }
}

