using Jupiter.Enumerations.QuestionAndAnswer;
using Jupiter.Models.Entities.Base;
using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityConfiguration.QuestionAndAnswer;
using Jupiter.Models.EntityConfiguration.User;
using Jupiter.Models.EntityContracts;
using Microsoft.EntityFrameworkCore;

namespace Jupiter.Models.Entities.QuestionAndAnswer
{
    [EntityTypeConfiguration(typeof(QuestionOptionDropdownAnswerEntityTypeConfiguration))]
    public class QuestionOptionDropdownAnswer
    {
        public Guid AnswerId { get; set; }
        public virtual DropdownAnswer Answer { get; set; }

        public Guid OptionId { get; set; }
        public virtual QuestionOption Option { get; set; }
    }

    [EntityTypeConfiguration(typeof(DropdownAnswerEntityTypeConfiguration))]
    public class DropdownAnswer : Answer
    {
        public DropdownAnswer()
        {
            SelectedOptions = new HashSet<QuestionOptionDropdownAnswer>();
        }

        public virtual ICollection<QuestionOptionDropdownAnswer> SelectedOptions { get; set; }
    }

    [EntityTypeConfiguration(typeof(TextAnswerEntityTypeConfiguration))]
    public class TextAnswer : Answer
    {
        public required string Value { get; set; }
    }

    [EntityTypeConfiguration(typeof(BooleanAnswerEntityTypeConfiguration))]
    public class BooleanAnswer : Answer
    {
        public bool Value { get; set; }
    }

    [EntityTypeConfiguration(typeof(AnswerEntityTypeConfiguration))]
    public abstract class Answer : BaseEntity, ITrackableEntity, ISoftDeletable
    {
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedOn { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }
        public Guid? DeletedByUserId { get; set; }

        public Guid QuestionId { get; set; }

        public virtual Question Question { get; set; }
        public virtual User DeletedByUser { get; set; }
        public virtual User LastUpdatedByUser { get; set; }
        public virtual User CreatedByUser { get; set; }
    }

    [EntityTypeConfiguration(typeof(QuestionOptionEntityTypeConfiguration))]
    public class QuestionOption : BaseEntity, ITrackableEntity, ISoftDeletable
    {
        public QuestionOption()
        {
            AssociatedAnswers = new HashSet<QuestionOptionDropdownAnswer>();
        }

        public Guid QuestionId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public Guid? AnswerId { get; set; }
        public virtual Answer Answer { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedOn { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }
        public Guid? DeletedByUserId { get; set; }

        public virtual Question Question { get; set; }

        public virtual User CreatedByUser { get; set; }
        public virtual User LastUpdatedByUser { get; set; }
        public virtual User DeletedByUser { get; set; }

        public virtual ICollection<QuestionOptionDropdownAnswer> AssociatedAnswers { get; set; }
    }

    [EntityTypeConfiguration(typeof(QuestionEntityTypeConfiguration))]
    public class Question : BaseEntity, IMultiTenantEntity, ISoftDeletable
    {
        public Question()
        {
            Options = new HashSet<QuestionOption>();
        }

        public required string Name { get; set; }
        public QuestionTypeEnum Type { get; set; }
        public Guid? TenantId { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedOn { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public Guid? DeletedByUserId { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }

        public virtual Tenant Tenant { get; set; }
        public virtual User CreatedByUser { get; set; }
        public virtual User LastUpdatedByUser { get; set; }
        public virtual User DeletedByUser { get; set; }
        public virtual ICollection<QuestionOption> Options { get; set; }
        public virtual ICollection<Answer> Answers { get; set; }
    }
}
