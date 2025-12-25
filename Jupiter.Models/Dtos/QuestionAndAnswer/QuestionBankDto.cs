using Jupiter.Helpers.Helpers;

namespace Jupiter.Models.Dtos.QuestionAndAnswer
{
    public class BaseQuestionBankDto
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public bool IsNew => Id == Guid.Empty || !Id.HasValue;
    }

    public class QuestionBankDto : BaseQuestionBankDto
    {
        public List<QuestionBankQuestionDto> Questions { get; set; }
    }

    public class QuestionBankQuestionDto
    {
        public Guid QuestionId { get; set; }
        public string QuestionName { get; set; }
        public int Order { get; set; }
    }

    public class QuestionBankListDto : BaseQuestionBankDto
    {
        public int QuestionCount { get; set; }
    }

    public class FilterQuestionBanksDto : PageParams
    {
        public string? SearchTerm { get; set; }
    }
}
