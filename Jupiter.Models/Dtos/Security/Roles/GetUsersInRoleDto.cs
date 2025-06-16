using Jupiter.Helpers.Helpers;

namespace Jupiter.Models.Dtos.Security.Roles
{
    public class GetUsersInRoleDto : PageParams
    {
        public Guid RoleId { get; set; }
    }
}
