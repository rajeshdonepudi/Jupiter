using Jupiter.BLL.Interfaces;
using Jupiter.BLL.Services;
using Jupiter.DAL;
using Jupiter.DAL.Contracts;
using Jupiter.Helpers.Helpers;
using Jupiter.Models.EntityContracts;
using Microsoft.AspNetCore.Identity;

namespace Jupiter.API.Config
{
    public static class DependencyConfig
    {
        public static void Configure(WebApplicationBuilder builder)
        {
            builder.Services.AddScoped<IAccountService, AccountService>();
            builder.Services.AddScoped<ITenantProvider, TenantProvider>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<ITokenService, TokenService>();
            builder.Services.AddScoped<IAppConfigService, AppConfigService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IRoleService, RoleService>();
            builder.Services.AddScoped<IAdvancedSettingsService, AdvancedSettingsService>();
            builder.Services.AddScoped<IPasswordHasher<object>, PasswordHasher<object>>();
            builder.Services.AddScoped<IAppThemeService, AppThemeService>();
            builder.Services.AddScoped<ITenantService, TenantService>();
            builder.Services.AddScoped<IUserLookupService, UserLookupService>();
            builder.Services.AddScoped<IPermissionService, PermissionService>();
            builder.Services.AddScoped<ISecurityGroupService, SecurityGroupService>();
            builder.Services.AddScoped<IQuestionService, QuestionService>();
            builder.Services.AddScoped<IQuestionBankService, QuestionBankService>();
            builder.Services.AddScoped<IExpenseService, ExpenseService>();
            builder.Services.AddScoped<IExpenseCategoryService, ExpenseCategoryService>();
            builder.Services.AddScoped<ITokenValidationService, TokenValidationService>();

            builder.Services.AddScoped<IQRCodeService, QRCodeService>();
            builder.Services.AddScoped<ITagService, TagService>();
            builder.Services.AddScoped<ILeadService, LeadService>();


            // Singleton services
            builder.Services.AddSingleton<CacheHelper>();
            builder.Services.AddSingleton<ILoggerService, LoggerService>();

            // Transient services
            builder.Services.AddTransient(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        }
    }
}
