using Jupiter.Models.Entities.Base;
using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityContracts;

namespace Jupiter.Models.Entities.Leads
{
    public class LeadStatus : BaseEntity, ISoftDeletable, ITrackableEntity, IMultiTenantEntity
    {
        public LeadStatus()
        {
            Leads = new HashSet<Lead>();
        }

        public required string Name { get; set; }

        public virtual ICollection<Lead> Leads { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedOn { get; set; }
        public virtual User DeletedByUser { get; set; }
        public Guid? DeletedByUserId { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public virtual User CreatedByUser { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }
        public virtual User LastUpdatedByUser { get; set; }
        public Guid? TenantId { get; set; }
        public virtual Tenant Tenant { get; set; }
    }

    public class Lead : BaseEntity, ISoftDeletable, ITrackableEntity, IMultiTenantEntity
    {
        public required string Name { get; set; }

        public Guid LeadStatusId { get; set; }
        public virtual LeadStatus LeadStatus { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedOn { get; set; }
        public virtual User DeletedByUser { get; set; }
        public Guid? DeletedByUserId { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public virtual User CreatedByUser { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }
        public virtual User LastUpdatedByUser { get; set; }
        public Guid? TenantId { get; set; }
        public virtual Tenant Tenant { get; set; }
    }
}
