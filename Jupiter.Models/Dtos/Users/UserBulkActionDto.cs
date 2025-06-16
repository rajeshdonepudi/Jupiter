using Jupiter.Enumerations.User;

namespace Jupiter.Models.Dtos.Users
{
    public class UserBulkActionDto
    {
        public UserBulkActionDto()
        {
            ResourceAliases = new List<string>();
        }
        public List<string> ResourceAliases { get; set; }
        public UserBulkActionsEnum Action { get; set; }
    }
}
