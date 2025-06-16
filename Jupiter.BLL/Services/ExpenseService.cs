using IdenticonSharp.Identicons;
using Jupiter.BLL.Helpers;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Enumerations.ExpenseManagement;
using Jupiter.Extensions.Enumerations;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.ExpenseManagement;
using Jupiter.Models.Entities.ExpenseManagement;
using Jupiter.Models.Entities.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Jupiter.BLL.Services
{
    public class ExpenseService : BaseService, IExpenseService
    {
        public ExpenseService(UserManager<User> userManager, IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ITenantProvider tenantProvider, IIdenticonProvider identiconProvider) :
            base(userManager, unitOfWork, httpContextAccessor, configuration, tenantProvider, identiconProvider)
        {
        }

        public async Task<ViewExpenseDetailDto> GetExpenseDetailsAsync(Guid expenseId, CancellationToken cancellationToken)
        {
            var expense = await _unitOfWork.ExpenseRepository.QueryAsync(x => !x.IsDeleted &&
                                                          x.CreatedByUserId.HasValue &&
                                                          x.CreatedByUserId == USER_ID &&
                                                          x.Id == expenseId,
                                                           includeProperties: x => x.Include(x => x.Category),
                                                          cancellationToken
                                                          );

            var result = new ViewExpenseDetailDto
            {
                Id = expense.Id,
                Description = expense.Description,
                AddedOn = expense.CreatedOn,
                Amount = expense.Amount,
                CategoryName = expense.Category.Name,
                ExpenseType = expense.Type.GetDisplayName(),
            };
            return result;
        }


        public async Task<IEnumerable<KeyValuePair<string, int>>> GetAllExpenseTypesAsync()
        {
            return await Task.FromResult(EnumExtensions.GetEnumKeyValuePairList<ExpenseTypeEnum, string, int>());
        }

        public async Task<ExpenseDashboardInfoDto> GetDashboardInfoAsync(CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.ExpenseRepository.GetExpenseDashboardInfo(USER_ID, cancellationToken);

            return result;
        }

        public async Task<PagedList<BasicExpenseDetailDto>> GetAllExpensesAsync(GetExpensesDto model, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.ExpenseRepository.GetExpensesByUserIdAsync(model, USER_ID, cancellationToken);

            return result;
        }

        public async Task<BasicExpenseDetailDto> AddExpenseAsync(AddExpenseDto model, CancellationToken cancellationToken)
        {
            if (!model.IsValidExpense)
            {
                throw new BusinessException(MessageHelper.ExpenseManagementErrors.INVALID_EXPENSE);
            }

            var expense = await _unitOfWork.ExpenseRepository.AddAsync(new Expense
            {
                Type = model.Type,
                Description = model.Description,
                Amount = model.Amount,
                CreatedOn = model.ExpenseDate,
                CreatedByUserId = USER_ID,
                CategoryId = model.CategoryId,
            }, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new BasicExpenseDetailDto(expense);
        }

        public async Task<IEnumerable<BasicExpenseDetailDto>> AddExpensesAsync(List<AddExpenseDto> model, CancellationToken cancellationToken)
        {
            var validExpenses = model.Where(x => x.IsValidExpense).ToList();

            var expenses = validExpenses.Select(x => new Expense
            {
                Type = x.Type,
                Description = x.Description,
                Amount = x.Amount,
                CreatedOn = DateTime.UtcNow,
                CreatedByUserId = USER_ID,
                CategoryId = x.CategoryId,
            }).ToList();

            await _unitOfWork.ExpenseRepository.AddRangeAsync(expenses, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return expenses.Select(x => new BasicExpenseDetailDto(x)).ToList();
        }

        public async Task UpdateExpenseAsync(UpdateExpenseDto model, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.ExpenseRepository.FindAsync(model.Id, cancellationToken);

            if (result is null)
            {
                throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
            }

            result.LastUpdatedByUserId = USER_ID;
            result.ModifiedOn = DateTime.UtcNow;
            result.Description = model.Description;
            result.Amount = model.Amount;
            result.Type = model.Type;
            result.CategoryId = model.CategoryId;

            _unitOfWork.ExpenseRepository.UpdateAsync(result);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteExpenseAsync(Guid expenseId, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.ExpenseRepository.FindAsync(expenseId, cancellationToken);

            if (result is null)
            {
                throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
            }

            result.DeletedByUserId = USER_ID;
            result.IsDeleted = true;
            result.DeletedOn = DateTime.UtcNow;

            _unitOfWork.ExpenseRepository.UpdateAsync(result);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
