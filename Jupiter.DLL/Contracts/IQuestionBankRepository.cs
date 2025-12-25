using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.QuestionAndAnswer;
using Jupiter.Models.Entities.QuestionAndAnswer;
using Jupiter.Models.EntityContracts;

namespace Jupiter.DAL.Contracts
{
    public interface IQuestionBankRepository : IGenericRepository<QuestionBank>
    {
        Task<PagedList<QuestionBankListDto>> GetAllQuestionBanksAsync(FilterQuestionBanksDto model, CancellationToken cancellationToken);
        Task<QuestionBankDto> GetQuestionBankAsync(Guid questionBankId, CancellationToken cancellationToken);
        Task UpsertQuestionBankAsync(QuestionBankDto model, Guid userId, CancellationToken cancellationToken);
    }
}
