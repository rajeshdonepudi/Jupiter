using System.ComponentModel.DataAnnotations;

namespace Jupiter.Enumerations.Settings
{
    public enum SettingTypeEnum
    {
        [Display(Name = "Predefined")]
        Predefined = 1,

        [Display(Name = "Custom")]
        Custom = 2
    }
}
