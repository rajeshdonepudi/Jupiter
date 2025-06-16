using Jupiter.BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.System
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvancedSettingsController : BaseSecureController
    {
        private readonly IAdvancedSettingsService _advancedSettingsService;

        public AdvancedSettingsController(IAdvancedSettingsService advancedSettingsService)
        {
            _advancedSettingsService = advancedSettingsService;
        }

        [HttpPost("hash-password")]
        public async Task<IActionResult> HashPassword(string password)
        {
            var result = await _advancedSettingsService.HashPasswordAsync(password);

            return Ok(result);
        }

        [HttpPost("update-profile-image")]
        public async Task<IActionResult> UpdateProfileImageForAllUsers(IFormFile formFile, CancellationToken cancellationToken)
        {
            if (formFile == null || formFile.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            using (var memoryStream = new MemoryStream())
            {
                await formFile.CopyToAsync(memoryStream);

                byte[] imageBytes = memoryStream.ToArray();

                var result = await _advancedSettingsService.UpdateProfileForAllUsers(imageBytes, cancellationToken);

                if (result)
                {
                    return Ok("Image uploaded successfully");
                }
                return BadRequest();
            }
        }
    }
}
