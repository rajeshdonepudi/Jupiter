using Jupiter.DAL.Contracts;
using Jupiter.Extensions.EntityFramework;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.ExpenseManagement;
using Jupiter.Models.Entities.ExpenseManagement;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class ExpenseRepository : GenericRepository<Expense>, IExpenseRepository
    {
        public ExpenseRepository(JupiterContext context, IMemoryCache cache) : base(context, cache)
        {
        }

        public async Task<ExpenseDashboardInfoDto> GetExpenseDashboardInfo(Guid userId, CancellationToken cancellationToken)
        {
            var baseQuery = _context.Expenses.Where(x => !x.IsDeleted && x.CreatedByUserId.HasValue && x.CreatedByUserId == userId);

            var totalExpenses = await baseQuery.SumAsync(x => x.Amount, cancellationToken);

            var expensesByType = baseQuery.GroupBy(x => x.Type)
                                   .Select(x => new KeyValuePair<string, decimal>(x.Key.ToString(), x.Sum(x => x.Amount)))
                                   .ToList();

            var expensesLast30Days = baseQuery.GroupBy(x => x.CreatedOn.Date)
                                   .Select(x => new KeyValuePair<string, decimal>(x.Key.ToString(), x.Sum(x => x.Amount)))
                                   .ToList();

            var expensesByCategory = baseQuery.Where(c => !c.Category.IsDeleted).GroupBy(x => x.Category.Name)
                                   .Select(x => new KeyValuePair<string, decimal>(x.Key.ToString(), x.Sum(x => x.Amount)))
                                   .ToList();

            var result = new ExpenseDashboardInfoDto
            {
                Last30DaysExpenses = expensesLast30Days,
                TotalExpenses = totalExpenses,
                ExpensesByType = expensesByType,
                ExpensesByCategory = expensesByCategory
            };

            return result;
        }

        public async Task<PagedList<BasicExpenseDetailDto>> GetExpensesByUserIdAsync(GetExpensesDto model, Guid userId, CancellationToken cancellationToken)
        {
            var query = _context.Expenses.Where(x => !x.IsDeleted &&
                                                     x.CreatedByUserId.HasValue &&
                                                     x.CreatedByUserId.Value == userId);

            if (!string.IsNullOrEmpty(model.SearchParams))
            {
                query = query.Where(x => x.Description.ToLower().Contains(model.SearchParams.ToLower()));
            }

            return await query.OrderByDescending(x => x.CreatedOn).Include(x => x.Category).Select(x => new BasicExpenseDetailDto(x))
                              .ToPagedListAsync(model, cancellationToken);
        }
    }
}

