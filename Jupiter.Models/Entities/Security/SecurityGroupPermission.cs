using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityConfiguration.Security;
using Jupiter.Models.EntityContracts;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jupiter.Models.Entities.Security
{
    [EntityTypeConfiguration(typeof(SecurityGroupPermissionConfiguration))]
    [Table("SecurityGroupPermissions")]
    public class SecurityGroupPermission : ITrackableEntity
    {
        public Guid SecurityGroupId { get; set; }
        public virtual SecurityGroup SecurityGroup { get; set; }

        public Guid PermissionId { get; set; }
        public virtual Permission Permission { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public User CreatedByUser { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }
        public User LastUpdatedByUser { get; set; }
    }
}
