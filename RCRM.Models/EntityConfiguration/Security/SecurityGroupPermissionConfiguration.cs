using Jupiter.Models.Entities.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jupiter.Models.EntityConfiguration.Security
{
    public class SecurityGroupPermissionConfiguration : IEntityTypeConfiguration<SecurityGroupPermission>
    {
        public void Configure(EntityTypeBuilder<SecurityGroupPermission> builder)
        {
            builder.HasKey(y => new { y.PermissionId, y.SecurityGroupId });

            builder.HasOne(x => x.Permission)
                   .WithMany(y => y.AssociatedGroups)
                   .HasForeignKey(f => f.PermissionId)
                   .IsRequired(true);

            builder.HasOne(x => x.SecurityGroup)
                   .WithMany(y => y.AssociatedPermissions)
                   .HasForeignKey(f => f.SecurityGroupId)
                   .IsRequired(true);

        }
    }
}
