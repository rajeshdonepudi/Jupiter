using Bogus;
using Jupiter.Enumerations.Common;
using Jupiter.Enumerations.Settings;
using Jupiter.Enumerations.Tenant;
using Jupiter.Extensions.Enumerations;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.Entities.Common;
using Jupiter.Models.Entities.Security;
using Jupiter.Models.Entities.Tenants;
using Jupiter.Models.Entities.Users;
using Jupiter.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;
using System.Text;

namespace Jupiter.DAL
{
    public static class DbSeeder
    {
        public async static void Seed(IServiceProvider serviceProvider, CancellationToken cancellationToken)
        {
            var scope = serviceProvider.CreateScope();

            using (scope)
            {
                var context = scope.ServiceProvider.GetRequiredService<JupiterContext>();

                /***
                 * Sync permissions
                 * **/
                await SyncPermissions(context, cancellationToken);

                /***
                 * Initialize roles.
                 * **/
                await InitializeRolesAsync(context, cancellationToken);

                /****
                 * Create Root User's
                 * **/
                await CreateRootUserAsync(context, cancellationToken);

                /****
                 * Initialize tenants.
                 * **/
                await InitializeTenantsAsync(context, cancellationToken);
            }
        }

        private static async Task InitializeRolesAsync(JupiterContext context, CancellationToken cancellationToken)
        {
            if (!await context.Roles.AnyAsync())
            {
                await context.Roles.AddRangeAsync(GetSecurityRoles(), cancellationToken);

                await context.SaveChangesAsync(cancellationToken);
            }
        }

        private static async Task SyncPermissions(JupiterContext context, CancellationToken cancellationToken)
        {
            // Retrieve all permissions and groups from the database
            var groupedPermissions = ConstToListConverter.GetAllConstStringsAsDictionary(typeof(PermissionPool));

            // Iterate over each permission group
            foreach (var group in groupedPermissions)
            {
                // Check if the permission group exists; if not, create it
                var permissionGroup = await context.PermissionGroups
                    .FirstOrDefaultAsync(x => x.Name == group.Key, cancellationToken);

                if (permissionGroup == null)
                {
                    permissionGroup = new PermissionGroup { Name = group.Key };
                    await context.PermissionGroups.AddAsync(permissionGroup, cancellationToken);
                    await context.SaveChangesAsync(cancellationToken);
                }

                // Retrieve the permissions for the current group from the database
                var existingPermissions = await context.Permissions
                    .Where(x => x.PermissionGroupId == permissionGroup.Id)
                    .ToListAsync(cancellationToken);

                var existingPermissionValues = existingPermissions.Select(x => x.Value).ToHashSet();
                var newPermissionValues = group.Value.ToHashSet();

                // Add new permissions that do not exist in the database
                var permissionsToAdd = group.Value.Except(existingPermissionValues);
                foreach (var permission in permissionsToAdd)
                {
                    var newPermission = new Permission
                    {
                        CreatedOn = DateTime.UtcNow,
                        Type = ClaimTypes.System,
                        Value = permission,
                        PermissionGroupId = permissionGroup.Id
                    };
                    await context.Permissions.AddAsync(newPermission, cancellationToken);
                }

                // Remove permissions that are no longer in the groupedPermissions
                var permissionsToRemove = existingPermissions
                    .Where(p => !newPermissionValues.Contains(p.Value))
                    .ToList();

                context.Permissions.RemoveRange(permissionsToRemove);

                // Save changes if there are any modifications
                if (context.ChangeTracker.HasChanges())
                {
                    await context.SaveChangesAsync(cancellationToken);
                }
            }
        }



        private static async Task CreateRootUserAsync(JupiterContext context, CancellationToken cancellationToken)
        {
            if (!await context.Users.AsSplitQuery().AnyAsync(x => x.Email == "rajeshdonepudi1@mailinator.com", cancellationToken))
            {
                var rootUser = GenerateRootUser();
                await context.Users.AddAsync(rootUser, cancellationToken);
                var rootUserCreation = await context.SaveChangesAsync(cancellationToken);

                if (rootUserCreation > 0)
                {
                    var role = await context.Roles.FirstOrDefaultAsync(x => x.Name == SecurityRoles.GOD);

                    if (role is not null)
                    {
                        await context.UserRoles.AddAsync(new UserRole
                        {
                            UserId = rootUser.Id,
                            RoleId = role.Id,
                        });

                        await context.SaveChangesAsync();
                    }
                }
            }
        }

        private static async Task InitializeTenantsAsync(JupiterContext context, CancellationToken cancellationToken)
        {
            if (!await context.Tenants.AnyAsync(cancellationToken))
            {
                var tenantFaker = new Faker<Tenant>()
                                     .RuleFor(t => t.Name, f => "RTech")
                                     .RuleFor(t => t.Host, f => "localhost")
                                     .RuleFor(t => t.CreatedOn, f => f.Date.Past(1))
                                     .RuleFor(t => t.ModifiedOn, f => f.Date.Recent())
                                     .RuleFor(t => t.ProfilePicture, (f, p) => new Image
                                     {
                                         Data = Encoding.UTF8.GetBytes(f.Image.PicsumUrl()),
                                         Title = f.Name.Random.AlphaNumeric(9)
                                     })
                                     .RuleFor(x => x.Users, f => GenerateTenantUsers(10))
                                     .RuleFor(x => x.Settings, f => GetPredefinedSettingsForTenant());


                await Task.Factory.StartNew(() =>
                {
                    for (int i = 1; i <= 1; i++)
                    {
                        Console.WriteLine($"----------------------------------------");
                        Console.WriteLine("Started Batch Execution No.: {0}", i);
                        Console.WriteLine($"----------------------------------------");

                        var tenants = tenantFaker.Generate(1);

                        Console.ForegroundColor = ConsoleColor.Green;
                        Console.WriteLine("Tenants Generated for batch: {0}", tenants.Count);
                        Console.ResetColor();

                        context.Tenants.AddRange(tenants);

                        context.SaveChanges();

                        Console.ForegroundColor = ConsoleColor.Green;
                        Console.WriteLine($"------------------------------------");
                        Console.WriteLine("Batch Execution Completed: Batch No.: {0}", i);
                        Console.WriteLine($"------------------------------------");
                        Console.ResetColor();
                    }
                });
            }
        }

