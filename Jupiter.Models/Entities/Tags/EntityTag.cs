using Jupiter.Models.Entities.Base;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityConfiguration.Tags;
using Jupiter.Models.EntityContracts;
using Microsoft.EntityFrameworkCore;

namespace Jupiter.Models.Entities.Tags
{
    [EntityTypeConfiguration(typeof(EntityTagEntityTypeConfiguration))]
    public class EntityTag : BaseEntity, ISoftDeletable, ITrackableEntity
    {
        public Guid? UserId { get; set; }
        public virtual User User { get; set; }


        public Guid TagId { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedOn { get; set; }
        public Guid? DeletedByUserId { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }

        public virtual Tag Tag { get; set; }
        public virtual User CreatedByUser { get; set; }
        public virtual User DeletedByUser { get; set; }
        public virtual User LastUpdatedByUser { get; set; }
    }
}
