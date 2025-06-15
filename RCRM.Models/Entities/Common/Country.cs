using Jupiter.Models.Entities.Base;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityConfiguration.User;
using Jupiter.Models.EntityContracts;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jupiter.Models.Entities.Common
{
    [Table("Countries")]
    [EntityTypeConfiguration(typeof(CountryEntityTypeConfiguration))]
    public class Country : BaseEntity, ITrackableEntity, ISoftDeletable
    {
        public required string Name { get; set; }
        public required string TwoCharCountryCode { get; set; }
        public required string ThreeCharCountryCode { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }

        public Guid? CreatedByUserId { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }

        public virtual User CreatedByUser { get; set; }
        public virtual User LastUpdatedByUser { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedOn { get; set; }
        public virtual User DeletedByUser { get; set; }
        public Guid? DeletedByUserId { get; set; }
        public virtual ICollection<Address> Addresses { get; set; }
    }
}
