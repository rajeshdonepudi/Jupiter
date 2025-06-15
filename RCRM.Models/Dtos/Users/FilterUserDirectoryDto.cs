using Jupiter.Helpers.Helpers;

namespace Jupiter.Models.Dtos.Users
{
    public class FilterUserDirectoryDto : PageParams
    {
        public string? SearchTerm { get; set; }
        public List<Guid>? Tenants { get; set; }
    }
}
