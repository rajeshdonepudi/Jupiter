using Jupiter.Models.Entities.Tags;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Jupiter.Models.EntityConfiguration.Tags
{
    public class EntityTagEntityTypeConfiguration : IEntityTypeConfiguration<EntityTag>
    {
        public void Configure(EntityTypeBuilder<EntityTag> builder)
        {
            builder.HasOne(x => x.Tag)
                .WithMany(x => x.EntityTags)
                .HasForeignKey(x => x.TagId)
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.CreatedByUser)
                .WithMany(x => x.EntityTagsCreated)
                .HasForeignKey(x => x.CreatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.LastUpdatedByUser)
                .WithMany(x => x.EntityTagsUpdated)
                .HasForeignKey(x => x.LastUpdatedByUserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.DeletedByUser)
               .WithMany(x => x.EntityTagsDeleted)
               .HasForeignKey(x => x.DeletedByUserId)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class TagEntityTypeConfiguration : IEntityTypeConfiguration<Tag>
    {
        public void Configure(EntityTypeBuilder<Tag> builder)
        {
            builder.Property(x => x.NormalizedName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(x => x.Name)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.HasIndex(x => x.NormalizedName)
                   .IsUnique();

            builder.HasMany(x => x.EntityTags)
                   .WithOne(x => x.Tag)
                   .HasForeignKey(x => x.TagId)
                   .IsRequired(true)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(X => X.CreatedByUser)
                   .WithMany(x => x.TagsCreated)
                   .HasForeignKey(x => x.CreatedByUserId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(X => X.LastUpdatedByUser)
                   .WithMany(x => x.TagsUpdated)
                   .HasForeignKey(x => x.LastUpdatedByUserId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(X => X.DeletedByUser)
                   .WithMany(x => x.TagsDeleted)
                   .HasForeignKey(x => x.DeletedByUserId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
