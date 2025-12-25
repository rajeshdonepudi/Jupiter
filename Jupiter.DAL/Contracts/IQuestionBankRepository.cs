using Jupiter.Models.Dtos.QuestionAndAnswer;
using Jupiter.Models.Entities.QuestionAndAnswer;

namespace Jupiter.DAL.Contracts
{
    public interface IQuestionBankRepository : IGenericRepository<QuestionBank>
    {
        Task<PagedList<QuestionBankListDto>> GetAllQuestionBanksAsync(FilterQuestionBanksDto model, CancellationToken cancellationToken);
    }
}
