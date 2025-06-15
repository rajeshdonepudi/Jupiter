using Jupiter.Enumerations.Theme;
using Jupiter.Models.Entities.Base;
using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.Entities.Users;
using Jupiter.Models.EntityContracts;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jupiter.Models.Entities
{
    [Table("Themes")]
    public class AppTheme : BaseEntity, ITrackableEntity, ISoftDeletable, IMultiTenantEntity, ICloneable
    {
        public bool IsPrimary { get; set; }
        public required string PrimaryColor { get; set; }
        public required string SecondaryColor { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedOn { get; set; }
        public string? FontFamily { get; set; }
        public ThemePreferenceEnum ThemePreference { get; set; } = ThemePreferenceEnum.SystemDefault;

        public Guid? TenantId { get; set; }
        public virtual Tenant Tenant { get; set; }
        public User DeletedByUser { get; set; }
        public Guid? DeletedByUserId { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public User CreatedByUser { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }
        public User LastUpdatedByUser { get; set; }

        public object Clone()
        {
            var theme = new AppTheme
            {
                PrimaryColor = PrimaryColor,
                SecondaryColor = SecondaryColor,
                IsPrimary = false,
                IsDeleted = false,
            };

            return theme;
        }
    }
}
