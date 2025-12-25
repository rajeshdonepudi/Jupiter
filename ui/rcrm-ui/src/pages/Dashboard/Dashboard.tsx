import AppMetricCard from "@/components/ui-components/AppMetricCard";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import AppLoader from "@/components/ui-components/AppLoader";
import React, { useEffect, useRef, useState } from "react";
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
  Line,
  Area,
  AreaChart,
} from "recharts";
import AppConstants from "@/constants/constants";
import { UserCreatedByYear } from "@/models/Users/reports/UsersCreatedByYear";
import EnvUtilities from "@/utilities/EnvUtilities";
import Grid from "@mui/material/Grid2";
import AppPaper from "@/components/ui-components/AppPaper";
import AppPage from "@/components/ui-components/AppPage";
import AppChartSkeleton from "@/components/ui-components/AppChartSkeleton";

// 👇 Add this type near the top of Dashboard.tsx
type ChartConfig = {
  id: string;
  render: (loading: boolean) => React.ReactNode;
};

// 1) Combo Chart Data
const userTraffic = [
  { month: "Jan", signups: 120, logins: 450 },
  { month: "Feb", signups: 190, logins: 520 },
  { month: "Mar", signups: 140, logins: 480 },
  { month: "Apr", signups: 220, logins: 610 },
  { month: "May", signups: 260, logins: 700 },
  { month: "Jun", signups: 300, logins: 820 },
];

// 2) Area Chart – last 12 months
const last12Months = [
  { month: "Jul", users: 120 },
  { month: "Aug", users: 135 },
  { month: "Sep", users: 160 },
  { month: "Oct", users: 180 },
  { month: "Nov", users: 210 },
  { month: "Dec", users: 250 },
  { month: "Jan", users: 290 },
  { month: "Feb", users: 310 },
  { month: "Mar", users: 330 },
  { month: "Apr", users: 365 },
  { month: "May", users: 420 },
  { month: "Jun", users: 480 },
];

// 3) Stacked Role Distribution
const roleDistribution = [
  { role: "Admin", active: 30, inactive: 10 },
  { role: "Manager", active: 65, inactive: 20 },
  { role: "User", active: 500, inactive: 60 },
];

// 4) Completion Gauge
const completionScore = 78; // %

// 5) User activity by day of week × hour
const activityHeatmap = [
  { day: "Mon", hour: "9", value: 20 },
  { day: "Mon", hour: "12", value: 40 },
  { day: "Mon", hour: "18", value: 55 },
  { day: "Tue", hour: "9", value: 30 },
  { day: "Tue", hour: "12", value: 70 },
  { day: "Tue", hour: "18", value: 20 },
  // add more rows if needed
];

// 6) Funnel stages
const funnelData = [
  { stage: "Visited", value: 1200 },
  { stage: "Signup Started", value: 850 },
  { stage: "Email Verified", value: 600 },
  { stage: "Profile Completed", value: 450 },
  { stage: "Active User", value: 320 },
];

const UserComboChart = ({ loading }: { loading: boolean }) => {
  if (loading) return <AppChartSkeleton height={AppConstants.CHART_HEIGHT} />;

  return (
    <AppPaper>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Signups vs Logins (Monthly)
      </Typography>

      <ResponsiveContainer width="100%" height={AppConstants.CHART_HEIGHT}>
        <BarChart data={userTraffic}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <CTooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="signups" fill="#42A5F5" />
          <Bar yAxisId="left" dataKey="logins" fill="#66BB6A" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="logins"
            stroke="#EF5350"
            strokeWidth={2}
          />
        </BarChart>
      </ResponsiveContainer>
    </AppPaper>
  );
};

const UserAreaChart = ({ loading }: { loading: boolean }) => {
  if (loading) return <AppChartSkeleton height={300} />;

  return (
    <AppPaper>
      <Typography variant="h6" sx={{ mb: 2 }}>
        User Growth (Last 12 Months)
      </Typography>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={last12Months}>
          <defs>
            <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
              <stop offset="20%" stopColor="#1976D2" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1976D2" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <XAxis dataKey="month" />
          <YAxis />
          <CTooltip />
          <CartesianGrid strokeDasharray="3 3" />

          <Area
            type="monotone"
            dataKey="users"
            stroke="#1976D2"
            fillOpacity={1}
            fill="url(#colorUser)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </AppPaper>
  );
};

