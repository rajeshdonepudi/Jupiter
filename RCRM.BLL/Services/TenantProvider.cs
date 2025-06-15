using Jupiter.BLL.Helpers;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Microsoft.AspNetCore.Http;

namespace Jupiter.BLL.Services
{
    public class TenantProvider : ITenantProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppConfigService _appConfigService;

        public TenantProvider(IHttpContextAccessor httpContextAccessor, IUnitOfWork unitOfWork, IAppConfigService appConfigService)
        {
            _httpContextAccessor = httpContextAccessor;
            _unitOfWork = unitOfWork;
            _appConfigService = appConfigService;
        }

        public async Task<Guid> GetTenantIdAsync()
        {
            bool useLocalTenantId = Convert.ToBoolean(await _appConfigService.GetValueAsync("useLocalTenantId"));

            if (useLocalTenantId)
            {
                return Guid.Parse(await _appConfigService.GetValueAsync("localTenantId"));
            }
            else
            {
                string referer = string.Empty;

                var isSocketReq = _httpContextAccessor?.HttpContext?.WebSockets.IsWebSocketRequest;

                if (isSocketReq.GetValueOrDefault())
                {
                    referer = _httpContextAccessor?.HttpContext?.Request.Query["referer"]!;
                }
                else
                {
                    referer = _httpContextAccessor?.HttpContext?.Request?.Headers?.Referer.ToString()!;
                }

                return await ResolveTenantIdByRefererAsync(referer);
            }
            throw new Exception(ErrorMessages.INVALID_REQUEST);
        }

        public async Task<Guid> ResolveTenantIdByRefererAsync(string referer)
        {
            Uri uri = new(referer);

            if (string.IsNullOrEmpty(uri.Host))
            {
                throw new Exception(ErrorMessages.INVALID_REQUEST);
            }

            var t = await _unitOfWork.TenantRepository.GetTenantByHost(uri.Host, CancellationToken.None);

            var tenant = await _unitOfWork.TenantRepository.QueryAsync(x => x.Host.Equals(uri.Host), CancellationToken.None);

            if (tenant is null)
            {
                throw new Exception(ErrorMessages.INVALID_REQUEST);
            }
            return tenant.Id;
        }
    }
}
