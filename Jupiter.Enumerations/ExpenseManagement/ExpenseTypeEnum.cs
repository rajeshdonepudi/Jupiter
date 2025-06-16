using System.ComponentModel.DataAnnotations;

namespace Jupiter.Enumerations.ExpenseManagement
{
    public enum ExpenseTypeEnum
    {
        [Display(Name = "Miscellaneous")]
        Miscellaneous = 0,
        [Display(Name = "Food")]
        Food,
        [Display(Name = "Transportation")]
        Transportation,
        [Display(Name = "Utilities")]
        Utilities,
        [Display(Name = "Entertainment")]
        Entertainment,
        [Display(Name = "Healthcare")]
        Healthcare,
    }
}
