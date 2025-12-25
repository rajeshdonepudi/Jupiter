using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.QuestionAndAnswer;

namespace Jupiter.BLL.Interfaces
{
    public interface IQuestionBankService
    {
        Task DeleteQuestionBankAsync(Guid questionBankId, CancellationToken cancellationToken);
        Task<PagedList<QuestionBankListDto>> GetAllQuestionBanksAsync(FilterQuestionBanksDto model, CancellationToken cancellationToken);
        Task<QuestionBankDto> GetQuestionBankAsync(Guid questionBankId, CancellationToken cancellationToken);
        Task UpsertQuestionBankAsync(QuestionBankDto model, CancellationToken cancellationToken);
    }
}
