using Jupiter.Helpers.Helpers;

namespace Jupiter.Models.Dtos.Tenants
{
    public class FilterSecurityGroupUsers : PageParams
    {
        public Guid SecurityGroupId { get; set; }
    }

    public class FilterTenantUsers : PageParams
    {
        public string? AccountAlias { get; set; }
        public string? SearchTerm { get; set; }
    }
    public record AddTenantDto
    {
        public string ProfilePicture { get; set; }
        public required string Name { get; set; }
        public required string Host { get; set; }
    }
}
