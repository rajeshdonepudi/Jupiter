namespace Jupiter.Models.Dtos.Security.SecurityGroups
{
    public record UpdateSecurityGroupDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
