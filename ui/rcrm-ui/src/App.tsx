import {
  Box,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
  useMediaQuery,
} from "@mui/material";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ApiResponse } from "@models/Common/ApiResponse";
const AppRoutes = lazy(() => import("@/routes/AppRoutes"));
import { useLazyGetPrimaryThemeQuery } from "@services/Theme/ThemeService";
import { SiteTheme } from "@models/Theme/SiteTheme";
import { ThemePreferenceEnum } from "@/enumerations/Theme/ThemePreferenceEnum";
import { updateTheme } from "./store/Slices/themeSlice";
import tinycolor from "tinycolor2";
import { useLazyGetTenantInfoQuery } from "./services/Tenant/TenantService";
import { setTenantInfo } from "./store/Slices/tenantSlice";
import AppNoInternet from "./components/ui-components/AppNoInternet";
import AppLoader from "./components/ui-components/AppLoader";

const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const prefersLightMode = useMediaQuery("(prefers-color-scheme: light)");
  const themeStore = useSelector((state: any) => state.theme.siteTheme);
  const tenantStore = useSelector((state: any) => state.tenant.tenantInfo);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Effect to handle online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Add event listeners for online/offline status
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const dispatchTheme = useDispatch();

  const [getSiteTheme] = useLazyGetPrimaryThemeQuery();
  const [getTenantInfo] = useLazyGetTenantInfoQuery();

  const primaryColor = themeStore?.primaryColor;
  const secondaryColor = themeStore?.secondaryColor;
  const themePreference = themeStore?.themePreference;
  const siteName = tenantStore?.name;
  const fontFamily = themeStore?.fontFamily;

  const [siteThemeInfo, setSiteThemeInfo] = useState({
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
    themePreference: themePreference,
    fontFamily: fontFamily,
  });

  useEffect(() => {
    if (!siteName) {
      getTenantInfo(null)
        .unwrap()
        .then((res) => {
          dispatchTheme(setTenantInfo(res.data));
        });
    }
  }, []);

  useEffect(() => {
    if (
      primaryColor === undefined ||
      secondaryColor === undefined ||
      themePreference === undefined
    ) {
      getSiteTheme(null, false)
        .unwrap()
        .then((res: ApiResponse<SiteTheme>) => {
          dispatchTheme(
            updateTheme({
              primaryColor: res.data.primaryColor,
              secondaryColor: res.data.secondaryColor,
              themePreference: res.data.themePreference,
              isPrimary: res.data.isPrimary,
              id: res.data.id,
              fontFamily: res.data.fontFamily,
            })
          );
        });
    } else {
      setSiteThemeInfo({
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        themePreference: themePreference,
        fontFamily: fontFamily,
      });
    }
  }, [
    dispatchTheme,
    fontFamily,
    getSiteTheme,
    primaryColor,
    secondaryColor,
    themePreference,
    themeStore,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getColorPreference = () => {
    switch (siteThemeInfo.themePreference) {
      case ThemePreferenceEnum.Light:
        return "light";
      case ThemePreferenceEnum.Dark:
        return "dark";

      case ThemePreferenceEnum.SystemDefault:
        if (prefersDarkMode) {
          return "dark";
        }
        if (prefersLightMode) {
          return "light";
        }
        break;
      default:
        return "light";
    }
  };

  const systemTheme = useMemo(
    () =>
      createTheme({
        components: {
          MuiCssBaseline: {
            styleOverrides: (themeParam) => ({
              body: {
                backgroundColor:
                  themeParam.palette.mode === "light" ? "#ffffff" : "#121212",
              },
            }),
          },
        },
        typography: {
          fontFamily: siteThemeInfo?.fontFamily,
          caption: {
            fontWeight: 600,
            color: "gray",
          },
        },
        palette: {
          mode: getColorPreference() as any,
          primary: {
            main: tinycolor(
              siteThemeInfo?.primaryColor ?? "#2196f3"
            ).toHexString(),
            light: tinycolor(siteThemeInfo?.primaryColor ?? "#2196f3")
              .lighten(0.6)
              .toHexString(),
            dark: tinycolor(siteThemeInfo?.primaryColor ?? "#2196f3")
              .darken(0.6)
              .toHexString(),
          },
          secondary: {
            main: tinycolor(
              siteThemeInfo?.secondaryColor ?? "#f50057"
            ).toHexString(),
            light: tinycolor(siteThemeInfo?.secondaryColor ?? "#f50057")
              .lighten(0.6)
              .toHexString(),
            dark: tinycolor(siteThemeInfo?.secondaryColor ?? "#f50057")
              .darken(0.6)
              .toHexString(),
          },
          error: {
            main: "#f44336",
          },
        },
      }),
    [
      getColorPreference,
      siteThemeInfo?.fontFamily,
      siteThemeInfo?.primaryColor,
      siteThemeInfo?.secondaryColor,
    ]
  );

  return (
    <>
      <ThemeProvider theme={responsiveFontSizes(systemTheme)}>
        <CssBaseline />
        <GlobalStyles
          styles={(theme) => ({
            "::-webkit-scrollbar": {
              width: "12px",
            },
            "::-webkit-scrollbar-track": {
              background: theme.palette.background.default, // Match scrollbar track color with theme background
            },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.action.active, // Use action color for the scrollbar thumb
              borderRadius: "10px",
              border: `3px solid ${theme.palette.background.default}`,
            },
            "*": {
              scrollbarWidth: "thin",
              scrollbarColor: `${theme.palette.action.active} ${theme.palette.background.default}`,
            },
          })}
        />
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            padding: "1.5rem",
          }}
          className="root-container"
        >
          <BrowserRouter>
            <Suspense fallback={<AppLoader />}>
              {isOnline ? <AppRoutes /> : <AppNoInternet />}
            </Suspense>
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default App;
