using Jupiter.Models.Entities.QuestionAndAnswer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jupiter.Models.EntityConfiguration.QuestionAndAnswer
{
    public class QuestionBankQuestionEntityTypeConfiguration : IEntityTypeConfiguration<QuestionBankQuestion>
    {
        public void Configure(EntityTypeBuilder<QuestionBankQuestion> builder)
        {
            builder.ToTable("QuestionBankQuestions");

            builder.HasKey(x => new { x.QuestionBankId, x.QuestionId });

            builder.HasOne(x => x.QuestionBank)
                   .WithMany(x => x.Questions)
                   .HasForeignKey(x => x.QuestionBankId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Question)
                   .WithMany()
                   .HasForeignKey(x => x.QuestionId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
