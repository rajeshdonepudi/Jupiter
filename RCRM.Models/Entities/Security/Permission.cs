using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityConfiguration.Security;
using Jupiter.Models.EntityContracts;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jupiter.Models.Entities.Security
{
    [EntityTypeConfiguration(typeof(PermissionConfiguration))]
    [Table("Permissions")]
    public class Permission : ITrackableEntity, IEquatable<Permission>
    {
        public Permission()
        {
            AssociatedGroups = new HashSet<SecurityGroupPermission>();
            AssociatedTenants = new HashSet<TenantPermission>();
        }

        [Key]
        public Guid Id { get; set; }
        public required string Type { get; set; }
        public required string Value { get; set; }
        public string? Description { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }

        public virtual ICollection<SecurityGroupPermission> AssociatedGroups { get; set; }
        public virtual ICollection<TenantPermission> AssociatedTenants { get; set; }

        public Guid PermissionGroupId { get; set; }
        public virtual PermissionGroup PermissionGroup { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public User CreatedByUser { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }
        public User LastUpdatedByUser { get; set; }

        public bool Equals(Permission? other)
        {
            return Type == other?.Type && Value == other.Value;
        }
    }
}
