using Jupiter.Helpers.Helpers;

namespace Jupiter.Models.Dtos.ExpenseManagement
{
    public class GetExpensesDto : PageParams
    {
        public string? SearchParams { get; set; }
    }
}
