using Jupiter.API.Attributes;
using Jupiter.BLL.Interfaces;
using Jupiter.Models.Dtos.ExpenseManagement;
using Jupiter.Security;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.ExpenseManagement
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseCategoryController : BaseSecureController
    {
        private readonly IExpenseCategoryService _expenseCategoryService;

        public ExpenseCategoryController(IExpenseCategoryService expenseCategoryService)
        {
            _expenseCategoryService = expenseCategoryService;
        }

        [HttpGet("get-all-categories/lookup")]
        [JupiterAuthorize(PermissionPool.Expense_Management.VIEW_ALL_EXPENSE_CATEGORIES_LOOKUP)]
        public async Task<IActionResult> GetAllCategories(CancellationToken cancellationToken)
        {
            var result = await _expenseCategoryService.GetAllCategoriesForLookupAsync(cancellationToken);

            return Ok(result);
        }

        [HttpPost("get-all-categories")]
        [JupiterAuthorize(PermissionPool.Expense_Management.VIEW_ALL_EXPENSE_CATEGORIES)]
        public async Task<IActionResult> GetAllExpenses(GetExpenseCategoriesDto model, CancellationToken cancellationToken)
        {
            var result = await _expenseCategoryService.GetAllExpenseCategoriesAsync(model, cancellationToken);

            return Ok(result);
        }

        [HttpPost("add-category")]
        [JupiterAuthorize(PermissionPool.Expense_Management.ADD_EXPENSE_CATEGORY)]
        public async Task<IActionResult> AddCategory(AddExpenseCategoryDto model, CancellationToken cancellationToken)
        {
            var result = await _expenseCategoryService.AddExpenseCategoryAsync(model, cancellationToken);

            return Created(GetRequestURI(), result);
        }

        [HttpPatch("update-category")]
        [JupiterAuthorize(PermissionPool.Expense_Management.UPDATE_EXPENSE_CATEGORY)]
        public async Task<IActionResult> UpdateCategory(UpdateExpenseCategoryDto model, CancellationToken cancellationToken)
        {
            await _expenseCategoryService.UpdateExpenseCategoryAsync(model, cancellationToken);

            return Accepted();
        }

        [HttpDelete("{categoryId}/delete")]
        [JupiterAuthorize(PermissionPool.Expense_Management.DELETE_EXPENSE_CATEGORY)]
        public async Task<IActionResult> DeleteCategory(Guid categoryId, CancellationToken cancellationToken)
        {
            await _expenseCategoryService.DeleteExpenseCategoryAsync(categoryId, cancellationToken);

            return NoContent();
        }
    }
}
