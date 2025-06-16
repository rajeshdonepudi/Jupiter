using Jupiter.DAL.Contracts;
using Jupiter.Models.Entities.Security;
using Microsoft.Extensions.Caching.Memory;

namespace Jupiter.DAL.Repositories
{
    public class TenantUserSecurityGroupRepository : GenericRepository<TenantUserSecurityGroup>, ITenantUserSecurityGroupRepository
    {
        public TenantUserSecurityGroupRepository(JupiterContext context, IMemoryCache cache) : base(context, cache)
        {
        }
    }
}

