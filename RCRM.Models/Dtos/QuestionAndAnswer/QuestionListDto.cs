using Jupiter.Enumerations.QuestionAndAnswer;
using Jupiter.Helpers.Helpers;

namespace Jupiter.Models.Dtos.QuestionAndAnswer
{
    public class QuestionOptionDto
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class FilterQuestionsDto : PageParams
    {

    }

    public class BaseQuestionDto
    {
        public Guid? Id { get; set; }
        public required string Name { get; set; }
        public QuestionTypeEnum Type { get; set; }
        public IEnumerable<QuestionOptionDto>? Options { get; set; }
        public bool IsNew => Id == Guid.Empty || !Id.HasValue;
    }

    public class QuestionListDto : BaseQuestionDto
    {
        public string QuestionTypeName { get; set; }
    }
}
