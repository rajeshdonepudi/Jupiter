using Jupiter.BLL.HubsContracts;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Microsoft.AspNetCore.SignalR;

namespace Jupiter.BLL.Hubs.Dashboards
{
    public class UserDashboardHub : Hub<IUserDashboardHub>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserService _userService;
        private readonly ITenantProvider _tenantProvider;

        public UserDashboardHub(IUnitOfWork unitOfWork, IUserService userService, ITenantProvider tenantProvider)
        {
            _unitOfWork = unitOfWork;
            _userService = userService;
            _tenantProvider = tenantProvider;
        }

        public override async Task OnConnectedAsync()
        {
            var connectionId = Context.ConnectionId;
            var userName = Context.User?.Identity?.Name ?? "Anonymous";

            var message = $"{userName} has joined. Connection ID: {connectionId}";

            var tenantId = await _tenantProvider.GetTenantIdAsync();

            var info = await _unitOfWork.UserRepository.GetUserManagementDashboardInfoByTenant(tenantId, default);

            var usersCreatedOverYears = await _unitOfWork.UserRepository.UserCreatedByYear();

            await Clients.All.SEND_USER_METRIC_INFO(info);

            await Clients.All.SEND_USER_CREATED_OVER_YEARS(usersCreatedOverYears);

            await base.OnConnectedAsync();
        }
    }
}
