using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jupiter.Models.EntityConfiguration.Tenant
{
    public class TenantConfiguration : IEntityTypeConfiguration<Entities.Tenants.Tenant>
    {
        public void Configure(EntityTypeBuilder<Entities.Tenants.Tenant> builder)
        {
            builder.HasMany(x => x.Leads)
                .WithOne(x => x.Tenant)
                .HasForeignKey(x => x.TenantId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.LeadStatuses)
                .WithOne(x => x.Tenant)
                .HasForeignKey(x => x.TenantId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.Users)
                   .WithOne(y => y.Tenant)
                   .HasForeignKey(x => x.TenantId)
                   .IsRequired(true)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.Permissions)
                   .WithOne(y => y.Tenant)
                   .HasForeignKey(x => x.TenantId)
                   .IsRequired(true)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.SecurityGroups)
                   .WithOne(y => y.Tenant)
                   .HasForeignKey(x => x.TenantId)
                   .IsRequired(true)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.CreatedByUser)
                .WithMany(x => x.CreatedTenants)
                .HasForeignKey(x => x.CreatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.LastUpdatedByUser)
                .WithMany(x => x.UpdatedTenants)
                .HasForeignKey(x => x.LastUpdatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.DeletedByUser)
                .WithMany(x => x.DeletedTenants)
                .HasForeignKey(x => x.DeletedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
