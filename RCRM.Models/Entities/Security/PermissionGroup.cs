using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jupiter.Models.Entities.Security
{
    [Table("PermissionGroups")]
    public class PermissionGroup
    {
        public PermissionGroup()
        {
            Permissions = new HashSet<Permission>();
        }

        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public virtual ICollection<Permission> Permissions { get; set; }
    }
}
