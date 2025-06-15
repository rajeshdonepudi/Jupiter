namespace Jupiter.Models.Dtos.Security.Roles
{
    public record SecurityRoleDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? NormalizedName { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public long UsersInRole { get; set; }
    }
}
