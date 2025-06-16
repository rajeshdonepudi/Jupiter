using Jupiter.API.Attributes;
using Jupiter.BLL.Interfaces;
using Jupiter.Models.Dtos.Security.Permissions;
using Jupiter.Security;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.Security
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : BaseSecureController
    {
        private readonly IPermissionService _permissionService;

        public PermissionController(IPermissionService permissionService)
        {
            _permissionService = permissionService;
        }

        [HttpGet("all")]
        [JupiterAuthorize("")]
        public async Task<IActionResult> GetPermissions(CancellationToken cancellationToken)
        {
            var result = await _permissionService.GetPermissionsAsync(cancellationToken);

            return Ok(result);
        }

        [HttpGet("tenant-permissions")]
        [JupiterAuthorize(PermissionPool.Permission_Management.VIEW_PERMISSIONS)]
        public async Task<IActionResult> GetTenantPermissions(CancellationToken cancellationToken)
        {
            var result = await _permissionService.GetTenantPermissionsAsync(cancellationToken);

            return Ok(result);
        }



        [HttpPost("manage-permissions")]
        [JupiterAuthorize(PermissionPool.Permission_Management.MANAGE_PERMISSIONS)]
        public async Task<IActionResult> ManagePermissions(ManagePermissionsDto model, CancellationToken cancellationToken)
        {
            var result = await _permissionService.ManagePermissionsAsync(model, cancellationToken);

            if (result) return Ok();

            return BadRequest();
        }

        [HttpPost("manage-permissions-for-tenant")]
        public async Task<IActionResult> ManagePermissionsForTenant(ManagePermissionsForTenantDto model, CancellationToken cancellationToken)
        {
            var result = await _permissionService.ManagePermissionsForTenantAsync(model, cancellationToken);

            if (result) return Ok();

            return BadRequest();
        }
    }
}
