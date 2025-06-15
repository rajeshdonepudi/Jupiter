using Jupiter.Models.Entities.Base;
using Jupiter.Models.Entities.Security;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityConfiguration.Tenant;
using Jupiter.Models.EntityContracts;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jupiter.Models.Entities.Tenants
{
    [EntityTypeConfiguration(typeof(TenantUserConfiguration))]
    [Table("TenantUsers")]
    public class TenantUser : BaseEntity, ISoftDeletable
    {
        public TenantUser()
        {
        }

        public Guid TenantId { get; set; }

        public Guid UserId { get; set; }

        public DateTime DeletedOn { get; set; }

        public bool IsDeleted { get; set; }

        #region Navigation Properties
        public virtual Tenant Tenant { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<TenantUserSecurityGroup> TenantUserSecurityGroups { get; set; }
        public virtual User DeletedByUser { get; set; }
        public Guid? DeletedByUserId { get; set; }
        #endregion
    }
}
