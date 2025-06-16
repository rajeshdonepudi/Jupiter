using System.ComponentModel.DataAnnotations;

namespace Jupiter.Models.Dtos.Account
{
    public class RevokeRefreshTokenRequestDto
    {
        [Required]
        public required string RefreshToken { get; set; }
    }
}
