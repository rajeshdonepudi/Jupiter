using Jupiter.Models.Entities.Tenants;
using Microsoft.AspNetCore.Identity;

namespace Jupiter.Models.Entities.Users
{
    public class UserToken : IdentityUserToken<Guid>
    {
        public Guid? TenantId { get; set; }
        public virtual Tenant Tenant { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
