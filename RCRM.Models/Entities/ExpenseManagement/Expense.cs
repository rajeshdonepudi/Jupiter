using Jupiter.Enumerations.ExpenseManagement;
using Jupiter.Models.Entities.Base;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityContracts;

namespace Jupiter.Models.Entities.ExpenseManagement
{
    public class Expense : BaseEntity, ITrackableEntity, ISoftDeletable
    {
        public decimal Amount { get; set; }
        public required string Description { get; set; }
        public ExpenseTypeEnum Type { get; set; } = ExpenseTypeEnum.Miscellaneous;

        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }

        public Guid CategoryId { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedOn { get; set; }
        public Guid? DeletedByUserId { get; set; }

        public virtual User LastUpdatedByUser { get; set; }
        public virtual User CreatedByUser { get; set; }
        public virtual User DeletedByUser { get; set; }
        public virtual ExpenseCategory Category { get; set; }
    }
}
