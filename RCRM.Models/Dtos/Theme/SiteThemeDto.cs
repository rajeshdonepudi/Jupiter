using Jupiter.Enumerations.Theme;

namespace Jupiter.Models.Dtos.Theme
{
    public record SiteThemeDto
    {
        public Guid Id { get; set; }
        public bool IsPrimary { get; set; }
        public string PrimaryColor { get; set; }
        public string SecondaryColor { get; set; }
        public string FontFamily { get; set; }
        public ThemePreferenceEnum ThemePreference { get; set; }
    }
}
