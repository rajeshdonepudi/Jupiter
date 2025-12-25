using IdenticonSharp.Identicons;
using Jupiter.BLL.Helpers;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.QuestionAndAnswer;
using Jupiter.Models.Entities.QuestionAndAnswer;
using Jupiter.Models.Entities.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Jupiter.BLL.Services
{
    public class QuestionBankService : BaseService, IQuestionBankService
    {
        public QuestionBankService(UserManager<User> userManager, IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration, ITenantProvider tenantProvider,
            IIdenticonProvider identiconProvider) : base(userManager, unitOfWork, httpContextAccessor, configuration, tenantProvider, identiconProvider)
        {
        }

        public async Task<PagedList<QuestionBankListDto>> GetAllQuestionBanksAsync(FilterQuestionBanksDto model, CancellationToken cancellationToken)
        {
            return await _unitOfWork.QuestionBankRepository.GetAllQuestionBanksAsync(model, cancellationToken);
        }

        public async Task<QuestionBankDto> GetQuestionBankAsync(Guid questionBankId, CancellationToken cancellationToken)
        {
             var bank = await _unitOfWork.QuestionBankRepository.GetQuestionBankAsync(questionBankId, cancellationToken);

             if(bank == null)
             {
                 throw new BusinessException(ErrorMessages.SOMETHING_WENT_WRONG);
             }

             return bank;
        }

        public async Task UpsertQuestionBankAsync(QuestionBankDto model, CancellationToken cancellationToken)
        {
            await _unitOfWork.QuestionBankRepository.UpsertQuestionBankAsync(model, USER_ID, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteQuestionBankAsync(Guid questionBankId, CancellationToken cancellationToken)
        {
            var bank = await _unitOfWork.QuestionBankRepository.FindAsync(questionBankId, cancellationToken);
            if (bank != null)
            {
                _unitOfWork.QuestionBankRepository.Remove(bank);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
