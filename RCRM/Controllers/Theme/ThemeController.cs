using Jupiter.API.Attributes;
using Jupiter.BLL.Interfaces;
using Jupiter.Models.Dtos.Theme;
using Jupiter.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.Theme
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThemeController : BaseSecureController
    {
        private readonly IAppThemeService _themeService;

        public ThemeController(IAppThemeService appThemeService)
        {
            _themeService = appThemeService;
        }

        [AllowAnonymous]
        [HttpGet("primary-theme")]
        public async Task<IActionResult> GetPrimarySiteSettings(CancellationToken cancellationToken)
        {
            var result = await _themeService.GetPrimaryThemeAsync(cancellationToken);

            return Ok(result);
        }

        [HttpGet("all-themes")]
        [JupiterAuthorize(PermissionPool.Theme_Managment.VIEW_ALL_THEMES)]
        public async Task<IActionResult> GetAllThemes(CancellationToken cancellationToken)
        {
            return Ok(await _themeService.GetThemesAsync(cancellationToken));
        }

        [HttpPost("add-theme")]
        [JupiterAuthorize(PermissionPool.Theme_Managment.CREATE_THEME)]
        public async Task<IActionResult> AddTheme(UpsertSiteThemeDto model, CancellationToken cancellationToken)
        {
            var result = await _themeService.AddThemeAsync(model, cancellationToken);

            if (result) return Created(GetRequestURI(), result);

            return BadRequest();
        }

        [HttpPatch("update-theme")]
        [JupiterAuthorize(PermissionPool.Theme_Managment.UPDATE_THEME)]
        public async Task<IActionResult> UpdateTheme(UpsertSiteThemeDto model, CancellationToken cancellationToken)
        {
            var result = await _themeService.UpdateThemeAsync(model, cancellationToken);

            if (result) return Accepted(result);

            return BadRequest();
        }

        [HttpDelete("delete-theme")]
        [JupiterAuthorize(PermissionPool.Theme_Managment.DELETE_THEME)]
        public async Task<IActionResult> DeleteTheme([FromQuery] Guid themeId, CancellationToken cancellationToken)
        {
            var result = await _themeService.DeleteThemeAsync(themeId, cancellationToken);

            if (result) return NoContent();

            return BadRequest();
        }
    }
}
