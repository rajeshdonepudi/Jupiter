using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.ExpenseManagement;
using Jupiter.Models.Entities.ExpenseManagement;
using Jupiter.Models.EntityContracts;

namespace Jupiter.DAL.Contracts
{
    public interface IExpenseCategoryRepository : IGenericRepository<ExpenseCategory>
    {
        Task<IEnumerable<KeyValuePair<string, Guid>>> GetAllCategoriesLookupAsync(Guid userId, CancellationToken cancellationToken);
        Task<PagedList<BasicExpenseCategoryDto>> GetExpenseCategoriesByUserId(GetExpenseCategoriesDto model, Guid userId, CancellationToken cancellationToken);
    }
}
