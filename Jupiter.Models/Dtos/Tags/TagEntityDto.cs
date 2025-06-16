using Jupiter.Enumerations.Tags;

namespace Jupiter.Models.Dtos.Tags
{
    public record TagDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public bool IsNew => Id == default;
    }

    public record TagEntityDto
    {
        public Guid UserId { get; set; }
        public TagDto Tag { get; set; }
        public TaggableEntityTypeEnum Type { get; set; }
    }
}
