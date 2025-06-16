using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.ExpenseManagement;

namespace Jupiter.BLL.Interfaces
{
    public interface IExpenseCategoryService
    {
        /// <summary>
        ///  Method to add expense category.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<BasicExpenseCategoryDto> AddExpenseCategoryAsync(AddExpenseCategoryDto model, CancellationToken cancellationToken);
        /// <summary>
        /// Method to delete expense category.
        /// </summary>
        /// <param name="categoryId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task DeleteExpenseCategoryAsync(Guid categoryId, CancellationToken cancellationToken);
        /// <summary>
        /// Method to get all categories for lookup.
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<IEnumerable<KeyValuePair<string, Guid>>> GetAllCategoriesForLookupAsync(CancellationToken cancellationToken);

        /// <summary>
        /// Method to get expense categories.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<PagedList<BasicExpenseCategoryDto>> GetAllExpenseCategoriesAsync(GetExpenseCategoriesDto model, CancellationToken cancellationToken);
        /// <summary>
        ///  Method to delete expense category.
        /// </summary>
        /// <param name="model"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task UpdateExpenseCategoryAsync(UpdateExpenseCategoryDto model, CancellationToken cancellationToken);
    }
}
