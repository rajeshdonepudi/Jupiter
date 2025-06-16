using Jupiter.DAL.Contracts;
using Jupiter.Extensions.EntityFramework;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Dtos.Tenants;
using Jupiter.Models.Entities.Tenants;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class TenantRepository : GenericRepository<Tenant>, ITenantRepository
    {
        public TenantRepository(JupiterContext context, IMemoryCache cache) : base(context, cache)
        {
        }

        public Guid GetTenantIdByHost(string host)
        {
            var tenant = _context.Tenants.Where(x => !x.IsDeleted)
                .AsNoTracking()
                .SingleOrDefault(x => x.Host.ToLower() == host.ToLower());

            if (tenant is null)
            {
                throw new Exception("Invalid request");
            }
            return tenant.Id;
        }

        public async Task<Tenant> GetTenantByHost(string host, CancellationToken cancellationToken)
        {
            return await _context.Tenants.SingleOrDefaultAsync(x => x.Host == host, cancellationToken)!;
        }

        public async Task<IEnumerable<TenantBasicDetailDto>> GetTenantBasicDetailsAsync(List<Guid> tenantIds, CancellationToken cancellationToken)
        {
            var result = await _context.Tenants.Where(x => tenantIds.Contains(x.Id))
                                               .Select(x => new TenantBasicDetailDto { Name = x.Name, Image = x.ProfilePicture.Base64, AccountAlias = x.AccountAlias })
                                               .ToListAsync(cancellationToken);
            return result;
        }

        public async Task<PagedList<TenantDetailsDto>> GetAllTenantsAsync(PageParams model, CancellationToken cancellationToken)
        {
            var tenants = await _context.Tenants.Select(x => new TenantDetailsDto
            {
                Id = x.Id,
                Name = x.Name,
                AccountAlias = x.AccountAlias,
                AccountId = x.AccountId,
                CreatedOn = x.CreatedOn,
                DeletedOn = x.DeletedOn,
                Host = x.Host,
                IsDeleted = x.IsDeleted,
                ModifiedOn = x.ModifiedOn,
                ProfilePicture = x.ProfilePicture != null ? x.ProfilePicture.Base64 : string.Empty,
                ThemesCount = x.Themes.LongCount(),
                UserCount = x.Users.LongCount(),
            }).ToPagedListAsync(model, cancellationToken);

            return tenants;
        }

        public async Task<TenantLookupDto> GetTenantBasicInfoByIdAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            var tenant = await _context.Tenants.Where(x => x.Id == tenantId)
                                               .Select(x => new TenantLookupDto
                                               {
                                                   Id = x.Id,
                                                   Name = x.Name,
                                               }).FirstOrDefaultAsync(cancellationToken);
            return tenant;
        }

        public async Task<TenantDetailsDto> GetTenantDetailsAsync(string accountAlias, CancellationToken cancellationToken)
        {
            var result = await _context.Tenants.Where(x => x.AccountAlias == accountAlias)
                                               .Select(x => new TenantDetailsDto
                                               {
                                                   Id = x.Id,
                                                   AccountAlias = x.AccountAlias,
                                                   AccountId = x.AccountId,
                                                   CreatedOn = x.CreatedOn,
                                                   DeletedOn = x.DeletedOn,
                                                   Host = x.Host,
                                                   IsDeleted = x.IsDeleted,
                                                   ModifiedOn = x.ModifiedOn,
                                                   Name = x.Name,
                                                   ProfilePicture = x.ProfilePicture.Base64,
                                                   ThemesCount = x.Themes.LongCount(),
                                                   UserCount = x.Users.LongCount(),

                                               }).FirstOrDefaultAsync(cancellationToken);

            return result;
        }

        public async Task<TenantManagementDashboardInfoDto> GetTenantManagementDashboardInfoAsync(CancellationToken cancellationToken)
        {
            var query = _context.Tenants.AsQueryable()
                                        .Where(x => !x.IsDeleted);

            var info = new TenantManagementDashboardInfoDto();

            info.TotalTenantsInSystem = await query.CountAsync(cancellationToken);
            info.TotalUsersInSystem = await query.SelectMany(x => x.Users).LongCountAsync(cancellationToken);

            return info;
        }

        public async Task<IEnumerable<KeyValuePair<string, Guid>>> GetTenantsLookupForDirectoryAsync(string? searchTerm, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                return Enumerable.Empty<KeyValuePair<string, Guid>>();
            }
            var result = await _context.Tenants
                                       .Where(x => EF.Functions.Like(x.Name, $"%{searchTerm}%"))
                                       .Select(u => new KeyValuePair<string, Guid>(u.Name, u.Id))
                                       .ToListAsync(cancellationToken);
            return result;
        }
    }
}

