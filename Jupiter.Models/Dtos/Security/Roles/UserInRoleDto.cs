using Jupiter.Models.Dtos.Tenants;

namespace Jupiter.Models.Dtos.Security.Roles
{
    public record UserInRoleDto
    {
        public UserInRoleDto()
        {
            TenantInfo = new List<TenantLookupDto>();
        }

        public Guid UserId { get; set; }
        public string Email { get; set; }
        public string ResourceAlias { get; set; }
        public List<TenantLookupDto> TenantInfo { get; set; }
    }
}
