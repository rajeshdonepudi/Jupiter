using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.EntityContracts;
using Microsoft.AspNetCore.Identity;

namespace Jupiter.Models.Entities.Users
{
    public class UserClaim : IdentityUserClaim<Guid>, IMultiTenantEntity
    {
        public Guid? TenantId { get; set; }
        public virtual Tenant Tenant { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public User CreatedByUser { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }
        public User LastUpdatedByUser { get; set; }
    }
}
