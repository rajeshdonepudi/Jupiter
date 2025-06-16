using Jupiter.API.Attributes;
using Jupiter.BLL.Interfaces;
using Jupiter.Models.Dtos.ExpenseManagement;
using Jupiter.Security;
using Microsoft.AspNetCore.Mvc;

namespace Jupiter.API.Controllers.ExpenseManagement
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseController : BaseSecureController
    {
        private readonly IExpenseService _expenseService;

        public ExpenseController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpGet("dashboard-info")]
        [JupiterAuthorize(PermissionPool.Expense_Management.VIEW_EXPENSES_DASHBOARD)]
        public async Task<IActionResult> GetDashboardInfo(CancellationToken cancellationToken)
        {
            var result = await _expenseService.GetDashboardInfoAsync(cancellationToken);

            return Ok(result);
        }

        [HttpGet("{expenseId}/details")]
        [JupiterAuthorize(PermissionPool.Expense_Management.VIEW_EXPENSE_INFO)]
        public async Task<IActionResult> GetExpenseDetails(Guid expenseId, CancellationToken cancellationToken)
        {
            var result = await _expenseService.GetExpenseDetailsAsync(expenseId, cancellationToken);

            return Ok(result);
        }

        [HttpGet("types")]
        [JupiterAuthorize(PermissionPool.Expense_Management.VIEW_ALL_EXPENSE_TYPES_LOOKUP)]
        public async Task<IActionResult> GetAllExpenseTypesForLookup()
        {
            var result = await _expenseService.GetAllExpenseTypesAsync();

            return Ok(result);
        }

        [HttpPost("get-all-expenses")]
        [JupiterAuthorize(PermissionPool.Expense_Management.VIEW_ALL_EXPENSES)]
        public async Task<IActionResult> GetAllExpenses(GetExpensesDto model, CancellationToken cancellationToken)
        {
            var result = await _expenseService.GetAllExpensesAsync(model, cancellationToken);

            return Ok(result);
        }

        [HttpPost("add-expense")]
        [JupiterAuthorize(PermissionPool.Expense_Management.ADD_EXPENSE)]
        public async Task<IActionResult> AddExpense(AddExpenseDto model, CancellationToken cancellationToken)
        {
            var result = await _expenseService.AddExpenseAsync(model, cancellationToken);

            return Created(GetRequestURI(), result);
        }

        [HttpPost("add-expenses-bulk")]
        [JupiterAuthorize(PermissionPool.Expense_Management.ADD_EXPENSES_BULK)]
        public async Task<IActionResult> AddExpenses(List<AddExpenseDto> model, CancellationToken cancellationToken)
        {
            var result = await _expenseService.AddExpensesAsync(model, cancellationToken);

            return Created(GetRequestURI(), result);
        }

        [HttpPatch("update")]
        [JupiterAuthorize(PermissionPool.Expense_Management.UPDATE_EXPENSE)]
        public async Task<IActionResult> UpdateExpense(UpdateExpenseDto model, CancellationToken cancellationToken)
        {
            await _expenseService.UpdateExpenseAsync(model, cancellationToken);

            return Accepted();
        }

        [HttpDelete("{expenseId}/delete")]
        [JupiterAuthorize(PermissionPool.Expense_Management.DELETE_EXPENSE)]
        public async Task<IActionResult> DeleteExpense(Guid expenseId, CancellationToken cancellationToken)
        {
            await _expenseService.DeleteExpenseAsync(expenseId, cancellationToken);

            return NoContent();
        }
    }
}
