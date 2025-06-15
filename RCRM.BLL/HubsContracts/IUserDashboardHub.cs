using Jupiter.Models.Dtos.Users;

namespace Jupiter.BLL.HubsContracts
{
    public interface IUserDashboardHub
    {
        Task SEND_USER_METRIC_INFO(UserManagementDashboardInfoDto data);
        Task SEND_USER_CREATED_OVER_YEARS(IEnumerable<UserCreatedByYearDTO> data);
    }
}
