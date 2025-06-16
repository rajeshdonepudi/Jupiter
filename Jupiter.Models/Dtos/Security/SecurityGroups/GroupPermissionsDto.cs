namespace Jupiter.Models.Dtos.Security.SecurityGroups
{
    public record GroupPermissionsDto
    {
        public string Name { get; set; }
        public List<string> Permissions { get; set; }
    }
}