        public static List<TenantUser> GenerateTenantUsers(int count = 1)
        {
            var tenantUserFaker = new Faker<TenantUser>()
                                      .RuleFor(x => x.User, f => GenerateUsers().FirstOrDefault());

            return tenantUserFaker.Generate(count);
        }

        private static User GenerateRootUser()
        {
            var user = GenerateUsers().FirstOrDefault();

            user.PasswordHash = PasswordHasher.HashPassword(user, "@RxD@123");
            user.EmailConfirmed = true;
            user.AccessFailedCount = 0;
            user.LockoutEnd = null;
            user.LockoutEnabled = true;
            user.PhoneNumber = "+91-8886014996";
            user.PhoneNumberConfirmed = true;
            user.Email = "rajeshdonepudi1@mailinator.com";
            user.NormalizedEmail = user.Email.ToUpper();
            user.IsActive = true;
            user.IsDeleted = false;

            return user;
        }

        public static List<ApplicationRole> GetSecurityRoles()
        {
            var roles = new List<ApplicationRole>()
            {
                new ApplicationRole
                {
                    Name = SecurityRoles.GOD,
                    CreatedOn = DateTime.UtcNow,
                    NormalizedName = SecurityRoles.GOD.ToUpper(),
                }
            };

            return roles;
        }

        public static List<Setting> GetPredefinedSettingsForTenant()
        {
            var predefinedSettings = new List<Setting>
            {
                new Setting
                {
                   SettingType = SettingTypeEnum.Predefined,
                   Name =  TenantPredefinedSettingEnum.SecretKey.GetDisplayName(),
                   Value = "{1FCDEAF2-8F9B-46DD-BCFA-01A3B1AAC883}-++_+()<->!@#$%^&*()-{1FCDEAF2-8F9B-46DD-BCFA-01A3B1AAC883}"
                },
                new Setting
                {
                   SettingType = SettingTypeEnum.Predefined,
                   Name =  TenantPredefinedSettingEnum.TokenLifetimeInMinutes.GetDisplayName(),
                   Value = "100"
                },
                new Setting
                {
                   SettingType = SettingTypeEnum.Predefined,
                   Name =  TenantPredefinedSettingEnum.RefreshTokenLifetimeInDays.GetDisplayName(),
                   Value = "7"
                }
            };

            return predefinedSettings;
        }

        public static List<User> GenerateUsers(int count = 1)
        {
            var userFaker = new Faker<User>()
                            .RuleFor(u => u.UserName, f => f.Random.Guid().ToString())
                            .RuleFor(u => u.NormalizedUserName, (f, u) => u?.UserName?.ToUpper())
                            .RuleFor(u => u.Email, (f, u) => f.Person.Email)
                            .RuleFor(u => u.NormalizedEmail, (f, u) => u?.Email?.ToUpper())
                            .RuleFor(u => u.EmailConfirmed, f => f.Random.Bool())
                            .RuleFor(u => u.PasswordHash, f => f.Internet.Password())
                            .RuleFor(u => u.SecurityStamp, f => f.Random.Guid().ToString())
                            .RuleFor(u => u.ConcurrencyStamp, f => f.Random.Guid().ToString())
                            .RuleFor(u => u.PhoneNumber, f => f.Person.Phone)
                            .RuleFor(u => u.PhoneNumberConfirmed, f => f.Random.Bool())
                            .RuleFor(u => u.TwoFactorEnabled, f => f.Random.Bool())
                            .RuleFor(u => u.LockoutEnd, f => f.Date.Future())
                            .RuleFor(u => u.LockoutEnabled, f => f.Random.Bool())
                            .RuleFor(u => u.AccessFailedCount, f => f.Random.Number(0, 5))
                            .RuleFor(u => u.FirstName, f => f.Person.FirstName)
                            .RuleFor(u => u.LastName, f => f.Person.LastName)
                            .RuleFor(u => u.MiddleName, f => f.Person.FirstName)
                            .RuleFor(u => u.Gender, f => f.PickRandom<GenderEnum>())
                            .RuleFor(u => u.MaritalStatus, f => f.PickRandom<MaritalStatusEnum>())
                            .RuleFor(u => u.BloodGroup, f => f.PickRandom<BloodGroupTypeEnum>())
                            .RuleFor(u => u.PhysicallyChallenged, f => f.Random.Bool())
                            .RuleFor(u => u.DateOfBirth, f => f.Date.Past())
                            .RuleFor(u => u.IsActive, f => f.Random.Bool())
                            .RuleFor(u => u.ModifiedOn, f => f.Date.Past())
                            .RuleFor(u => u.CreatedOn, f => DateTime.UtcNow)
                            .RuleFor(u => u.ProfilePictureId, f => f.Random.Guid())
                            .RuleFor(t => t.ProfilePicture, (f, p) => new Image
                            {
                                Data = Encoding.UTF8.GetBytes(f.Image.PicsumUrl()),
                                Title = f.Name.Random.AlphaNumeric(9)
                            });

            return userFaker.Generate(count);
        }
    }
}
