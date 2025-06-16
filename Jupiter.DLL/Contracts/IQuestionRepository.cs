using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.QuestionAndAnswer;
using Jupiter.Models.Entities.QuestionAndAnswer;
using Jupiter.Models.EntityContracts;

namespace Jupiter.DAL.Contracts
{
    public interface IQuestionRepository : IGenericRepository<Question>
    {
        Task<PagedList<QuestionListDto>> GetAllQuestionsAsync(FilterQuestionsDto model, CancellationToken cancellationToken);
    }
}
