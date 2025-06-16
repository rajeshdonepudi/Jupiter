using Jupiter.API.Attributes;
using Jupiter.BLL.Interfaces;
using Jupiter.Models.Dtos.Security.SecurityGroups;
using Jupiter.Models.Dtos.Tenants;
using Jupiter.Models.Dtos.Users;
using Jupiter.Security;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.Security
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecurityGroupController : BaseSecureController
    {
        private readonly ISecurityGroupService _securityGroupService;

        public SecurityGroupController(ISecurityGroupService securityGroupService)
        {
            _securityGroupService = securityGroupService;
        }

        [HttpPost("get-security-group-basic-details")]
        [JupiterAuthorize(PermissionPool.Security_Group.VIEW_SECURITY_GROUPS_BASIC_DETAILS)]
        public async Task<IActionResult> GetSecurityGroupBasicDetails(List<Guid> securityGroupIds, CancellationToken cancellationToken)
        {
            var result = await _securityGroupService.GetSecurityGroupsBasicDetails(securityGroupIds, cancellationToken);

            return Ok(result);
        }

        [HttpGet("security-group-info")]
        [JupiterAuthorize(PermissionPool.Security_Group.VIEW_SECURITY_GROUP_INFO)]
        public async Task<IActionResult> GetSecurityGroupInfo([FromQuery] Guid securityGroupId, CancellationToken cancellationToken)
        {
            var securityGroupInfo = await _securityGroupService.GetSecurityGroupInfoAsync(securityGroupId, cancellationToken);

            return Ok(securityGroupInfo);
        }

        [HttpPost("add-security-group")]
        [JupiterAuthorize(PermissionPool.Security_Group.CREATE_SECURITY_GROUP)]
        public async Task<IActionResult> AddSecurityGroup(CreateSecurityGroupDto model, CancellationToken cancellationToken)
        {
            var result = await _securityGroupService.AddSecurityGroupAsync(model, cancellationToken);

            if (result) return Created(GetRequestURI(), model);

            return BadRequest(model);
        }

        [HttpPost("all-security-group-users")]
        [JupiterAuthorize(PermissionPool.Security_Group.VIEW_SECURITY_GROUP_USERS)]
        public async Task<IActionResult> GetAllSecurityGroupUsers(FilterSecurityGroupUsers model, CancellationToken cancellationToken)
        {
            var response = await _securityGroupService.GetAllSecurityGroupUsersAsync(model, cancellationToken);

            return Ok(response);
        }

        [HttpPatch("update-security-group")]
        [JupiterAuthorize(PermissionPool.Security_Group.UPDATE_SECURITY_GROUP)]
        public async Task<IActionResult> UpdateSecurityGroup(UpdateSecurityGroupDto model, CancellationToken cancellationToken)
        {
            var result = await _securityGroupService.UpdateSecurityGroupAsync(model, cancellationToken);

            if (result) return Accepted(GetRequestURI(), model);

            return BadRequest(model);
        }

        [HttpPost("tenant-security-groups")]
        [JupiterAuthorize(PermissionPool.Security_Group.VIEW_SECURITY_GROUPS)]
        public async Task<IActionResult> GetSecurityGroups(FilterSecurityGroupsDto model, CancellationToken cancellationToken)
        {
            var result = await _securityGroupService.GetTenantSecurityGroupsAsync(model, cancellationToken);

            return Ok(result);
        }

        [HttpDelete("delete-tenant-security-group")]
        [JupiterAuthorize(PermissionPool.Security_Group.DELETE_SECURITY_GROUP)]
        public async Task<IActionResult> DeleteSecurityGroup([FromQuery] Guid securityGroupId, CancellationToken cancellationToken)
        {
            var result = await _securityGroupService.DeleteSecurityGroupAsync(securityGroupId, cancellationToken);

            if (result) return NoContent();

            return BadRequest();
        }

        [HttpGet("tenant-security-groups-lookup")]
        [JupiterAuthorize(PermissionPool.Security_Group.VIEW_SECURITY_GROUPS_LOOKUP)]
        public async Task<IActionResult> GetTenantSecurityGroupsLookup([FromQuery] string? searchTerm, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                return Ok(Enumerable.Empty<KeyValuePair<string, Guid>>());
            }
            var result = await _securityGroupService.GetTenantSecurityGroupsLookupAsync(searchTerm, cancellationToken);

            return Ok(result);
        }

        [HttpPost("add-users-to-security-group")]
        [JupiterAuthorize(PermissionPool.Security_Group.ADD_USERS_TO_SECURITY_GROUP)]
        public async Task<IActionResult> AddUserToSecurityGroup(AddUsersToSecurityGroupDto model, CancellationToken cancellationToken)
        {
            var result = await _securityGroupService.AddUsersToSecurityGroupAsync(model, cancellationToken);

            if (result) return Ok();

            return BadRequest();
        }

        [HttpDelete("delete-user-from-security-group")]
        [JupiterAuthorize(PermissionPool.Security_Group.DELETE_USER_FROM_SECURITY_GROUP)]
        public async Task<IActionResult> DeleteUserFromSecurityGroup(DeleteUserFromSecurityGroupDto model, CancellationToken cancellationToken)
        {
            var result = await _securityGroupService.DeleteUserFromSecurityGroup(model, cancellationToken);

            if (result) return Ok();

            return BadRequest();
        }

        [HttpGet("get-security-group-permissions")]
        [JupiterAuthorize(PermissionPool.Security_Group.VIEW_SECURITY_GROUP_PERMISSIONS)]
        public async Task<IActionResult> GetUserPermissions([FromQuery] Guid securityGroupId, CancellationToken cancellationToken)
        {
            var permissions = await _securityGroupService.GetSecurityGroupPermissionsAsync(securityGroupId, cancellationToken);

            return Ok(permissions);
        }
    }
}
