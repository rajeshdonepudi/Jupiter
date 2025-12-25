using Jupiter.Models.Entities.Base;
using Jupiter.Models.EntityConfiguration.QuestionAndAnswer;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jupiter.Models.Entities.QuestionAndAnswer
{
    [EntityTypeConfiguration(typeof(QuestionBankQuestionEntityTypeConfiguration))]
    [Table("QuestionBankQuestions")]
    public class QuestionBankQuestion
    {
        public Guid QuestionBankId { get; set; }
        public virtual QuestionBank QuestionBank { get; set; }

        public Guid QuestionId { get; set; }
        public virtual Question Question { get; set; }

        public int Order { get; set; }
    }
}