const RoleStackedChart = ({ loading }: { loading: boolean }) => {
  if (loading) return <AppChartSkeleton height={250} />;

  return (
    <AppPaper>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Role Distribution
      </Typography>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={roleDistribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="role" />
          <YAxis />
          <CTooltip />
          <Legend />
          <Bar dataKey="active" stackId="a" fill="#4CAF50" />
          <Bar dataKey="inactive" stackId="a" fill="#FFC107" />
        </BarChart>
      </ResponsiveContainer>
    </AppPaper>
  );
};

import { RadialBarChart, RadialBar } from "recharts";

const UserGaugeChart = ({ loading }: { loading: boolean }) => {
  if (loading) return <AppChartSkeleton height={240} />;

  return (
    <AppPaper>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Profile Completion Score
      </Typography>

      <ResponsiveContainer width="100%" height={260}>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          barSize={15}
          data={[{ name: "Score", value: completionScore, fill: "#3F51B5" }]}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            background
            cornerRadius={15} // smooth rounded end
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <Typography variant="h4" textAlign="center" sx={{ mt: -6 }}>
        {completionScore}%
      </Typography>
    </AppPaper>
  );
};

const ActivityHeatmap = ({ loading }: { loading: boolean }) => {
  if (loading) return <AppChartSkeleton height={260} />;

  return (
    <AppPaper>
      <Typography variant="h6" sx={{ mb: 2 }}>
        User Login Activity
      </Typography>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={activityHeatmap} layout="vertical">
          <CartesianGrid strokeDasharray="2 2" />
          <YAxis dataKey="day" type="category" />
          <XAxis dataKey="value" type="number" />
          <CTooltip />
          <Bar dataKey="value">
            {activityHeatmap.map((e, i) => (
              <Cell key={i} fill={`rgba(33,150,243, ${e.value / 100})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </AppPaper>
  );
};

import { FunnelChart, Funnel, LabelList } from "recharts";
import SortableChartGrid from "@/components/ui-components/SortableChartGrid";

import { deepPurple, blue, green, amber, pink } from "@mui/material/colors";

const funnelMuiColors = [
  deepPurple[400],
  blue[400],
  green[400],
  amber[400],
  pink[400],
];

const UserFunnelChart = ({ loading }: { loading: boolean }) => {
  if (loading) return <AppChartSkeleton height={300} />;

  return (
    <AppPaper>
      <Typography variant="h6" sx={{ mb: 2 }}>
        User Conversion Funnel
      </Typography>

      <ResponsiveContainer width="100%" height={330}>
        <FunnelChart>
          <CTooltip />

          <Funnel
            isAnimationActive
            data={funnelData}
            dataKey="value"
            // Helps spacing visually
            stroke="#fff"
            strokeWidth={2}
          >
            {funnelData.map((step, index) => (
              <Cell
                key={index}
                fill={funnelMuiColors[index % funnelMuiColors.length]}
              />
            ))}

            <LabelList
              position="right"
              fill="#000"
              stroke="none"
              dataKey="stage"
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </AppPaper>
  );
};

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

  // ✅ new
  const [charts, setCharts] = useState<ChartConfig[]>([
    {
      id: "combo",
      render: (loading) => <UserComboChart loading={loading} />,
    },
    {
      id: "area",
      render: (loading) => <UserAreaChart loading={loading} />,
    },
    {
      id: "roles",
      render: (loading) => <RoleStackedChart loading={loading} />,
    },
    {
      id: "gauge",
      render: (loading) => <UserGaugeChart loading={loading} />,
    },
    {
      id: "heat",
      render: (loading) => <ActivityHeatmap loading={loading} />,
    },
    {
      id: "funnel",
      render: (loading) => <UserFunnelChart loading={loading} />,
    },
  ]);

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

          <Grid size={{ xs: 12 }}>
            <SortableChartGrid
              charts={charts}
              setCharts={setCharts}
              loading={!userDashboardInfo}
            />
          </Grid>
        </Grid>
      }
    ></AppPage>
  );
};

export default Dashboard;
