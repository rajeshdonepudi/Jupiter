using Jupiter.Models.Dtos.Theme;

namespace Jupiter.BLL.Interfaces
{
    public interface IAppThemeService
    {
        Task<bool> DeleteThemeAsync(Guid themeId, CancellationToken cancellationToken);
        Task<SiteThemeDto> GetPrimaryThemeAsync(CancellationToken cancellationToken);
        Task<IEnumerable<SiteThemeDto>> GetThemesAsync(CancellationToken cancellationToken);
        Task<bool> AddThemeAsync(UpsertSiteThemeDto model, CancellationToken cancellationToken);
        Task<bool> UpdateThemeAsync(UpsertSiteThemeDto model, CancellationToken cancellationToken);
    }
}
