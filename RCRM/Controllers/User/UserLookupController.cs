using Jupiter.API.Attributes;
using Jupiter.BLL.Interfaces;
using Jupiter.Security;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserLookupController : BaseSecureController
    {
        private readonly IUserLookupService _userLookupService;

        public UserLookupController(IUserLookupService userLookupService)
        {
            _userLookupService = userLookupService;
        }


        [HttpGet("users-lookup")]
        [JupiterAuthorize(PermissionPool.User_Permissions.VIEW_USERS_LOOKUP)]
        public async Task<IActionResult> GetAllUsersLookup([FromQuery] string? searchTerm, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(searchTerm)) return Ok();
            return Ok(await _userLookupService.GetAllUsersLookup(searchTerm, cancellationToken));
        }
    }
}
