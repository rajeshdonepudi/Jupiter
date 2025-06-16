using Jupiter.Enumerations.ExpenseManagement;
using Jupiter.Extensions.Enumerations;
using Jupiter.Models.Entities.ExpenseManagement;

namespace Jupiter.Models.Dtos.ExpenseManagement
{
    public class ExpenseTypeDto
    {
        public ExpenseTypeEnum Type { get; set; }
        public string Name { get; set; }
    }

    public class ExpenseCategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class ViewExpenseDetailDto
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public string ExpenseType { get; set; }
        public string CategoryName { get; set; }
        public DateTime AddedOn { get; set; }
    }

    public class ExpenseDashboardInfoDto
    {
        public ExpenseDashboardInfoDto()
        {
            ExpensesByType = new List<KeyValuePair<string, decimal>>();
            ExpensesByCategory = new List<KeyValuePair<string, decimal>>();
            Last30DaysExpenses = new List<KeyValuePair<string, decimal>>();
        }

        public decimal TotalExpenses { get; set; }

        public IEnumerable<KeyValuePair<string, decimal>> ExpensesByType { get; set; }
        public IEnumerable<KeyValuePair<string, decimal>> ExpensesByCategory { get; set; }
        public IEnumerable<KeyValuePair<string, decimal>> Last30DaysExpenses { get; set; }
    }


    public class BasicExpenseDetailDto
    {
        public BasicExpenseDetailDto(Expense expense)
        {
            Id = expense.Id;
            Amount = expense.Amount;
            Description = expense.Description;
            ExpenseType = new ExpenseTypeDto
            {
                Name = expense.Type.GetDisplayName(),
                Type = expense.Type
            };

            if (expense.Category is not null)
            {
                Category = new ExpenseCategoryDto
                {
                    Id = expense.Category.Id,
                    Name = expense.Category.Name,
                };
            }
        }

        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public ExpenseTypeDto ExpenseType { get; set; }
        public ExpenseCategoryDto Category { get; set; }
    }
}
