using Jupiter.Models.Entities.QuestionAndAnswer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jupiter.Models.EntityConfiguration.QuestionAndAnswer
{
    public class QuestionBankEntityTypeConfiguration : IEntityTypeConfiguration<QuestionBank>
    {
        public void Configure(EntityTypeBuilder<QuestionBank> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name).IsRequired().HasMaxLength(250);
            builder.Property(x => x.Description).HasMaxLength(1000);

            builder.HasOne(x => x.Tenant)
                   .WithMany()
                   .HasForeignKey(x => x.TenantId)
                   .OnDelete(DeleteBehavior.Cascade);
                   
            builder.HasOne(x => x.CreatedByUser)
                   .WithMany()
                   .HasForeignKey(x => x.CreatedByUserId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.LastUpdatedByUser)
                   .WithMany()
                   .HasForeignKey(x => x.LastUpdatedByUserId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.DeletedByUser)
                   .WithMany()
                   .HasForeignKey(x => x.DeletedByUserId)
                   .OnDelete(DeleteBehavior.Restrict);
            
            builder.HasIndex(x => x.TenantId);
        }
    }
}
