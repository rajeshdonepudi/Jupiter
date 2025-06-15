using System.ComponentModel.DataAnnotations;

namespace Jupiter.Enumerations.Security
{
    public enum PermissionActionEnum
    {
        [Display(Name = "None")]
        None = 0,
        [Display(Name = "Assign")]
        Assign = 1,
        [Display(Name = "Unassign")]
        Unassign = 2
    }
}
