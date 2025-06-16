using Jupiter.API.Attributes;
using Jupiter.BLL.Interfaces;
using Jupiter.Models.Dtos.Security.Permissions;
using Jupiter.Models.Dtos.Users;
using Jupiter.Security;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : BaseSecureController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("get-users-basic-details")]
        [JupiterAuthorize(PermissionPool.User_Permissions.VIEW_USERS_BASIC_DETAILS)]
        public async Task<IActionResult> GetUserBasicDetails(List<Guid> userIds, CancellationToken cancellationToken)
        {
            var result = await _userService.GetUsersBasicDetailsAsync(userIds, cancellationToken);

            return Ok(result);
        }

        [HttpGet("get-user-profile-info")]
        [JupiterAuthorize(PermissionPool.User_Permissions.VIEW_USER_PROFILE_INFO)]
        public async Task<IActionResult> GetProfileInfo([FromQuery] Guid userId, CancellationToken cancellationToken)
        {
            var result = await _userService.GetUserProfileInfoAsync(userId, cancellationToken);

            return Ok(result);
        }

        [HttpGet("get-user-info")]
        [JupiterAuthorize(PermissionPool.User_Permissions.VIEW_USER_INFO)]
        public async Task<IActionResult> GetUserInfo([FromQuery] string resourceId, CancellationToken cancellationToken)
        {
            var result = await _userService.GetUserByResourceId(resourceId, cancellationToken);

            return Ok(result);
        }

        [HttpGet("user-dashboard-info")]
        [JupiterAuthorize(PermissionPool.User_Permissions.USER_DASHBOARD_METRIC_INFO)]
        public async Task<IActionResult> TenantUserManagementDashboardInfo(CancellationToken cancellationToken)
        {
            var result = await _userService.GetUserDashboardInfoAsync(cancellationToken);

            return Ok(result);
        }

        [HttpGet("get-user-roles")]
        [JupiterAuthorize(PermissionPool.User_Permissions.VIEW_USER_ROLES)]
        public async Task<IActionResult> GetUserRoles([FromQuery] string resourceId, CancellationToken cancellationToken)
        {
            var roles = await _userService.GetUserRolesByResourceId(resourceId, cancellationToken);

            return Ok(roles);
        }

        [HttpPost("remove-user-permission")]
        public async Task<IActionResult> RemoveUserPermission(RemoveUserPermission model, CancellationToken cancellationToken)
        {
            var result = await _userService.RemoveUserPermission(model, cancellationToken);

            if (result) return Ok();

            return BadRequest();
        }

        [HttpGet("get-user-permissions")]
        [JupiterAuthorize(PermissionPool.User_Permissions.VIEW_USER_PERMISSIONS)]
        public async Task<IActionResult> GetUserPermissions(string resourceId, CancellationToken cancellationToken)
        {
            var permissions = await _userService.GetUserPermissions(resourceId, cancellationToken);

            return Ok(permissions);
        }

        [HttpPost("upload-profile-picture")]
        [JupiterAuthorize(PermissionPool.User_Permissions.CHANGE_PROFILE_PICTURE)]
        public async Task<IActionResult> UpdateProfilePicture(UpdateProfilePictureDto model, CancellationToken cancellationToken)
        {
            var result = await _userService.UpdateProfilePictureAsync(model, cancellationToken);

            if (result) return Accepted();

            return BadRequest(model);
        }
    }
}
