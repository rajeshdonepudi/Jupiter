using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityContracts;

namespace Jupiter.Models.Entities.Base
{
    public class MultiTenantEntity : IMultiTenantEntity
    {
        private DateTime createdOn;

        public Guid? TenantId { get; set; }
        public virtual Tenant Tenant { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn
        {
            get => createdOn;
            set => createdOn = DateTime.UtcNow;
        }
        public Guid? CreatedByUserId { get; set; }
        public User CreatedByUser { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }
        public User LastUpdatedByUser { get; set; }
    }
}
