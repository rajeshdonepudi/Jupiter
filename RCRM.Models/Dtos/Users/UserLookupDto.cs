namespace Jupiter.Models.Dtos.Users
{
    public record UserLookupDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string ResourceAlias { get; set; }
        public string ProfilePicture { get; set; }
    }

    public record CallerInfoDto : UserLookupDto
    {
        public string ConnectionId { get; set; }
    }
}
