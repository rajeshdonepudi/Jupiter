using System.ComponentModel.DataAnnotations;

namespace Jupiter.Enumerations.Common
{
    public enum MaritalStatusEnum
    {
        [Display(Name = "N/A")]
        NotSpecified,
        Single,
        Married,
        Divorced,
        Widowed,
        Separated
    }
}
