using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.QuestionAndAnswer;

namespace Jupiter.BLL.Interfaces
{
    public interface IQuestionService
    {
        Task DeleteQuestionAsync(Guid questionId, CancellationToken cancellationToken);
        Task<PagedList<QuestionListDto>> GetAllQuestions(FilterQuestionsDto model, CancellationToken cancellationToken);
        Task UpsertQuestionAsync(BaseQuestionDto model, CancellationToken cancellationToken);
    }
}
