import ThemesList from "@/components/features/Theme/ThemesList";
import UpsertThemeForm from "@/components/features/Theme/UpsertThemeForm";
import AppLoader from "@/components/ui-components/AppLoader";
import AppModal from "@/components/ui-components/AppModal";
import { UpsertSiteTheme } from "@/models/Theme/UpsertSiteTheme";
import {
  useAddThemeMutation,
  useDeleteThemeMutation,
  useGetAllThemesQuery,
  useLazyGetPrimaryThemeQuery,
  useUpdateThemeMutation,
} from "@/services/Theme/ThemeService";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateTheme } from "@slices/themeSlice";
import { SiteTheme } from "@/models/Theme/SiteTheme";
import { useFormik } from "formik";
import { ThemePreferenceEnum } from "@/enumerations/Theme/ThemePreferenceEnum";
import AddThemeValidationScheme from "@/validation-schemes/Site-settings/AddThemeValidationScheme";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import AppConstants from "@/constants/constants";
import AppPage from "@/components/ui-components/AppPage";
import ThemeListTable from "@/components/features/Theme/ThemeListTable";
const pageActions = {
  ADD_THEME: "ADD_THEME",
  UPDATE_THEME: "UPDATE_THEME",
  DELETE_THEME: "DELETE_THEME",
  SET_PRIMARY_THEME: "SET_PRIMARY_THEME",
};

const initialState: {
  action: string;
  popup: {
    visible: boolean;
  };
  data: any;
} = {
  action: "",
  popup: {
    visible: false,
  },
  data: undefined,
};

const ManageSiteTheme = () => {
  const { t: commonLocale } = useTranslation();
  const { data: themes, isLoading } = useGetAllThemesQuery(null);
  const [getPrimaryTheme] = useLazyGetPrimaryThemeQuery();
  const [addTheme] = useAddThemeMutation();
  const [updateThemeMutation] = useUpdateThemeMutation();
  const [deleteTheme] = useDeleteThemeMutation();
  const dispatchTheme = useDispatch();

  const [pageActionsState, setPageActionsState] = useState(initialState);
  const persistedTheme = useSelector((state: any) => state.theme.siteTheme);

  const getPageActionInfo = () => {
    switch (pageActionsState.action) {
      case pageActions.ADD_THEME:
      case pageActions.UPDATE_THEME:
        return {
          view: (
            <UpsertThemeForm formik={formik} onSubmit={buildThemeSetting} />
          ),
          title:
            pageActionsState.action === pageActions.ADD_THEME
              ? "Add Theme"
              : "Update Theme",
          okButtonText:
            pageActionsState.action === pageActions.ADD_THEME
              ? "Add"
              : "Update",
        };
      case pageActions.DELETE_THEME:
        return {
          view: (
            <Typography variant="body1">
              Are you sure you want to delete the theme?
            </Typography>
          ),
          title: "Delete Theme",
          okButtonText: "Delete",
        };
      case pageActions.SET_PRIMARY_THEME:
    }
  };

  const onConfirm = () => {
    switch (pageActionsState.action) {
      case pageActions.ADD_THEME:
      case pageActions.UPDATE_THEME:
        formik.submitForm();
        break;
      case pageActions.DELETE_THEME:
        deleteTheme(pageActionsState.data)
          .then(() => {
            dispatchNewTheme();
          })
          .then(() => {
            onCancel();
          });
        break;
    }
  };

  const onCancel = () => {
    setPageActionsState(initialState);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      id: null,
      primaryColor: " ",
      secondaryColor: " ",
      themePreference: ThemePreferenceEnum.NotSpecified,
      isPrimary: false,
      fontFamily: "",
    },
    validationSchema: AddThemeValidationScheme,
    onSubmit: (payload, helpers) => {
      buildThemeSetting(payload);
    },
  });

  const dispatchNewTheme = () => {
    getPrimaryTheme(null, false)
      .unwrap()
      .then((res) => {
        dispatchTheme(
          updateTheme({
            primary: res.data.primaryColor,
            secondary: res.data.secondaryColor,
            themePreference: res.data.themePreference,
            isPrimary: res.data.isPrimary,
            id: res.data.id,
            fontFamily: res.data.fontFamily,
          })
        );
      });
  };

  const buildThemeSetting = async (config: any) => {
    const theme: UpsertSiteTheme = {
      id: config.id,
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      themePreference: Number(config.themePreference),
      isPrimary: config.isPrimary,
      fontFamily: config.fontFamily,
    };

    if (theme.id) {
      updateThemeMutation(theme)
        .unwrap()
        .then(() => {
          dispatchNewTheme();
        })
        .then(() => {
          onCancel();
        });
    } else {
      addTheme(theme)
        .unwrap()
        .then(() => {
          dispatchNewTheme();
        })
        .then(() => {
          onCancel();
        });
    }
  };

  const onEditTheme = (data: SiteTheme) => {
    formik.setValues({
      primaryColor: data?.primaryColor,
      secondaryColor: data?.secondaryColor,
      themePreference: data?.themePreference,
      isPrimary: data?.isPrimary,
      id: data.id as any,
      fontFamily: data?.fontFamily,
    });
    setPageActionsState({
      action: pageActions.UPDATE_THEME,
      popup: {
        visible: true,
      },
      data: undefined,
    });
  };

  const onAddThemeClicked = () => {
    setPageActionsState({
      action: pageActions.ADD_THEME,
      popup: {
        visible: true,
      },
      data: undefined,
    });
  };

  const onDeleteTheme = (themeId: string) => {
    setPageActionsState({
      action: pageActions.DELETE_THEME,
      popup: {
        visible: true,
      },
      data: themeId,
    });
  };

  return (
    <AppPage
      rightHeaderActions={
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={AppConstants.layout.StandardSpacing}
        >
          <Stack alignItems="flex-end" direction={"row"} spacing={0.8}>
            <Button
              onClick={onAddThemeClicked}
              variant="contained"
              sx={{ width: "fit-content" }}
              startIcon={<AddOutlinedIcon />}
            >
              {`${commonLocale("add")} ${commonLocale("theme")}`}
            </Button>
            <Button
              onClick={() => dispatchNewTheme()}
              variant="outlined"
              sx={{ width: "fit-content" }}
              startIcon={<RefreshOutlinedIcon />}
            >
              {`Refresh theme`}
            </Button>
          </Stack>
        </Stack>
      }
      content={
        <>
          {Array.from(themes?.data ?? []).length > 0 ? (
            <>
              {/* <ThemesList
                onDeleteTheme={onDeleteTheme}
                onEditTheme={onEditTheme}
                themes={themes?.data ?? []}
              /> */}

              <ThemeListTable
                onDeleteTheme={onDeleteTheme}
                onEditTheme={onEditTheme}
                rows={themes?.data ?? []}
              />
            </>
          ) : (
            <Stack alignItems={"center"} justifyContent={"center"}>
              <Typography sx={{ position: "absolute" }} variant="body2">
                No Themes Available
              </Typography>
            </Stack>
          )}

          <AppModal
            modalTitle={getPageActionInfo()?.title}
            show={pageActionsState.popup.visible}
            okButtonText={getPageActionInfo()?.okButtonText}
            handleOk={onConfirm}
            handleClose={onCancel}
          >
            <>{getPageActionInfo()?.view}</>
          </AppModal>
        </>
      }
    ></AppPage>
  );
};

export default ManageSiteTheme;
