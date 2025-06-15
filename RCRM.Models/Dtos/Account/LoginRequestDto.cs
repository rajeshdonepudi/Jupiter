﻿using System.ComponentModel.DataAnnotations;

namespace Jupiter.Models.Dtos.Account
{
    public record LoginRequestDto
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Email is required.")]
        [EmailAddress]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [DataType(DataType.Password)]
        public required string Password { get; set; }
    }
}
