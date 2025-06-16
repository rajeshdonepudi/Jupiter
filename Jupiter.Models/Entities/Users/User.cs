using Jupiter.Enumerations.Common;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Entities.Common;
using Jupiter.Models.Entities.Leads;
using Jupiter.Models.Entities.QuestionAndAnswer;
using Jupiter.Models.Entities.Security;
using Jupiter.Models.Entities.Tags;
using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.EntityConfiguration.User;
using Jupiter.Models.EntityContracts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;

namespace Jupiter.Models.Entities.Users
{
    public class UserLoginAttempt
    {
        public Guid Id { get; set; }
        public DateTime LoginAttemptDate { get; set; }
        public bool IsSucessfull { get; set; }

        public Guid UserId { get; set; }
        public virtual User User { get; set; }
    }


    [EntityTypeConfiguration(typeof(UserEntityTypeConfiguration))]
    [Table("Users")]
    public class User : IdentityUser<Guid>, ITrackableEntity, ISoftDeletable, IEquatable<User>, ICloneable
    {
        public User()
        {
            RefreshTokens = new HashSet<RefreshToken>();
            LoginAttempts = new HashSet<UserLoginAttempt>();
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? MiddleName { get; set; }
        public bool IsActive { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ResourceId { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string ResourceAlias { get; private set; }

        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? ProfilePictureId { get; set; }
        public virtual Image? ProfilePicture { get; set; }
        public DateTime DateOfBirth { get; set; }
        public bool PhysicallyChallenged { get; set; }

        public GenderEnum Gender { get; set; } = GenderEnum.NotSpecified;
        public MaritalStatusEnum MaritalStatus { get; set; } = MaritalStatusEnum.NotSpecified;
        public BloodGroupTypeEnum BloodGroup { get; set; } = BloodGroupTypeEnum.NotSpecified;

        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
        public virtual ICollection<Address> Addresses { get; set; }
        public virtual ICollection<TenantUser> Tenants { get; set; }
        public virtual ICollection<UserLoginAttempt> LoginAttempts { get; set; }

        public float DaysUntilLockout { get; set; }
        public DateTime LastLoginDate { get; set; }

        public bool IsDeleted { get; set; }
        public bool IsCloned { get; set; }
        public DateTime DeletedOn { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public Guid? LastUpdatedByUserId { get; set; }
        public Guid? DeletedByUserId { get; set; }

        #region Question
        public virtual ICollection<Question> CreatedQuestions { get; set; }
        public virtual ICollection<Question> UpdatedQuestions { get; set; }
        public virtual ICollection<Question> DeletedQuestions { get; set; }

        public virtual ICollection<QuestionOption> CreatedOptions { get; set; }
        public virtual ICollection<QuestionOption> UpdatedOptions { get; set; }
        public virtual ICollection<QuestionOption> DeletedOptions { get; set; }

        public virtual ICollection<Answer> SubmittedAnswers { get; set; }
        public virtual ICollection<Answer> UpdatedAnswers { get; set; }
        public virtual ICollection<Answer> DeletedAnswers { get; set; }
        #endregion

        public virtual ICollection<User> CreatedUsers { get; set; }
        public virtual ICollection<User> UpdatedUsers { get; set; }
        public virtual ICollection<User> DeletedUsers { get; set; }

        public virtual ICollection<Address> CreatedAddressess { get; set; }
        public virtual ICollection<Address> UpdatedAddressess { get; set; }
        public virtual ICollection<Address> DeletedAddressess { get; set; }

        public virtual ICollection<Country> CreatedCountries { get; set; }
        public virtual ICollection<Country> UpdatedCountries { get; set; }
        public virtual ICollection<Country> DeletedCountries { get; set; }

        public virtual ICollection<SecurityGroup> CreatedSecurityGroups { get; set; }
        public virtual ICollection<SecurityGroup> UpdatedSecurityGroups { get; set; }
        public virtual ICollection<SecurityGroup> DeletedSecurityGroups { get; set; }


        public virtual ICollection<Setting> CreatedSettings { get; set; }
        public virtual ICollection<Setting> UpdatedSettings { get; set; }
        public virtual ICollection<Setting> DeletedSettings { get; set; }

        public virtual ICollection<Tenant> CreatedTenants { get; set; }
        public virtual ICollection<Tenant> UpdatedTenants { get; set; }
        public virtual ICollection<Tenant> DeletedTenants { get; set; }

        public virtual ICollection<Lead> CreatedLeads { get; set; }
        public virtual ICollection<Lead> UpdatedLeads { get; set; }
        public virtual ICollection<Lead> DeletedLeads { get; set; }

        public virtual ICollection<LeadStatus> CreatedLeadStatuses { get; set; }
        public virtual ICollection<LeadStatus> UpdatedLeadStatuses { get; set; }
        public virtual ICollection<LeadStatus> DeletedLeadStatuses { get; set; }

        #region Tags
        public virtual ICollection<Tag> TagsCreated { get; set; }
        public virtual ICollection<Tag> TagsUpdated { get; set; }
        public virtual ICollection<Tag> TagsDeleted { get; set; }
        public virtual ICollection<EntityTag> AssociatedTags { get; set; }
        public virtual ICollection<EntityTag> EntityTagsUpdated { get; set; }
        public virtual ICollection<EntityTag> EntityTagsCreated { get; set; }
        public virtual ICollection<EntityTag> EntityTagsDeleted { get; set; }
        #endregion


        public virtual User CreatedByUser { get; set; }
        public virtual User LastUpdatedByUser { get; set; }
        public virtual User DeletedByUser { get; set; }

        public object Clone()
        {
            var user = new User();

            user.FirstName = FirstName;
            user.LastName = LastName;
            user.MiddleName = MiddleName;
            user.ProfilePicture = ProfilePicture;
            user.DateOfBirth = DateOfBirth;
            user.PhysicallyChallenged = PhysicallyChallenged;
            user.Gender = Gender;
            user.MaritalStatus = MaritalStatus;
            user.IsDeleted = IsDeleted;
            user.BloodGroup = BloodGroup;
            user.IsDeleted = IsDeleted;
            user.IsActive = IsActive;
            user.Tenants = Tenants;
            user.IsCloned = true;
            user.Email = CloneHelper.GetCloneEmail(Email);

            return user;
        }

        public bool Equals(User? other)
        {
            if (ReferenceEquals(other, null))
            {
                return false;
            }

            if (ReferenceEquals(this, other))
            {
                return true;
            }

            return Id == other.Id && Id == other.Id;
        }

        public override bool Equals(object obj)
        {
            if (obj is Point other)
            {
                return Equals(other);
            }

            return false;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                int hash = 17;
                hash = hash * 23 + Id.GetHashCode();
                return hash;
            }
        }
    }
}
