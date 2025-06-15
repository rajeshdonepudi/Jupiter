namespace Jupiter.Models.Dtos.Users
{
    public record DeleteUserFromSecurityGroupDto
    {
        public Guid SecurityGroupId { get; set; }
        public string ResourceAlias { get; set; }
    }

    public record AddUsersToSecurityGroupDto
    {
        public Guid SecurityGroupId { get; set; }
        public List<Guid> Users { get; set; }
    }
}
