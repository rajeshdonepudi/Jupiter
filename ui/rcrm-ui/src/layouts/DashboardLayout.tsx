import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import {
  Avatar,
  Collapse,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HubIcon from "@mui/icons-material/Hub";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import Toolbar from "@mui/material/Toolbar";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { MenuActions } from "../enumerations/Layouts/MenuActionsEnum";
import RouteGuard from "../guards/RouteGuard";
import AuthUtilities from "../utilities/AuthUtilities";
import { useSelector } from "react-redux";
import { logout } from "../store/Slices/authSlice";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { ToastContainer } from "react-toastify";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import { GroupedMenuItem } from "@/models/Common/GroupedMenuItem";
import PieChartOutlinedIcon from "@mui/icons-material/PieChartOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import HiveOutlinedIcon from "@mui/icons-material/HiveOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import DomainIcon from "@mui/icons-material/Domain";
import PersonIcon from "@mui/icons-material/Person";
import PollIcon from "@mui/icons-material/Poll";
import EmailIcon from "@mui/icons-material/Email";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PaymentsIcon from "@mui/icons-material/Payments";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import {
  closeDrawer,
  groupCollapsed,
  groupExpanded,
  openDrawer,
  setLastSelectedMenuItem,
} from "@/store/Slices/commonSlice";

import { Drawer } from "@/components/styled/Drawer";
import { AppBar } from "@/components/styled/AppBar";
import { DrawerHeader } from "@/components/styled/DrawerHeader";
import "react-toastify/dist/ReactToastify.css";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import AppBatteryStatus from "@/components/ui-components/AppBatteryStatus";
import lightLogo from "@/assets/logo/falconone-high-resolution-logo-transparent.png";
import darkLogo from "@/assets/logo/falconone-high-resolution-logo-transparent_white.png";
import NavUtilities from "@/utilities/NavUtilities";

export enum FeatureIdentifier { }

export default function DashboardLayout() {
  /***
   * Hook's
   * **/
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loggedInUser = useSelector((state: any) => state.auth);

  /****
   * Selector's
   * **/
  const tenantInfo = useAppSelector((state) => state.tenant.tenantInfo);
  const commonState = useAppSelector((state) => state.common);

  const onLogOut = () => {
    AuthUtilities.logoutUser();
    dispatch(logout());
  };

  const avatarMenuItems = [
    {
      url: "",
      displayText: `Hello ${loggedInUser.firstName} ${loggedInUser.lastName}!`,
      icon: <PersonIcon />,
      action: MenuActions.NoAction,
    },
    {
      url: "/secure/profile",
      displayText: "Profile",
      action: MenuActions.Profile,
      icon: <AccountCircleRoundedIcon />,
    },
    {
      url: "/secure/settings",
      displayText: "Settings",
      action: MenuActions.Settings,
      icon: <SettingsRoundedIcon />,
    },
    {
      url: undefined,
      displayText: "Logout",
      action: MenuActions.Logout,
      actionHandler: onLogOut,
      icon: <LogoutRoundedIcon />,
    },
  ];

  const groupedMenuItems: GroupedMenuItem[] = [
    {
      groupId: 9,
      groupName: "Surveys",
      icon: <PollIcon />,
      items: [
        {
          url: "/secure/survey/questions",
          displayText: "Questions",
          icon: <QuestionAnswerOutlinedIcon />,
          menuId: 16,
        },
        {
          url: "/secure/survey/question-banks",
          displayText: "Question Banks",
          icon: <PollIcon />,
          menuId: 17,
        },
      ],
    },
    {
      groupId: 11,
      groupName: "Expenses",
      icon: <PaymentsIcon />,
      items: [
        {
          url: "/secure/expenses",
          displayText: "Dashboard",
          icon: <PieChartOutlinedIcon />,
          menuId: 18,
        },
        {
          url: "/secure/expenses/my",
          displayText: "My Expenses",
          icon: <CurrencyRupeeOutlinedIcon />,
          menuId: 19,
        },
        {
          url: "/secure/expenses/categories",
          displayText: "Expense Categories",
          icon: <ReceiptOutlinedIcon />,
          menuId: 20,
        },
      ],
    },
    {
      groupId: 12,
      groupName: "CRM",
      icon: <HubIcon />,
      items: [
        {
          displayText: "Dashboard",
          url: "/secure/crm",
          icon: <DashboardOutlinedIcon />,
          menuId: 21,
        },
        {
          displayText: "Leads",
          url: "/secure/crm/leads",
          icon: <PersonSearchOutlinedIcon />,
          menuId: 22,
        },
      ],
    },
  ];

  const onDrawerOpen = () => {
    dispatch(openDrawer());
  };

  const onDrawerClose = () => {
    dispatch(closeDrawer());
  };

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleAppropriateAction = (action: number) => {
    switch (action) {
      case MenuActions.Logout:
        onLogOut();
        break;
    }
  };

  const handleCloseUserMenu = (setting: any) => {
    setAnchorElUser(null);
    if (setting.url && setting.action !== MenuActions.NoAction) {
      navigate(setting.url);
    } else {
      handleAppropriateAction(setting.action);
    }
  };

  const onGroupSelected = (groupId: number) => {
    if (!commonState.isDrawerOpen) {
      dispatch(openDrawer());
    }

    if (
      commonState.isDrawerOpen &&
      commonState.expandedGroupIds.includes(groupId)
    ) {
      dispatch(groupCollapsed(groupId));
    } else {
      dispatch(groupExpanded(groupId));
    }
  };

  const onMenuSelected = (menuId: number) => {
    dispatch(setLastSelectedMenuItem(menuId));
  };

  //heap?.identify(`${loggedInUser.firstName} ${loggedInUser.lastName}`);

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={commonState.isDrawerOpen}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={onDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(commonState.isDrawerOpen && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              sx={{ flexGrow: 1 }}
              variant="body1"
              noWrap
              component="div"
            >
              {tenantInfo.name}
            </Typography>
            <Box sx={{ margin: "1rem" }}>
              <AppBatteryStatus />
            </Box>
            <Box>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Semy Sharp"
                    src={`data:image/gif;base64,${loggedInUser.profilePicture}`}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {avatarMenuItems.map((setting) => (
                  <>
                    <MenuItem
                      disableRipple={
                        setting.action === MenuActions.NoAction ? true : false
                      }
                      key={setting.url}
                      onClick={(e: any) => handleCloseUserMenu(setting)}
                    >
                      {setting.action !== MenuActions.NoAction && (
                        <ListItemIcon>{setting.icon}</ListItemIcon>
                      )}
                      <Typography textAlign="center">
                        {setting.displayText}
                      </Typography>
                    </MenuItem>
                    {setting.action === MenuActions.NoAction && <Divider />}
                  </>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={commonState.isDrawerOpen}>
          <DrawerHeader
            sx={{
              display: "flex",
              justifyContent: "center", // Center content horizontally
              alignItems: "center", // Center content vertically
              position: "relative", // Allows positioning the IconButton independently
              padding: "0 16px", // Optional padding
            }}
          >
            {commonState.isDrawerOpen && (
              <img
                onClick={() => navigate(NavUtilities.ToSecureArea("dashboard"))}
                alt="falconone-logo"
                width={"170px"}
                src={theme.palette.mode === "dark" ? darkLogo : lightLogo}
              />
            )}

            <IconButton
              onClick={onDrawerClose}
              sx={{
                position: "absolute",
                right: 0, // Place IconButton at the far right
              }}
            >
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItemButton
              href="/secure/dashboard"
              sx={{
                minHeight: 48,
                justifyContent: commonState.isDrawerOpen ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: commonState.isDrawerOpen ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <DashboardCustomizeRoundedIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={"Dashboard"}
                sx={{ opacity: commonState.isDrawerOpen ? 1 : 0 }}
              />
            </ListItemButton>

            {groupedMenuItems.map((group, groupIndex) => {
              return (
                <>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: commonState.isDrawerOpen
                        ? "initial"
                        : "center",
                      px: 2.5,
                    }}
                    onClick={() => onGroupSelected(group.groupId)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: commonState.isDrawerOpen ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {group.icon}
                    </ListItemIcon>
                    <ListItemText
                      sx={{ opacity: commonState.isDrawerOpen ? 1 : 0 }}
                      primary={group.groupName}
                    />
                    {commonState.isDrawerOpen &&
                      (commonState.expandedGroupIds.includes(group.groupId) ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      ))}
                  </ListItemButton>
                  {groupIndex !== groupedMenuItems.length - 1 && <Divider />}
                  {group.items.map((groupItem, itemIndex) => {
                    return (
                      <Collapse
                        in={commonState.expandedGroupIds.includes(
                          group.groupId
                        )}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          <ListItemButton
                            selected={
                              commonState.lastSelectedMenuItem ===
                              groupItem.menuId
                            }
                            onClick={() => onMenuSelected(groupItem.menuId)}
                            sx={{
                              minHeight: 48,
                              justifyContent: commonState.isDrawerOpen
                                ? "initial"
                                : "center",
                              pl: 4,
                            }}
                            href={groupItem.url}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: commonState.isDrawerOpen ? 3 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              {groupItem.icon}
                            </ListItemIcon>
                            <ListItemText primary={groupItem.displayText} />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    );
                  })}
                </>
              );
            })}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            width: "100%",
            overflowX: "hidden",
            height: "100%",
            marginTop: "3.5rem",
          }}
        >
          {(<RouteGuard />) as any}
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Box>
      </Box>
    </Box>
  );
}
