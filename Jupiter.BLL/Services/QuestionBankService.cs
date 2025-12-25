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
             var bank = await _unitOfWork.QuestionBankRepository.GetAll().AsNoTracking()
                .Include(x => x.Questions)
                .ThenInclude(x => x.Question)
                .FirstOrDefaultAsync(x => x.Id == questionBankId, cancellationToken);

             if(bank == null)
             {
                 throw new BusinessException(ErrorMessages.RECORD_NOT_FOUND);
             }

             return new QuestionBankDto
             {
                 Id = bank.Id,
                 Name = bank.Name,
                 Description = bank.Description,
                 Questions = bank.Questions.OrderBy(x => x.Order).Select(x => new QuestionBankQuestionDto
                 {
                     QuestionId = x.QuestionId,
                     QuestionName = x.Question.Name,
                     Order = x.Order
                 }).ToList()
             };
        }

        public async Task UpsertQuestionBankAsync(QuestionBankDto model, CancellationToken cancellationToken)
        {
            if (model.IsNew)
            {
                var newBank = new QuestionBank
                {
                    Name = model.Name,
                    Description = model.Description,
                    CreatedOn = DateTime.UtcNow,
                    CreatedByUserId = USER_ID,
                    Questions = model.Questions?.Select((q, index) => new QuestionBankQuestion
                    {
                        QuestionId = q.QuestionId,
                        Order = index
                    }).ToList() ?? new List<QuestionBankQuestion>()
                };

                await _unitOfWork.QuestionBankRepository.AddAsync(newBank, cancellationToken);
            }
            else
            {
                var bank = await _unitOfWork.QuestionBankRepository.GetAll()
                    .Include(x => x.Questions)
                    .FirstOrDefaultAsync(x => x.Id == model.Id, cancellationToken);

                if (bank == null)
                {
                    throw new BusinessException(ErrorMessages.RECORD_NOT_FOUND);
                }

                bank.Name = model.Name;
                bank.Description = model.Description;
                bank.ModifiedOn = DateTime.UtcNow;
                bank.LastUpdatedByUserId = USER_ID;

                // Update questions
                bank.Questions.Clear();
                if (model.Questions != null)
                {
                    foreach (var (q, index) in model.Questions.Select((v, i) => (v, i)))
                    {
                        bank.Questions.Add(new QuestionBankQuestion
                        {
                            QuestionBankId = bank.Id,
                            QuestionId = q.QuestionId,
                            Order = index
                        });
                    }
                }
            }

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
