namespace Jupiter.Models.Dtos.Tenants
{
    public record TenantBasicDetailDto
    {
        public required string Image { get; set; }
        public required string Name { get; set; }
        public string AccountAlias { get; set; }
    }

    public class TenantDetailsDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int AccountId { get; set; }
        public string AccountAlias { get; set; }
        public string Host { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ProfilePicture { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DeletedOn { get; set; }
        public long UserCount { get; set; }
        public long ThemesCount { get; set; }
    }
}
