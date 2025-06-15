using Jupiter.DAL.Contracts;
using Jupiter.Models.Entities.Tenants;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class TenantUserRepository : GenericRepository<TenantUser>, ITenantUserRepository
    {
        public TenantUserRepository(JupiterContext context, IMemoryCache cache) : base(context, cache)
        {
        }
    }
}

