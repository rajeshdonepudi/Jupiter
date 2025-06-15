using Jupiter.Models.Entities.Security;
using Jupiter.Models.EntityConfiguration.Security;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jupiter.Models.Entities.Tenants
{
    [EntityTypeConfiguration(typeof(TenantPermissionConfiguration))]
    [Table("TenantPermissions")]
    public class TenantPermission
    {
        public Guid TenantId { get; set; }
        public virtual Tenant Tenant { get; set; }

        public Guid PermissionId { get; set; }
        public virtual Permission Permission { get; set; }
    }
}
