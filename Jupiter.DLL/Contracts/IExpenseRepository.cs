using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.ExpenseManagement;
using Jupiter.Models.Entities.ExpenseManagement;
using Jupiter.Models.EntityContracts;

namespace Jupiter.DAL.Contracts
{
    public interface IExpenseRepository : IGenericRepository<Expense>
    {
        Task<ExpenseDashboardInfoDto> GetExpenseDashboardInfo(Guid userId, CancellationToken cancellationToken);
        Task<PagedList<BasicExpenseDetailDto>> GetExpensesByUserIdAsync(GetExpensesDto model, Guid userId, CancellationToken cancellationToken);
    }
}
