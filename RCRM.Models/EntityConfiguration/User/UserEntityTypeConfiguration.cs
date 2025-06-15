using Jupiter.Models.Entities.Common;
using Jupiter.Models.Entities.QuestionAndAnswer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jupiter.Models.EntityConfiguration.User
{
    public class CountryEntityTypeConfiguration : IEntityTypeConfiguration<Country>
    {
        public void Configure(EntityTypeBuilder<Country> builder)
        {
            builder.HasOne(x => x.CreatedByUser)
                .WithMany(x => x.CreatedCountries)
                .HasForeignKey(x => x.CreatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.LastUpdatedByUser)
                .WithMany(x => x.UpdatedCountries)
                .HasForeignKey(x => x.LastUpdatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.DeletedByUser)
                .WithMany(x => x.DeletedCountries)
                .HasForeignKey(x => x.DeletedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
    public class AddressEntityTypeConfiguration : IEntityTypeConfiguration<Address>
    {
        public void Configure(EntityTypeBuilder<Address> builder)
        {
            builder.HasOne(x => x.User)
                .WithMany(x => x.Addresses)
                .HasForeignKey(x => x.UserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Country)
                .WithMany(x => x.Addresses)
                .HasForeignKey(x => x.CountryId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.CreatedByUser)
                .WithMany(x => x.CreatedAddressess)
                .HasForeignKey(x => x.CreatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.LastUpdatedByUser)
               .WithMany(x => x.UpdatedAddressess)
               .HasForeignKey(x => x.LastUpdatedByUserId)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.DeletedByUser)
               .WithMany(x => x.DeletedAddressess)
               .HasForeignKey(x => x.DeletedByUserId)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class QuestionOptionDropdownAnswerEntityTypeConfiguration : IEntityTypeConfiguration<QuestionOptionDropdownAnswer>
    {
        public void Configure(EntityTypeBuilder<QuestionOptionDropdownAnswer> builder)
        {
            builder.HasKey(y => new { y.AnswerId, y.OptionId });

            builder.HasOne(x => x.Answer)
                .WithMany(y => y.SelectedOptions)
                .HasForeignKey(x => x.AnswerId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Option)
                .WithMany(x => x.AssociatedAnswers)
                .HasForeignKey(x => x.OptionId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class DropdownAnswerEntityTypeConfiguration : IEntityTypeConfiguration<DropdownAnswer>
    {
        public void Configure(EntityTypeBuilder<DropdownAnswer> builder)
        {
            builder.HasMany(x => x.SelectedOptions)
                .WithOne(x => x.Answer)
                .HasForeignKey(x => x.AnswerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class TextAnswerEntityTypeConfiguration : IEntityTypeConfiguration<TextAnswer>
    {
        public void Configure(EntityTypeBuilder<TextAnswer> builder)
        {
        }
    }

    public class BooleanAnswerEntityTypeConfiguration : IEntityTypeConfiguration<BooleanAnswer>
    {
        public void Configure(EntityTypeBuilder<BooleanAnswer> builder)
        {
        }
    }

    public class AnswerEntityTypeConfiguration : IEntityTypeConfiguration<Answer>
    {
        public void Configure(EntityTypeBuilder<Answer> builder)
        {
            builder.HasOne(x => x.Question)
                   .WithMany(x => x.Answers)
                   .HasForeignKey(x => x.QuestionId)
                   .IsRequired(true)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasDiscriminator<string>("AnswerType")
                   .HasValue<BooleanAnswer>("Boolean")
                   .HasValue<TextAnswer>("Text")
                   .HasValue<DropdownAnswer>("Dropdown");

            builder.HasOne(x => x.CreatedByUser)
                .WithMany(y => y.SubmittedAnswers)
                .HasForeignKey(x => x.CreatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.LastUpdatedByUser)
                .WithMany(y => y.UpdatedAnswers)
                .HasForeignKey(x => x.LastUpdatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.DeletedByUser)
                .WithMany(x => x.DeletedAnswers)
                .HasForeignKey(x => x.DeletedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }


    public class UserEntityTypeConfiguration : IEntityTypeConfiguration<Entities.Users.User>
    {
        public void Configure(EntityTypeBuilder<Entities.Users.User> builder)
        {
            builder.HasIndex(u => u.CreatedOn);

            builder.HasMany(u => u.RefreshTokens)
                   .WithOne(rt => rt.User)
                   .HasForeignKey(rt => rt.UserId);

            builder.HasMany(u => u.Addresses).WithOne(a => a.User).HasForeignKey(a => a.UserId).IsRequired(false);
            builder.HasMany(u => u.Tenants).WithOne(tu => tu.User).HasForeignKey(tu => tu.UserId);
            builder.HasOne(u => u.ProfilePicture).WithMany().HasForeignKey(u => u.ProfilePictureId).IsRequired(false);

            builder.HasOne(x => x.CreatedByUser)
                .WithMany(x => x.CreatedUsers)
                .HasForeignKey(x => x.CreatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.AssociatedTags)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.LastUpdatedByUser)
               .WithMany(x => x.UpdatedUsers)
               .HasForeignKey(x => x.LastUpdatedByUserId)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.DeletedByUser)
               .WithMany(x => x.DeletedUsers)
               .HasForeignKey(x => x.DeletedByUserId)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.CreatedByUser)
               .WithMany(x => x.CreatedUsers)
               .HasForeignKey(x => x.CreatedByUserId)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.Restrict);

            // Questions
            builder.HasMany(u => u.CreatedQuestions)
                   .WithOne(x => x.CreatedByUser)
                   .HasForeignKey(x => x.CreatedByUserId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.UpdatedQuestions)
                   .WithOne(x => x.LastUpdatedByUser)
                   .HasForeignKey(x => x.LastUpdatedByUserId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.DeletedQuestions)
                   .WithOne(x => x.DeletedByUser)
                   .HasForeignKey(x => x.DeletedByUserId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);

            // Options
            builder.HasMany(u => u.CreatedOptions)
                   .WithOne(x => x.CreatedByUser)
                   .HasForeignKey(x => x.CreatedByUserId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.UpdatedOptions)
                   .WithOne(x => x.LastUpdatedByUser)
                   .HasForeignKey(x => x.LastUpdatedByUserId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.DeletedOptions)
                   .WithOne(x => x.DeletedByUser)
                   .HasForeignKey(x => x.DeletedByUserId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);



            builder.HasMany(x => x.CreatedLeads)
                .WithOne(x => x.CreatedByUser)
                .HasForeignKey(x => x.CreatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.UpdatedLeads)
                .WithOne(x => x.LastUpdatedByUser)
                .HasForeignKey(x => x.LastUpdatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.DeletedLeads)
                .WithOne(x => x.DeletedByUser)
                .HasForeignKey(x => x.DeletedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);


            builder.HasMany(x => x.CreatedLeadStatuses)
                .WithOne(x => x.CreatedByUser)
                .HasForeignKey(x => x.CreatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.UpdatedLeadStatuses)
                .WithOne(x => x.LastUpdatedByUser)
                .HasForeignKey(x => x.LastUpdatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(x => x.DeletedLeadStatuses)
                .WithOne(x => x.DeletedByUser)
                .HasForeignKey(x => x.DeletedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
