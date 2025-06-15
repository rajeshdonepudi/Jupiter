using Jupiter.BLL.Interfaces;
using Jupiter.Models.Dtos.Users;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Security.Claims;

namespace Jupiter.BLL.Hubs.Common
{
    public class BaseHub : Hub
    {
        protected static ConcurrentDictionary<string, string> _connections = new ConcurrentDictionary<string, string>();
        protected readonly IUserLookupService _userLookupService;
        protected readonly ITenantProvider _tenantProvider;
        private readonly ITokenValidationService _tokenValidationService;
        protected Guid? UserId = null;
        protected Guid? TenantId = null;

        public BaseHub(IUserLookupService userLookupService,
            ITenantProvider tenantProvider, ITokenValidationService tokenValidationService)
        {
            _userLookupService = userLookupService;
            _tenantProvider = tenantProvider;
            _tokenValidationService = tokenValidationService;
        }

        public async override Task OnConnectedAsync()
        {
            string connectionId = Context.ConnectionId;

            var referer = GetQueryParameterValue("referer");
            var accessToken = GetQueryParameterValue("access_token");

            if (string.IsNullOrEmpty(referer) || string.IsNullOrEmpty(accessToken))
            {
                await base.OnConnectedAsync();
                return;
            }

            TenantId = await _tenantProvider.ResolveTenantIdByRefererAsync(referer);

            if (!TenantId.HasValue)
            {
                await base.OnConnectedAsync();
                return;
            }

            var claims = _tokenValidationService.GetAllClaims(accessToken, TenantId.Value);

            if (claims == null || !claims.Any())
            {
                await base.OnConnectedAsync();
                return;
            }

            if (!Guid.TryParse(claims[ClaimTypes.Actor], out Guid parsedUserId))
            {
                await base.OnConnectedAsync();
                return;
            }

            UserId = parsedUserId;

            if (!UserId.HasValue)
            {
                await base.OnConnectedAsync();
                return;
            }

            if (_connections.TryAdd(connectionId, UserId.Value.ToString()))
            {
                await Clients.All.SendAsync("UpdateConnections", await GetAllActiveCallees());
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            string connectionId = Context.ConnectionId;

            _connections.TryRemove(connectionId, out _);

            await Clients.All.SendAsync("UpdateConnections", await GetAllActiveCallees());

            await base.OnDisconnectedAsync(exception);
        }

        public async Task<List<CallerInfoDto>> GetAllActiveCallees()
        {
            if (TenantId.HasValue)
            {
                var users = await _userLookupService.GetAllUsersLookupByTenantId(TenantId.Value, "", CancellationToken.None);

                var result = users.Where(u => _connections.Any(c => Guid.Parse(c.Value) == u.Id)).Select(x => new CallerInfoDto
                {
                    Id = x.Id,
                    Email = x.Email,
                    FullName = x.FullName,
                    ResourceAlias = x.ResourceAlias,
                    ConnectionId = _connections.FirstOrDefault(c => Guid.Parse(c.Value) == x.Id).Key
                }).ToList();

                return result;
            }
            return new List<CallerInfoDto>();
        }

        private string GetQueryParameterValue(string paramName)
        {
            var httpContext = Context.GetHttpContext();

            if (httpContext != null && httpContext.Request.Query.TryGetValue(paramName, out var value))
            {
                return value.ToString();
            }

            return string.Empty;
        }
    }
}
