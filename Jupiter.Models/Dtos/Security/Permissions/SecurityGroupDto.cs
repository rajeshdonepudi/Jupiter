using Jupiter.Enumerations.Security;
using Jupiter.Models.Entities.Security;

namespace Jupiter.Models.Dtos.Security.Permissions
{
    public record RemoveUserPermission
    {
        public string Permission { get; set; }
        public string ResourceId { get; set; }
    }

    public record ManagePermissionsForTenantDto
    {
        public ManagePermissionsForTenantDto()
        {
            Tenants = new List<Guid>();
            Permissions = new List<Guid>();
        }
        public List<Guid> Tenants { get; set; }
        public List<Guid> Permissions { get; set; }
        public PermissionActionEnum Action { get; set; }
    }
    public record ManagePermissionsDto
    {
        public ManagePermissionsDto()
        {
            Users = new List<Guid>();
            SecurityGroups = new List<Guid>();
            Permissions = new List<Guid>();
            Action = PermissionActionEnum.None;
        }

        public List<Guid> Users { get; set; }
        public List<Guid> SecurityGroups { get; set; }
        public List<Guid> Permissions { get; set; }
        public PermissionActionEnum Action { get; set; }
    }

    public record UserPermissionsDto
    {
        public string Name { get; set; }
        public List<string> Permissions { get; set; }
    }

    public record SecurityGroupInfoDto
    {
        public SecurityGroupInfoDto()
        {

        }
        public SecurityGroupInfoDto(SecurityGroup securityGroup)
        {
            Name = securityGroup.Name;
            ModifiedOn = securityGroup.ModifiedOn;
            CreatedOn = securityGroup.CreatedOn;
        }
        public string Name { get; set; }
        public long NoOfUsers { get; set; }
        public long NoOfPermissions { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public record SecurityGroupDto
    {
        public SecurityGroupDto()
        {
            Permissions = new List<KeyValuePair<Guid, string>>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<KeyValuePair<Guid, string>> Permissions { get; set; }
    }
}
