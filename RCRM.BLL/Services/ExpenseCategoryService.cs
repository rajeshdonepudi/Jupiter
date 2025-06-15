using IdenticonSharp.Identicons;
using Jupiter.BLL.Helpers;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.ExpenseManagement;
using Jupiter.Models.Entities.ExpenseManagement;
using Jupiter.Models.Entities.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Jupiter.BLL.Services
{
    public class ExpenseCategoryService : BaseService, IExpenseCategoryService
    {
        public ExpenseCategoryService(UserManager<User> userManager, IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ITenantProvider tenantProvider, IIdenticonProvider identiconProvider)
            : base(userManager, unitOfWork, httpContextAccessor, configuration, tenantProvider, identiconProvider)
        {
        }

        public async Task<IEnumerable<KeyValuePair<string, Guid>>> GetAllCategoriesForLookupAsync(CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.ExpenseCategoryRepository.GetAllCategoriesLookupAsync(USER_ID, cancellationToken);

            return result;
        }

        public async Task<PagedList<BasicExpenseCategoryDto>> GetAllExpenseCategoriesAsync(GetExpenseCategoriesDto model, CancellationToken cancellationToken)
        {
            var result = await _unitOfWork.ExpenseCategoryRepository.GetExpenseCategoriesByUserId(model, USER_ID, cancellationToken);

            return result;
        }

        public async Task<BasicExpenseCategoryDto> AddExpenseCategoryAsync(AddExpenseCategoryDto model, CancellationToken cancellationToken)
        {
            if (!model.IsValidCategory)
            {
                throw new BusinessException(MessageHelper.ExpenseManagementErrors.INVALID_EXPENSE_CATEGORY);
            }

            var category = await _unitOfWork.ExpenseCategoryRepository.AddAsync(new ExpenseCategory
            {
                Name = model.Name,
                CreatedOn = DateTime.UtcNow,
                Description = model.Description,
                CreatedByUserId = USER_ID
            }, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new BasicExpenseCategoryDto(category);
        }

        public async Task DeleteExpenseCategoryAsync(Guid categoryId, CancellationToken cancellationToken)
        {
            var category = await _unitOfWork.ExpenseCategoryRepository.FindAsync(categoryId, cancellationToken);

            if (category is null)
            {
                throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
            }

            category.DeletedOn = DateTime.UtcNow;
            category.DeletedByUserId = USER_ID;
            category.IsDeleted = true;

            _unitOfWork.ExpenseCategoryRepository.UpdateAsync(category);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateExpenseCategoryAsync(UpdateExpenseCategoryDto model, CancellationToken cancellationToken)
        {
            var category = await _unitOfWork.ExpenseCategoryRepository.FindAsync(model.Id, cancellationToken);

            if (category is null)
            {
                throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
            }

            category.Name = model.Name;
            category.Description = model.Description;
            category.ModifiedOn = DateTime.UtcNow;
            category.LastUpdatedByUserId = USER_ID;

            _unitOfWork.ExpenseCategoryRepository.UpdateAsync(category);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
