using Jupiter.Models.Entities.QuestionAndAnswer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jupiter.Models.EntityConfiguration.QuestionAndAnswer
{
    public class QuestionOptionEntityTypeConfiguration : IEntityTypeConfiguration<QuestionOption>
    {
        public void Configure(EntityTypeBuilder<QuestionOption> builder)
        {
            builder.HasOne(x => x.CreatedByUser)
                .WithMany(x => x.CreatedOptions)
                .HasForeignKey(x => x.CreatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.LastUpdatedByUser)
                .WithMany(x => x.UpdatedOptions)
                .HasForeignKey(x => x.LastUpdatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.DeletedByUser)
                .WithMany(x => x.DeletedOptions)
                .HasForeignKey(x => x.DeletedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.AssociatedAnswers)
                .WithOne(x => x.Option)
                .HasForeignKey(x => x.OptionId)
                .IsRequired()
                .OnDelete(deleteBehavior: DeleteBehavior.Restrict);
        }
    }

    public class QuestionEntityTypeConfiguration : IEntityTypeConfiguration<Question>
    {
        public void Configure(EntityTypeBuilder<Question> builder)
        {
            builder.HasOne(x => x.CreatedByUser)
                   .WithMany(x => x.CreatedQuestions)
                   .HasForeignKey(x => x.CreatedByUserId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.LastUpdatedByUser)
                   .WithMany(x => x.UpdatedQuestions)
                   .HasForeignKey(x => x.LastUpdatedByUserId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.DeletedByUser)
                   .WithMany(x => x.DeletedQuestions)
                   .HasForeignKey(x => x.DeletedByUserId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
