using Jupiter.Enumerations.Tags;
using Jupiter.Models.Entities.Base;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityConfiguration.Tags;
using Jupiter.Models.EntityContracts;
using Microsoft.EntityFrameworkCore;

namespace Jupiter.Models.Entities.Tags
{
    [EntityTypeConfiguration(typeof(TagEntityTypeConfiguration))]
    public class Tag : BaseEntity, ITrackableEntity, ISoftDeletable
    {
        public string NormalizedName { get; set; } = string.Empty;
        public required string Name { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public virtual User CreatedByUser { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }
        public virtual User LastUpdatedByUser { get; set; }
        public TagSourceEnum CreatedFrom { get; set; }

        public virtual ICollection<EntityTag> EntityTags { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedOn { get; set; }
        public virtual User DeletedByUser { get; set; }
        public Guid? DeletedByUserId { get; set; }
    }
}
