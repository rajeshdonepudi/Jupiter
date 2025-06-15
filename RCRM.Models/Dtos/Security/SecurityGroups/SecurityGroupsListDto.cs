namespace Jupiter.Models.Dtos.Security.SecurityGroups
{
    public record SecurityGroupsListDto
    {
        public Guid Id { get; set; }
        public long UsersInGroup { get; set; }
        public string Name { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
