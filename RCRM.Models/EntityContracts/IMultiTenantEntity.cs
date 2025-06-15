using Jupiter.Models.Entities.Tenants;

namespace Jupiter.Models.EntityContracts
{
    public interface IMultiTenantEntity : ITrackableEntity
    {
        Guid? TenantId { get; set; }
        Tenant Tenant { get; set; }
    }
}
