using Jupiter.Enumerations.Theme;
using System.ComponentModel.DataAnnotations;

namespace Jupiter.Models.Dtos.Theme
{
    public record UpsertSiteThemeDto
    {
        public Guid? Id { get; set; }
        public bool IsPrimary { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Primary color is required.")]
        public required string PrimaryColor { get; set; }

        [Required(AllowEmptyStrings = false, ErrorMessage = "Secondary color is required.")]
        public required string SecondaryColor { get; set; }
        public string? FontFamily { get; set; }
        public ThemePreferenceEnum ThemePreference { get; set; }
    }
}
