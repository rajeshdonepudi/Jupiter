using Jupiter.DAL.Contracts;
using Jupiter.Extensions.EntityFramework;
using Jupiter.Extensions.Enumerations;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.QuestionAndAnswer;
using Jupiter.Models.Entities.QuestionAndAnswer;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class QuestionRepository : GenericRepository<Question>, IQuestionRepository
    {
        public QuestionRepository(JupiterContext context, IMemoryCache cache) : base(context, cache)
        {
        }

        public async Task<PagedList<QuestionListDto>> GetAllQuestionsAsync(FilterQuestionsDto model, CancellationToken cancellationToken)
        {
            var result = await _context.Questions.OrderByDescending(x => x.CreatedOn).Select(x => new QuestionListDto
            {
                Id = x.Id,
                Name = x.Name,
                Type = x.Type,
                QuestionTypeName = x.Type.GetDisplayName()!
            }).ToPagedListAsync(model, cancellationToken);

            return result;
        }
    }
}

