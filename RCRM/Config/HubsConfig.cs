using Jupiter.BLL.Hubs.Dashboards;
using Jupiter.BLL.Hubs.Meeting;
using Jupiter.Security;

namespace Jupiter.API.Config
{
    public static class HubsConfig
    {
        public static void Configure(WebApplication app)
        {
            app.MapHub<UserDashboardHub>("hubs/user-dashboard").RequireCors(CORSPolicy.ReactAppPolicy);
            app.MapHub<MeetingHubBasic>("hubs/meeting/pro").RequireCors(CORSPolicy.ReactAppPolicy);
            app.MapHub<MeetingHubBasicV2>("hubs/meeting/v2").RequireCors(CORSPolicy.ReactAppPolicy);
        }
    }
}
