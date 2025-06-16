using Jupiter.API.Attributes;
using Jupiter.BLL.Interfaces;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Account;
using Jupiter.Models.Dtos.Tenants;
using Jupiter.Models.Dtos.Users;
using Jupiter.Security;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserManagementController : BaseSecureController
    {
        private readonly IUserService _userService;

        public UserManagementController(IUserService accountService)
        {
            _userService = accountService;
        }

        [HttpGet("user-management-dashboard-info")]
        [JupiterAuthorize(PermissionPool.User_Management.USER_METRIC_BASIC_INFO)]
        public async Task<IActionResult> TenantUserManagementDashboardInfo([FromQuery] string accountAlias, CancellationToken cancellationToken)
        {
            var result = await _userService.GetTenantUserManagementDashboardInfo(accountAlias, cancellationToken);

            return Ok(result);
        }

        [HttpPost("add-user")]
        [JupiterAuthorize(PermissionPool.User_Management.CREATE_USER)]
        public async Task<IActionResult> AddUser(UpsertUserDto model)
        {
            var result = await _userService.UpsertUser(model);

            if (result)
            {
                return Ok(result);
            }
            return BadRequest();
        }


        [HttpPost("upsert-tenant-user")]
        [JupiterAuthorize(PermissionPool.User_Management.UPDATE_USER)]
        public async Task<IActionResult> UpsertTenantUser(UpsertTenantUserDto model, CancellationToken cancellationToken)
        {
            var result = await _userService.UpsertTenantUser(model, cancellationToken);

            if (result)
            {
                return Ok(result);
            }
            return BadRequest();
        }

        [HttpDelete("delete-user/{resourceAlias}")]
        [JupiterAuthorize(PermissionPool.User_Management.DELETE_USER)]
        public async Task<IActionResult> DeleteUser(string resourceAlias)
        {
            var result = await _userService.DeleteUserAsync(resourceAlias, CancellationToken.None);

            if (result)
            {
                return Ok(result);
            }
            return BadRequest();
        }

        [HttpPost("all-users")]
        public async Task<IActionResult> GetAllUsers(PageParams model)
        {
            var response = await _userService.GetAllActiveAsync(model);

            return Ok(response);
        }

        [HttpPost("all-tenant-users")]
        [JupiterAuthorize(PermissionPool.User_Management.VIEW_USERS)]
        public async Task<IActionResult> GetAllTenantUsers(FilterTenantUsers model, CancellationToken cancellationToken)
        {
            var response = await _userService.GetAllActiveTenantUsersAsync(model, cancellationToken);

            return Ok(response);
        }

        [HttpGet("get-user")]
        [JupiterAuthorize(PermissionPool.User_Permissions.VIEW_USER_INFO)]
        public async Task<IActionResult> GetByUserId([FromQuery] Guid userId, CancellationToken cancellationToken)
        {
            var response = await _userService.GetByIdAsync(userId, cancellationToken);

            return Ok(response);
        }

        [HttpPost("revoke-refresh-token")]
        [JupiterAuthorize(PermissionPool.User_Management.REVOKE_ACCESS)]
        public async Task<IActionResult> RevokeRefreshToken(RevokeRefreshTokenRequestDto model)
        {
            var response = await _userService.RevokeAccess(model.RefreshToken);

            if (response)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost("bulk-action")]
        [JupiterAuthorize(PermissionPool.User_Management.BULK_USER_ACTIONS)]
        public async Task<IActionResult> TakeBulkAction(UserBulkActionDto model, CancellationToken cancellationToken)
        {
            var result = await _userService.UpdateBulkActionsAsync(model, cancellationToken);

            if (result)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpGet("user-created-year")]

        public async Task<IActionResult> UserCreatedByYear()
        {
            return Ok(await _userService.UserCreatedByYears());
        }

        [HttpPost("filter-user-directory")]

        public async Task<IActionResult> GetAllUsersForUserDirectory(FilterUserDirectoryDto model, CancellationToken cancellationToken)
        {
            var result = await _userService.GetAllUsersForUserDirectoryAsync(model, cancellationToken);

            return Ok(result);
        }

        [HttpGet("user-lookup-for-directory")]

        public async Task<IActionResult> GetUserLookupForDirectory(CancellationToken cancellationToken)
        {
            var result = await _userService.GetUsersLookupForDirectoryAsync(cancellationToken);

            return Ok(result);
        }
    }
}
