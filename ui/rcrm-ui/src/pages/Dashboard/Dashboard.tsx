import AppMetricCard from "@/components/ui-components/AppMetricCard";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import AppLoader from "@/components/ui-components/AppLoader";
import { useEffect, useRef, useState } from "react";
import SocketUtilities from "@/utilities/SocketUtilities";
import { HubConnectionState } from "@microsoft/signalr";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { UserDashboardInfoModel } from "@/models/Users/UserDashboardInfoModel";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as CTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import AppConstants from "@/constants/constants";
import { UserCreatedByYear } from "@/models/Users/reports/UsersCreatedByYear";
import EnvUtilities from "@/utilities/EnvUtilities";
import Grid from "@mui/material/Grid2";
import AppPaper from "@/components/ui-components/AppPaper";
import AppPage from "@/components/ui-components/AppPage";

const Dashboard = () => {
  const [userDashboardInfo, setUserCount] =
    useState<UserDashboardInfoModel | null>(null);

  const [usersCreatedOverYears, setUsersCreatedOverYears] = useState<
    UserCreatedByYear[]
  >([]);

  let testConnection = useRef<signalR.HubConnection>(
    SocketUtilities.getConnection(
      `${EnvUtilities.GetApiRootURL("hubs/user-dashboard")}`
    )
  );

  useEffect(() => {
    if (testConnection.current.state === HubConnectionState.Disconnected) {
      testConnection.current.start();
    }
  }, [testConnection]);

  testConnection.current.on("SEND_USER_METRIC_INFO", (response) => {
    setUserCount(response);
  });

  testConnection.current.on("SEND_USER_CREATED_OVER_YEARS", (response) => {
    setUsersCreatedOverYears(response);
  });

  return (
    <AppPage
      title="Dashboard"
      content={
        <Grid container spacing={0.8}>
          <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
            <AppMetricCard
              icon={PersonIcon}
              color="#FF4E88"
              count={userDashboardInfo?.totalUsers ?? 0}
              title="Total Users"
            />
          </Grid>
          <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
            <AppMetricCard
              icon={VerifiedUserIcon}
              color="#508D4E"
              count={userDashboardInfo?.verifiedUsers ?? 0}
              title="Verified Users"
            />
          </Grid>
          <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
            <AppMetricCard
              icon={ToggleOnIcon}
              color="#9BCF53"
              count={userDashboardInfo?.activeUsers ?? 0}
              title="Active Users"
            />
          </Grid>
          <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
            <AppMetricCard
              icon={ToggleOffIcon}
              color="#FF0000"
              count={userDashboardInfo?.deactivatedUsers ?? 0}
              title="Disabled Users"
            />
          </Grid>
          <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
            <AppMetricCard
              icon={LockIcon}
              color="#F3CA52"
              count={userDashboardInfo?.lockedUsers ?? 0}
              title="Locked Users"
            />
          </Grid>
          <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
            <AppMetricCard
              icon={CloseIcon}
              color="#1679AB"
              count={userDashboardInfo?.unVerifiedUsers ?? 0}
              title="Unverified Users"
            />
          </Grid>

          <Grid size={{ sm: 12 }}>
            <AppPaper>
              <CardHeader subheader={"Total Users Created"}></CardHeader>
              <CardContent style={{ height: "100%", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usersCreatedOverYears}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 10,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis name="Year" dataKey="year" />
                    <YAxis />
                    <CTooltip />
                    <Legend />
                    <Bar name="Year" dataKey="totalUsers" fill="#8884d8">
                      {AppConstants.chartColors.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            AppConstants.chartColors[
                              index % AppConstants.chartColors.length
                            ]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </AppPaper>
          </Grid>
        </Grid>
      }
    ></AppPage>
  );
};

export default Dashboard;
