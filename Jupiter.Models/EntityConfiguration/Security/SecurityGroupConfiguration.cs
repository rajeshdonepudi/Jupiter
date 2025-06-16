using Jupiter.Models.Entities.Security;
using Jupiter.Models.Entities.Tenants;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jupiter.Models.EntityConfiguration.Security
{
    public class SettingEntityTypeConfiguration : IEntityTypeConfiguration<Setting>
    {
        public void Configure(EntityTypeBuilder<Setting> builder)
        {
            builder.HasOne(x => x.CreatedByUser)
                .WithMany(x => x.CreatedSettings)
                .HasForeignKey(x => x.CreatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.LastUpdatedByUser)
                .WithMany(x => x.UpdatedSettings)
                .HasForeignKey(x => x.LastUpdatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.DeletedByUser)
                .WithMany(x => x.DeletedSettings)
                .HasForeignKey(x => x.DeletedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class SecurityGroupConfiguration : IEntityTypeConfiguration<SecurityGroup>
    {
        public void Configure(EntityTypeBuilder<SecurityGroup> builder)
        {
            builder.HasOne(sg => sg.Tenant)
                   .WithMany(tsg => tsg.SecurityGroups)
                   .HasForeignKey(tsg => tsg.TenantId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(sg => sg.AssociatedPermissions)
                   .WithOne(sgp => sgp.SecurityGroup)
                   .HasForeignKey(sgp => sgp.SecurityGroupId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.CreatedByUser)
                .WithMany(x => x.CreatedSecurityGroups)
                .HasForeignKey(x => x.CreatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.LastUpdatedByUser)
                .WithMany(x => x.UpdatedSecurityGroups)
                .HasForeignKey(x => x.LastUpdatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.DeletedByUser)
                .WithMany(x => x.DeletedSecurityGroups)
                .HasForeignKey(x => x.DeletedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
