using Jupiter.Models.Entities.Base;
using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityConfiguration.QuestionAndAnswer;
using Jupiter.Models.EntityContracts;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jupiter.Models.Entities.QuestionAndAnswer
{
    [EntityTypeConfiguration(typeof(QuestionBankEntityTypeConfiguration))]
    [Table("QuestionBanks")]
    public class QuestionBank : BaseEntity, Jupiter.Models.EntityContracts.IMultiTenantEntity, Jupiter.Models.EntityContracts.ISoftDeletable
    {
        public QuestionBank()
        {
            Questions = new HashSet<QuestionBankQuestion>();
        }

        public string Name { get; set; }
        public string? Description { get; set; }
        
        public Guid? TenantId { get; set; }
        public virtual Tenant Tenant { get; set; }

        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedOn { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }
        public Guid? DeletedByUserId { get; set; }

        public virtual User CreatedByUser { get; set; }
        public virtual User LastUpdatedByUser { get; set; }
        public virtual User DeletedByUser { get; set; }

        public virtual ICollection<QuestionBankQuestion> Questions { get; set; }
    }
}
