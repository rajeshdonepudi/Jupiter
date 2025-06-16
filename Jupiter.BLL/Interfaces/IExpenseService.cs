using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.ExpenseManagement;

namespace Jupiter.BLL.Interfaces
{
    public interface IExpenseService
    {
        /// <summary>
        /// Method to add expense.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<BasicExpenseDetailDto> AddExpenseAsync(AddExpenseDto model, CancellationToken cancellationToken);
        /// <summary>
        /// Method to add multiple expenses.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<IEnumerable<BasicExpenseDetailDto>> AddExpensesAsync(List<AddExpenseDto> model, CancellationToken cancellationToken);
        /// <summary>
        /// Method to delete expense.
        /// </summary>
        /// <param name="expenseId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task DeleteExpenseAsync(Guid expenseId, CancellationToken cancellationToken);
        /// <summary>
        /// Method to get all expenses.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<PagedList<BasicExpenseDetailDto>> GetAllExpensesAsync(GetExpensesDto model, CancellationToken cancellationToken);
        /// <summary>
        /// Method to get all expense types
        /// </summary>
        /// <returns></returns>
        Task<IEnumerable<KeyValuePair<string, int>>> GetAllExpenseTypesAsync();
        /// <summary>
        /// Method to get dashboard info.
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<ExpenseDashboardInfoDto> GetDashboardInfoAsync(CancellationToken cancellationToken);
        /// <summary>
        /// Method to get expense details
        /// </summary>
        /// <param name="expenseId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<ViewExpenseDetailDto> GetExpenseDetailsAsync(Guid expenseId, CancellationToken cancellationToken);

        /// <summary>
        /// Method to update expense.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task UpdateExpenseAsync(UpdateExpenseDto model, CancellationToken cancellationToken);
    }
}
