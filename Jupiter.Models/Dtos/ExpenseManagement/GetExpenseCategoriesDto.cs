using Jupiter.Helpers.Helpers;

namespace Jupiter.Models.Dtos.ExpenseManagement
{
    public class GetExpenseCategoriesDto : PageParams
    {
        public string? SearchParams { get; set; }
    }
}
