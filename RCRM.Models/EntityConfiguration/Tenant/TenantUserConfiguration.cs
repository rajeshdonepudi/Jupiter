using Jupiter.Models.Entities.Tenants;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jupiter.Models.EntityConfiguration.Tenant
{
    public class TenantUserConfiguration : IEntityTypeConfiguration<TenantUser>
    {
        public void Configure(EntityTypeBuilder<TenantUser> builder)
        {
            builder.HasKey(tu => tu.Id);

            builder.HasOne(tu => tu.Tenant)
                   .WithMany(t => t.Users)
                   .HasForeignKey(tu => tu.TenantId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(tu => tu.User)
                   .WithMany(u => u.Tenants)
                   .HasForeignKey(tu => tu.UserId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
