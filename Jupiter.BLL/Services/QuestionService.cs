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
using Microsoft.Extensions.Configuration;

namespace Jupiter.BLL.Services
{
    public class QuestionService : BaseService, IQuestionService
    {
        public QuestionService(UserManager<User> userManager, IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration, ITenantProvider tenantProvider,
            IIdenticonProvider identiconProvider) : base(userManager, unitOfWork, httpContextAccessor, configuration, tenantProvider, identiconProvider)
        {
        }

        public async Task UpsertQuestionAsync(BaseQuestionDto model, CancellationToken cancellationToken)
        {
            if (model.IsNew)
            {
                var uniqueOptions = new List<QuestionOptionDto>();

                foreach (var option in model.Options)
                {
                    if (!uniqueOptions.Any(x => x.Name == option.Name))
                    {
                        uniqueOptions.Add(option);
                    }
                }

                await _unitOfWork.QuestionRepository.AddAsync(new Question
                {
                    Name = model.Name,
                    Type = model.Type,
                    CreatedOn = DateTime.UtcNow,
                    Options = uniqueOptions.Select(o => new QuestionOption
                    {
                        Name = o.Name,
                        Value = o.Value,
                        CreatedOn = DateTime.UtcNow,
                        CreatedByUserId = USER_ID,
                    }).ToList()
                }, cancellationToken);
            }
            else
            {
                if (!model.Id.HasValue)
                {
                    throw new BusinessException(ErrorMessages.SOMETHING_WENT_WRONG);
                }

                var question = await _unitOfWork.QuestionRepository.FindAsync(model.Id.GetValueOrDefault(), cancellationToken);

                var existingOptions = question.Options.ToList();

                foreach (var modelOption in model.Options)
                {
                    var existingOption = existingOptions.FirstOrDefault(o => o.Id == modelOption.Id);

                    if (existingOption == null)
                    {
                        // Add new option
                        var newOption = new QuestionOption
                        {
                            QuestionId = question.Id,
                            Name = modelOption.Name,
                            Value = modelOption.Value,
                            CreatedOn = DateTime.UtcNow,
                            CreatedByUserId = USER_ID,
                        };
                        question.Options.Add(newOption);
                    }
                    else
                    {
                        // Update existing option
                        existingOption.Name = modelOption.Name;
                        existingOption.Value = modelOption.Value;
                        existingOption.ModifiedOn = DateTime.UtcNow;
                        existingOption.LastUpdatedByUserId = USER_ID;
                    }
                }

                // Remove options not in the model
                var modelOptionIds = model.Options.Select(o => o.Id).ToList();
                var optionsToRemove = existingOptions.Where(o => !modelOptionIds.Contains(o.Id)).ToList();

                foreach (var optionToRemove in optionsToRemove)
                {
                    question.Options.Remove(optionToRemove);
                }
            }
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<PagedList<QuestionListDto>> GetAllQuestions(FilterQuestionsDto model, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.QuestionRepository.GetAllQuestionsAsync(model, cancellationToken);

            return result;
        }

        public async Task DeleteQuestionAsync(Guid questionId, CancellationToken cancellationToken)
        {
            var question = await _unitOfWork.QuestionRepository.FindAsync(questionId, cancellationToken);

            if (question == null)
            {
                throw new BusinessException(ErrorMessages.SOMETHING_WENT_WRONG);
            }

            // Soft delete the question
            question.IsDeleted = true;
            question.DeletedOn = DateTime.UtcNow;
            question.DeletedByUserId = USER_ID;

            // Soft delete all related options
            foreach (var option in question.Options)
            {
                option.IsDeleted = true;
                option.DeletedOn = DateTime.UtcNow;
                option.DeletedByUserId = USER_ID;
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
