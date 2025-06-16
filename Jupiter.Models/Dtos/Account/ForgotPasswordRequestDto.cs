using System.ComponentModel.DataAnnotations;

namespace Jupiter.Models.Dtos.Account
{
    public record ForgotPasswordRequestDto
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Email is required.")]
        [EmailAddress]
        public required string Email { get; set; }
    }
}
