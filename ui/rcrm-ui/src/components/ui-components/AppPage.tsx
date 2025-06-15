import { FC, lazy, ReactNode } from "react";
import AppLoader from "@ui-components/AppLoader";
import { useSelector } from "react-redux";
import AppConstants from "@/constants/constants";
const Stack = lazy(() => import("@mui/material/Stack"));
const Typography = lazy(() => import("@mui/material/Typography"));
import Grid from "@mui/material/Grid2";
interface AppPageProps {
  title?: string;
  content: ReactNode;
  rightHeaderActions?: ReactNode;
  pageAlerts?: ReactNode;
}

const AppPage: FC<AppPageProps> = ({
  title,
  content,
  rightHeaderActions,
  pageAlerts,
}) => {
  const themeStore = useSelector((state: any) => state.theme.siteTheme);

  return (
    <>
      <Grid container spacing={AppConstants.layout.StandardSpacing}>
        {pageAlerts && <Grid size={{ xs: 12, md: 12 }}>{pageAlerts}</Grid>}
        <Grid size={{ xs: 12, md: 12 }}>
          <Stack
            direction={"row"}
            flexWrap={"wrap"}
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Typography
              style={{
                borderLeft: `5px solid ${themeStore?.primaryColor}`,
                paddingLeft: "12px",
              }}
              variant="h6"
            >
              {title}
            </Typography>
            {rightHeaderActions}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>{content}</Grid>
      </Grid>
    </>
  );
};

export default AppPage;
