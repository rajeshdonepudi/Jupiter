using Jupiter.API.Attributes;
using Jupiter.BLL.Interfaces;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Security.Roles;
using Jupiter.Models.Dtos.Users;
using Jupiter.Security;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.Security
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : BaseSecureController
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService securityService)
        {
            _roleService = securityService;
        }

        [HttpGet("view-role-info")]
        [JupiterAuthorize(PermissionPool.Role_Managment.VIEW_ROLE)]
        public async Task<IActionResult> GetRole([FromQuery] Guid roleId, CancellationToken cancellationToken)
        {
            var result = await _roleService.GetRoleAsync(roleId, cancellationToken);

            return Ok(result);
        }

        [HttpPost("add-role")]
        [JupiterAuthorize(PermissionPool.Role_Managment.CREATE_ROLE)]
        public async Task<IActionResult> CreateRole(RoleDto model, CancellationToken cancellationToken)
        {
            var result = await _roleService.CreateRoleAsync(model, cancellationToken);

            if (result) return Ok(result);

            return BadRequest();
        }

        [HttpDelete("delete-role")]
        [JupiterAuthorize(PermissionPool.Role_Managment.DELETE_ROLE)]
        public async Task<IActionResult> DeleteRole([FromQuery] string roleId, CancellationToken cancellationToken)
        {
            var result = await _roleService.DeleteRoleAsync(roleId, cancellationToken);

            if (result) return Ok();

            return BadRequest();
        }

        [HttpGet("view-roles")]
        [JupiterAuthorize(PermissionPool.Role_Managment.VIEW_ROLES)]
        public async Task<IActionResult> GetRoles(CancellationToken cancellationToken)
        {
            var result = await _roleService.GetAllTenantRolesAsync(cancellationToken);

            return Ok(result);
        }

        [HttpPost("view-user-roles")]
        [JupiterAuthorize(PermissionPool.Role_Managment.VIEW_USER_ROLES)]
        public async Task<IActionResult> GetAllRoles(PageParams model, CancellationToken cancellationToken)
        {
            var result = await _roleService.GetAllUserRolesAsync(model, cancellationToken);

            return Ok(result);
        }

        [HttpPost("view-users-in-role")]
        [JupiterAuthorize(PermissionPool.Role_Managment.VIEW_USERS_IN_ROLES)]
        public async Task<IActionResult> GetUsersAssociatedWithRole(GetUsersInRoleDto model, CancellationToken cancellationToken)
        {
            var result = await _roleService.GetAllUsersInRoleAsync(model, cancellationToken);

            return Ok(result);
        }

        [HttpPost("add-user-to-role")]
        [JupiterAuthorize(PermissionPool.Role_Managment.ADD_USER_TO_ROLE)]
        public async Task<IActionResult> AddUserToRole(AddUserToRoleDto model, CancellationToken cancellationToken)
        {
            var result = await _roleService.AddUserToRoleAsync(model, cancellationToken);

            if (result)
            {
                return Ok(result);
            }
            return BadRequest();
        }

        [HttpDelete("remove-user-from-role")]
        [JupiterAuthorize(PermissionPool.Role_Managment.REMOVE_USER_FROM_ROLE)]
        public async Task<IActionResult> RemoveUserFromRole(RemoveUserFromRoleDto model, CancellationToken cancellationToken)
        {
            var result = await _roleService.RemoveUserFromRoleAsync(model, cancellationToken);

            if (result)
            {
                return Ok(result);
            }
            return BadRequest();
        }
    }
}
