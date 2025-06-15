using System.ComponentModel.DataAnnotations;

namespace Jupiter.Enumerations.QuestionAndAnswer
{
    public enum QuestionTypeEnum
    {
        [Display(Name = "Textbox")]
        TextBox = 1,

        [Display(Name = "Checkbox")]
        Checkbox = 2,

        [Display(Name = "Single select")]
        SingleSelectDropdown = 3,

        [Display(Name = "Multi select")]
        MultiSelectDropdown = 4,
        [Display(Name = "Document")]
        Document = 5,

        [Display(Name = "Textarea")]
        TextArea = 6,

        [Display(Name = "Radio Group")]
        RadioGroup = 7,

        [Display(Name = "Checkbox List")]
        CheckboxList = 8
    }
}
