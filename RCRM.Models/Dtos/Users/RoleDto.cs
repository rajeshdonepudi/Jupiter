using System.ComponentModel.DataAnnotations;

namespace Jupiter.Models.Dtos.Users
{
    public class RoleDto
    {
        [Required]
        public required string Name { get; set; }
    }
}
