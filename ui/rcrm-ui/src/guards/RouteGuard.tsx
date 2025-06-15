import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectAuth } from "../store/Slices/authSlice";
import { useSelector } from "react-redux";
import { Box, Drawer, Paper, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import { openRightDrawer, closeRightDrawer } from "@/store/Slices/commonSlice";
import { useEffect, useRef } from "react";
import EnvUtilities from "@/utilities/EnvUtilities";
import * as signalR from "@microsoft/signalr";
import AppLoader from "@/components/ui-components/AppLazyLoader";

const RouteGuard = (): any => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(selectAuth);
  const dispatch = useAppDispatch();
  const commonState = useAppSelector((state) => state.common);

  if (isAuthenticated) {
    return (
      <Stack>
        <AppLoader>
          <Outlet />
        </AppLoader>
        {commonState.drawerContent && (
          <Drawer
            hideBackdrop={false}
            anchor={"right"}
            open={commonState.isRightDrawerOpen}
            onClose={() => {
              dispatch(closeRightDrawer());
            }}
          >
            <Box sx={{ width: "300px", marginTop: "4rem", padding: "0.5rem" }}>
              <Paper>
                <div>{commonState?.drawerContent}</div>
              </Paper>
            </Box>
          </Drawer>
        )}
      </Stack>
    );
  }
  return <Navigate to="/login" replace state={{ from: location }} />;
};

export default RouteGuard;
