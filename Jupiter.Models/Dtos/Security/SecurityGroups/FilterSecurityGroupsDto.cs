using Jupiter.Helpers.Helpers;

namespace Jupiter.Models.Dtos.Security.SecurityGroups
{
    public class FilterSecurityGroupsDto : PageParams
    {
        public string? SearchTerm { get; set; }
    }
}
