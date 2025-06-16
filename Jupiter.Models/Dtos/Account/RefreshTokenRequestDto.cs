using System.ComponentModel.DataAnnotations;

namespace Jupiter.Models.Dtos.Account
{
    public class RefreshTokenRequestDto
    {
        [Required]
        public required string RefreshToken { get; set; }
    }
}
