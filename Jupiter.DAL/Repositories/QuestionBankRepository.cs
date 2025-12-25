using Jupiter.DAL.Contracts;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.QuestionAndAnswer;
using Jupiter.Models.Entities.QuestionAndAnswer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class QuestionBankRepository : GenericRepository<QuestionBank>, IQuestionBankRepository
    {
        public QuestionBankRepository(JupiterContext context, IMemoryCache cache) : base(context, cache)
        {
        }

        public async Task<PagedList<QuestionBankListDto>> GetAllQuestionBanksAsync(FilterQuestionBanksDto model, CancellationToken cancellationToken)
        {
            var query = _context.QuestionBanks.AsNoTracking().AsQueryable();

            if (!string.IsNullOrEmpty(model.SearchTerm))
            {
                query = query.Where(x => x.Name.Contains(model.SearchTerm));
            }

            var count = await query.CountAsync(cancellationToken);

            var items = await query
                .Skip((model.PageNumber - 1) * model.PageSize)
                .Take(model.PageSize)
                .Select(x => new QuestionBankListDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    QuestionCount = x.Questions.Count
                })
                .ToListAsync(cancellationToken);

            return new PagedList<QuestionBankListDto>(items, count, model.PageNumber, model.PageSize);
        }
    }
}
