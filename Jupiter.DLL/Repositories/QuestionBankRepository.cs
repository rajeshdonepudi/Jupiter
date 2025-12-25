using Jupiter.DAL;
using Jupiter.DAL.Contracts;
using Jupiter.Extensions.EntityFramework;
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
                .Skip((model.Page - 1) * model.PageSize)
                .Take(model.PageSize)
                .Select(x => new QuestionBankListDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    QuestionCount = x.Questions.Count
                })
                .ToPagedListAsync(model,cancellationToken);

            return items;
        }

        public async Task<QuestionBankDto> GetQuestionBankAsync(Guid questionBankId, CancellationToken cancellationToken)
        {
             var bank = await _context.QuestionBanks.AsNoTracking()
                .Include(x => x.Questions)
                .ThenInclude(x => x.Question)
                .FirstOrDefaultAsync(x => x.Id == questionBankId, cancellationToken);

             if(bank == null)
             {
                 return null;
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

        public async Task UpsertQuestionBankAsync(QuestionBankDto model, Guid userId, CancellationToken cancellationToken)
        {
            if (model.IsNew)
            {
                var newBank = new QuestionBank
                {
                    Name = model.Name,
                    Description = model.Description,
                    CreatedOn = DateTime.UtcNow,
                    CreatedByUserId = userId,
                    Questions = model.Questions?.Select((q, index) => new QuestionBankQuestion
                    {
                        QuestionId = q.QuestionId,
                        Order = index
                    }).ToList() ?? new List<QuestionBankQuestion>()
                };

                await AddAsync(newBank, cancellationToken);
            }
            else
            {
                var bank = await _context.QuestionBanks
                    .Include(x => x.Questions)
                    .FirstOrDefaultAsync(x => x.Id == model.Id, cancellationToken);

                if (bank == null)
                {
                    throw new Exception("Record not found"); // Simple exception, Service handles business logic usually
                }

                bank.Name = model.Name;
                bank.Description = model.Description;
                bank.ModifiedOn = DateTime.UtcNow;
                bank.LastUpdatedByUserId = userId;

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
        }
    }
}
