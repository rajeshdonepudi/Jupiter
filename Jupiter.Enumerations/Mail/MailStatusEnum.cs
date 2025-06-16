using System.ComponentModel.DataAnnotations;

namespace Jupiter.Enumerations.Mail
{
    public enum MailStatusEnum
    {
        [Display(Name = "Draft")]
        Draft = 1,

        [Display(Name = "Sent")]
        Sent,

        [Display(Name = "Received")]
        Received,

        [Display(Name = "Read")]
        Read,

        [Display(Name = "Archived")]
        Archived
    }
}
