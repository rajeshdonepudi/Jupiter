using IdenticonSharp.Identicons;
using Jupiter.BLL.Helpers;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Enumerations.Theme;
using Jupiter.Models.Dtos.Theme;
using Jupiter.Models.Entities;
using Jupiter.Models.Entities.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Jupiter.BLL.Services
{
    public class AppThemeService : BaseService, IAppThemeService
    {
        public AppThemeService(UserManager<User> userManager,
            IUnitOfWork unitOfWork,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration,
            ITenantProvider tenantProvider, IIdenticonProvider identiconProvider) :
            base(userManager,
                unitOfWork,
                httpContextAccessor,
                configuration,
                tenantProvider,
                identiconProvider)
        {
        }

        public async Task<IEnumerable<SiteThemeDto>> GetThemesAsync(CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.AppThemeRepository.GetAllSiteThemesAsync(TenantId, cancellationToken);

            return result;
        }

        public async Task<SiteThemeDto> GetPrimaryThemeAsync(CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.AppThemeRepository.GetTenantPrimarySiteThemeAsync(TenantId, cancellationToken);

            return result;
        }

        public async Task<bool> AddThemeAsync(UpsertSiteThemeDto model, CancellationToken cancellationToken)
        {
            var added = await _unitOfWork.AppThemeRepository.AddAsync(new AppTheme
            {
                PrimaryColor = model.PrimaryColor,
                SecondaryColor = model.SecondaryColor,
                IsPrimary = model.IsPrimary,
                CreatedOn = DateTime.UtcNow,
                FontFamily = model.FontFamily,
                TenantId = TenantId,
                ThemePreference = GetTheme(model.ThemePreference),
                IsDeleted = false
            }, cancellationToken); ;

            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);

            if (result > 0 && model.IsPrimary)
            {
                await SetPrimaryTheme(added.Id, cancellationToken);
            }

            return result > 0;
        }

        public async Task<bool> UpdateThemeAsync(UpsertSiteThemeDto model, CancellationToken cancellationToken)
        {
            var theme = await _unitOfWork.AppThemeRepository.FindAsync(model.Id.GetValueOrDefault(), TenantId, cancellationToken);

            if (theme is null)
            {
                return false;
            }

            theme.PrimaryColor = model.PrimaryColor;
            theme.SecondaryColor = model.SecondaryColor;
            theme.IsPrimary = model.IsPrimary;
            theme.FontFamily = model.FontFamily;
            theme.ModifiedOn = DateTime.UtcNow;
            theme.ThemePreference = GetTheme(model.ThemePreference);

            _unitOfWork.AppThemeRepository.UpdateAsync(theme);

            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);

            if (result > 0 && theme.IsPrimary)
            {
                await SetPrimaryTheme(theme.Id, cancellationToken);
            }

            return result > 0;
        }

        public async Task<bool> DeleteThemeAsync(Guid themeId, CancellationToken cancellationToken)
        {
            var theme = await _unitOfWork.AppThemeRepository.QueryAsync(x => x.Id == themeId && !x.IsDeleted, cancellationToken);

            if (theme is null)
            {
                throw new Exception(MessageHelper.GeneralErrors.INVALID_REQUEST);
            }

            if (theme.IsPrimary)
            {
                throw new Exception(MessageHelper.ThemeErrors.PRIMARY_THEME_CANNOT_BE_DELETED);
            }

            theme.IsDeleted = true;
            theme.ModifiedOn = DateTime.UtcNow;

            _unitOfWork.AppThemeRepository.UpdateAsync(theme);

            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);

            return result > 0;
        }

        private async Task SetPrimaryTheme(Guid newPrimaryThemeId, CancellationToken cancellationToken)
        {
            var tenantId = TenantId;

            var result = await _unitOfWork.AppThemeRepository.GetAllTenantSiteThemesAsync(tenantId, cancellationToken);

            foreach (var item in result.Where(x => x.Id != newPrimaryThemeId))
            {
                item.IsPrimary = false;
            }

            await _unitOfWork.AppThemeRepository.UpdateRangeAsync(result);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        private ThemePreferenceEnum GetTheme(ThemePreferenceEnum preference)
        {
            switch (preference)
            {
                case ThemePreferenceEnum.Light:
                    return ThemePreferenceEnum.Light;
                case ThemePreferenceEnum.Dark:
                    return ThemePreferenceEnum.Dark;
                default:
                    return ThemePreferenceEnum.SystemDefault;
            }
        }
    }
}
