namespace Jupiter.Models.Dtos.Security.Roles
{
    public record AddUserToRoleDto
    {
        public List<Guid> Users { get; set; }
        public Guid RoleId { get; set; }
    }

    public record RemoveUserFromRoleDto
    {
        public Guid RoleId { get; set; }
        public Guid UserId { get; set; }
    }
}
