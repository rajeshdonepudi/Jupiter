import { lazy, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
const ArrowForwardIcon = lazy(() => import("@mui/icons-material/ArrowForward"));
const DeleteOutlineOutlinedIcon = lazy(
  () => import("@mui/icons-material/DeleteOutlineOutlined")
);
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
const EditOutlinedIcon = lazy(() => import("@mui/icons-material/EditOutlined"));
import AppLoader from "@ui-components/AppLoader";
import AppModal from "@ui-components/AppModal";
import { UserActions } from "@/enumerations/Users/user-actions.enum";
import { AppModalState } from "@models/Common/ModalState";
import {
  useDeleteUserMutation,
  useGetAllTenantUsersQuery,
  useGetTenantUserManagementDashboardInfoQuery,
  useTakeUserBulkActionMutation,
  useUpsertTenantUserMutation,
} from "@services/User/UserManagementService";
import UpsertUserForm from "@/components/features/Users/UpsertUserForm";
import {
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
  Card,
  CardContent,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  TextField,
  Tooltip,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import UnsubscribeIcon from "@mui/icons-material/Unsubscribe";
import { UpsertUserModel } from "@/models/Users/UpsertUserModel";
import AddIcon from "@mui/icons-material/Add";
import AppDataGrid from "@/components/ui-components/AppDataGrid";
import { toast } from "react-toastify";
import { UserBulkActionsEnum } from "@/enumerations/Users/user-bulk-action.enum";
import { TakeUserBulkAction } from "@/models/Users/TakeUserBulkActionModel";
import moment from "moment";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavUtilities from "@/utilities/NavUtilities";
import { FilterTenantUsersModel } from "@/models/Tenant/FilterTenantUsersModel";
import AppConstants from "@/constants/constants";
const PermIdentityOutlinedIcon = lazy(
  () => import("@mui/icons-material/PermIdentityOutlined")
);
const PersonOffOutlinedIcon = lazy(
  () => import("@mui/icons-material/PersonOffOutlined")
);
const VerifiedUserOutlinedIcon = lazy(
  () => import("@mui/icons-material/VerifiedUserOutlined")
);
const Button = lazy(() => import("@mui/material/Button"));
const Stack = lazy(() => import("@mui/material/Stack"));
const Typography = lazy(() => import("@mui/material/Typography"));
import Grid from "@mui/material/Grid2";
import AppPaper from "@/components/ui-components/AppPaper";

const ViewTenantUsers = () => {
  /****
   * Hook's
   */
  const { t: commonLocale } = useTranslation();
  const formikRef = useRef<any>(null);
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  /**
   * Component states
   */
  const [pageActionsState, setPageActionsState] = useState<AppModalState>({
    visible: false,
    title: undefined,
    actionId: 0,
    data: undefined,
    okButtonText: undefined,
  });

  const [paginationModel, setPaginationModel] =
    useState<FilterTenantUsersModel>({
      page: 0,
      pageSize: 5,
      accountAlias: String(searchParams.get("accountAlias")),
    });

  /****
   * Queries
   */
  const { data: dashboardInfo, isLoading: isMetricsLoading } =
    useGetTenantUserManagementDashboardInfoQuery(
      String(searchParams.get("accountAlias"))
    );
  const {
    data,
    isFetching,
    isLoading: isTableInfoLoading,
  } = useGetAllTenantUsersQuery(paginationModel);

  const usersData = useMemo(() => {
    return data?.data.items ?? [];
  }, [data?.data]);

  /***
   * Mutations
   */
  const [upsertUserMutation] = useUpsertTenantUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();
  const [takeUserBulkActionMutation] = useTakeUserBulkActionMutation();

  /***
   * Event handlers
   */
  const onClickAddUser = () => {
    setPageActionsState({
      actionId: UserActions.ADD_USER,
      title: `${commonLocale("add")} ${commonLocale("user")}`,
      data: {},
      visible: true,
      okButtonText: commonLocale("add"),
    });
  };

  const handleModalClose = () => {
    formikRef?.current?.resetForm();
    setPageActionsState((prev: AppModalState) => {
      return {
        ...prev,
        visible: false,
        data: {},
        title: undefined,
        okButtonText: undefined,
        actionId: 0,
      };
    });
  };

  const showMessage = () => {
    switch (pageActionsState.actionId) {
      case UserActions.ADD_USER:
        toast("User created successfully.");
        break;
      case UserActions.EDIT_USER:
        toast("User updated successfully.");
        break;
      case UserActions.DELETE_USER:
        toast("User deleted successfully");
        break;
    }
  };

  const handleSubmit = (values: UpsertUserModel) => {
    upsertUserMutation({
      ...values,
      accountAlias: String(searchParams.get("accountAlias")),
    })
      .unwrap()
      .then(() => {
        showMessage();
      })
      .then(() => {
        handleModalClose();
      });
  };

  const handleOk = () => {
    switch (pageActionsState.actionId) {
      case UserActions.ADD_USER:
      case UserActions.EDIT_USER:
        formikRef?.current?.submitForm();
        break;
      case UserActions.DELETE_USER:
        deleteUserMutation(pageActionsState.data.resourceAlias)
          .unwrap()
          .then(() => {
            showMessage();
          })
          .then(() => {
            handleModalClose();
          });
        break;
    }
  };

  const onEditUser = useCallback(
    async (data: UpsertUserModel) => {
      await new Promise<void>((res) => {
        setPageActionsState({
          actionId: UserActions.EDIT_USER,
          title: `${commonLocale("update")} ${commonLocale("user")}`,
          data: data,
          visible: true,
          okButtonText: commonLocale("update"),
        });
        res();
      });
      setTimeout(() => {
        if (formikRef.current) {
          formikRef.current.setValues(data);
        }
      }, 600);
    },
    [commonLocale]
  );

  const onDeleteUser = useCallback(
    (resourceAlias: string) => {
      setPageActionsState({
        actionId: UserActions.DELETE_USER,
        title: `${commonLocale("delete")} ${commonLocale("user")}`,
        data: { resourceAlias },
        visible: true,
        okButtonText: commonLocale("delete"),
      });
    },
    [commonLocale]
  );

  const columns = useMemo(() => {
    const columns: GridColDef[] = [
      {
        field: "fullName",
        flex: 1,
        headerName: "Full name",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        valueGetter: (value, row) =>
          `${row.firstName || ""} ${row.lastName || ""}`,
      },
      {
        field: "email",
        headerName: commonLocale("email"),
        type: "number",
        editable: false,
        flex: 1,
      },
      {
        field: "emailConfirmed",
        headerName: `${commonLocale("email")} ${commonLocale("confirmed")}`,
        type: "boolean",
        editable: false,
        flex: 1,
      },
      {
        field: "isActive",
        headerName: "Active",
        type: "boolean",
        editable: false,
        flex: 1,
      },
      {
        field: "isLocked",
        headerName: "Locked",
        type: "boolean",
        editable: false,
        flex: 1,
      },
      {
        field: "lockoutEnabled",
        headerName: "Lockout Enabled",
        type: "boolean",
        editable: false,
        flex: 1,
      },
      {
        field: "lockoutEnd",
        headerName: "Lockout End",
        type: "string",
        editable: false,
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          return params.row?.lockoutEnd ? (
            <Stack>
              <span>
                {moment
                  .utc(params.row.lockoutEnd)
                  .local()
                  .format("YYYY/MM/DD HH:mm:ss")}
              </span>
              <span>
                ({moment.utc(params.row.lockoutEnd).local().fromNow()})
              </span>
            </Stack>
          ) : (
            "N/A"
          );
        },
      },
      {
        field: "phone",
        headerName: "Phone",
        flex: 1,
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        flex: 1,
        renderCell: (params: GridRenderCellParams<any>) => {
          return (
            <Stack justifyContent="start" flexDirection="row" gap={1}>
              <Tooltip title="View more">
                <IconButton
                  onClick={() =>
                    navigate(
                      NavUtilities.ToSecureArea(
                        `users/view?resourceId=${params.row.resourceAlias}`
                      )
                    )
                  }
                  aria-label="Example"
                >
                  <ArrowForwardIcon sx={{ color: "darkgreen" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit user">
                <IconButton
                  onClick={() => {
                    onEditUser(params.row);
                  }}
                  aria-label="Example"
                >
                  <EditOutlinedIcon sx={{ color: "darkblue" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete user">
                <IconButton
                  onClick={() => onDeleteUser(params.row.resourceAlias)}
                  aria-label="Example"
                >
                  <DeleteOutlineOutlinedIcon sx={{ color: "darkred" }} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
      },
    ];
    return columns;
  }, [commonLocale, onDeleteUser, onEditUser]);

  const userForm = useCallback(
    (actionId: number) => {
      return (
        <UpsertUserForm
          formikRef={formikRef}
          onSubmit={handleSubmit}
          actionId={actionId}
        />
      );
    },
    [handleSubmit]
  );

  const getActionView = (actionId: number) => {
    switch (actionId) {
      case UserActions.DELETE_USER:
        return (
          <Stack direction={"column"} alignItems={"center"}>
            <Typography variant="body2">
              {
                "Are you completely sure you want to say goodbye to this user? Just a friendly reminder that this action can't be reversed."
              }
            </Typography>
          </Stack>
        );
      case UserActions.ADD_USER:
      case UserActions.EDIT_USER:
        return userForm(actionId);
      case UserBulkActionsEnum.Activate:
        return "Are you sure you want to activate this users?";
    }
  };

  const COLORS = [
    "#008DDA",
    "#41C9E2",
    "#ACE2E1",
    "#F7EEDD",
    "#007F73",
    "#4CCD99",
    "#FFC700",
    "#FFF455",
    "#FF407D",
    "#FFCAD4",
    "#40679E",
    "#1B3C73",
    "#B1B2FF",
    "#AAC4FF",
    "#6096B4",
  ];

  const getRandomColor = () => {
    let num = Math.floor(Math.random() * COLORS.length);
    return COLORS[num];
  };

  const [selectedAction, setSelectedAction] = useState<{
    users: string[];
    action: UserBulkActionsEnum;
    popup: {
      visible: boolean;
      title: string;
      okButtonText: string;
      message: string;
    };
  }>({
    users: [],
    action: UserBulkActionsEnum.NotSpecified,
    popup: {
      visible: false,
      title: "",
      okButtonText: "",
      message: "",
    },
  });

  const onConfirmBulkAction = () => {
    takeUserBulkActionMutation({
      action: selectedAction.action,
      resourceAliases: selectedAction.users,
    } as TakeUserBulkAction)
      .unwrap()
      .then(() => {
        resetBulkActionModalState();
      });
  };

  const onUserSelected = (
    model: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    setSelectedAction((prev) => {
      return {
        ...prev,
        users: model as string[],
      };
    });
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getInfoForBulkAction = (
    action: UserBulkActionsEnum
  ): {
    message: string;
    okButtonText: string;
    title: string;
  } => {
    switch (action) {
      case UserBulkActionsEnum.Activate:
        return {
          message: "Are you sure you want to activate this users?",
          okButtonText: "Activate",
          title: "Activate users",
        };
      case UserBulkActionsEnum.EmailConfirmed:
        return {
          message:
            "Are you sure you want to confirm email for the selected users?",
          okButtonText: "Confirm",
          title: "Confirm email",
        };
      case UserBulkActionsEnum.EmailNotConfirmed:
        return {
          message:
            "Are you sure you want to unconfirm email for selected users?",
          okButtonText: "Unconfirm",
          title: "Unconfirm Email",
        };
      case UserBulkActionsEnum.Deactivate:
        return {
          message: "Are you sure you want to deactivate the selected users?",
          okButtonText: "Deactivate",
          title: "Deactivate Users",
        };
      case UserBulkActionsEnum.Delete:
        return {
          message: "Are you sure you want to delete the selected users?",
          okButtonText: "Delete",
          title: "Delete Users",
        };
      case UserBulkActionsEnum.LockUser:
        return {
          message: "Are you sure you want to lock the selected users?",
          okButtonText: "Lock Users",
          title: "Lock Users",
        };
      case UserBulkActionsEnum.UnlockUser:
        return {
          message: "Are you sure you want to unlock the selected users?",
          okButtonText: "Unlock Users",
          title: "Unlock Users",
        };
      default:
        return {
          message: "Please selected appropriate action to continue.",
          okButtonText: "No Action Selected",
          title: "No Action Selected",
        };
    }
  };

  const handleSelectedAction = (action: UserBulkActionsEnum) => {
    setAnchorEl(null);
    setSelectedAction((prev) => {
      return {
        ...prev,
        action: action,
        popup: {
          visible: true,
          message: getInfoForBulkAction(action).message,
          okButtonText: getInfoForBulkAction(action).okButtonText,
          title: getInfoForBulkAction(action).title,
        },
      };
    });
  };

  const resetBulkActionModalState = () => {
    setSelectedAction((prev) => {
      return {
        ...prev,
        action: UserBulkActionsEnum.NotSpecified,
        users: [],
        popup: {
          visible: false,
          title: "",
          message: "",
          okButtonText: "",
        },
      };
    });
  };

  return (
    <>
      <>
        <Grid container spacing={AppConstants.layout.StandardSpacing}>
          <Grid size={{ xs: 12, md: 12, sm: 12 }}>
            <Stack
              direction={"row"}
              flexWrap={"wrap"}
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Typography variant="h6">Users</Typography>
              {isTableInfoLoading ? (
                <Skeleton height={60} width={100} />
              ) : (
                <Button
                  onClick={onClickAddUser}
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  {`${commonLocale("add")} ${commonLocale("user")}`}
                </Button>
              )}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <Grid container spacing={0.8}>
              <Grid size={{ md: 2 }}>
                <AppPaper>
                  <CardContent>
                    <Stack
                      direction={"row"}
                      justifyContent={"start"}
                      alignItems={"center"}
                    >
                      <PermIdentityOutlinedIcon fontSize="small" />
                      <Typography
                        flexGrow={1}
                        variant="caption"
                        color="text.secondary"
                      >
                        {isMetricsLoading ? (
                          <Skeleton />
                        ) : (
                          `${commonLocale("total")} ${commonLocale("users")}`
                        )}
                      </Typography>
                    </Stack>
                    <Typography variant="h5">
                      {isMetricsLoading ? (
                        <Skeleton height={40} />
                      ) : (
                        dashboardInfo?.data?.totalUsers
                      )}
                    </Typography>
                  </CardContent>
                </AppPaper>
              </Grid>
              <Grid size={12}>
                <AppPaper>
                  <CardContent>
                    <Stack direction={"row"}>
                      <PermIdentityOutlinedIcon fontSize="small" />
                      <Typography
                        flexGrow={1}
                        variant="caption"
                        color="text.secondary"
                      >
                        {isMetricsLoading ? (
                          <Skeleton />
                        ) : (
                          `${commonLocale("active")} ${commonLocale("users")}`
                        )}
                      </Typography>
                    </Stack>
                    <Typography variant="h5">
                      {isMetricsLoading ? (
                        <Skeleton height={40} />
                      ) : (
                        dashboardInfo?.data?.activeUsers
                      )}
                    </Typography>
                  </CardContent>
                </AppPaper>
              </Grid>
              <Grid size={12}>
                <AppPaper>
                  <CardContent>
                    <Stack direction={"row"}>
                      <PersonOffOutlinedIcon fontSize="small" />
                      <Typography
                        flexGrow={1}
                        variant="caption"
                        color="text.secondary"
                      >
                        {isMetricsLoading ? (
                          <Skeleton />
                        ) : (
                          `${commonLocale("deactivated")} ${commonLocale(
                            "users"
                          )}`
                        )}
                      </Typography>
                    </Stack>
                    <Typography variant="h5">
                      {isMetricsLoading ? (
                        <Skeleton height={40} />
                      ) : (
                        dashboardInfo?.data?.deactivatedUsers
                      )}
                    </Typography>
                  </CardContent>
                </AppPaper>
              </Grid>
              <Grid size={12}>
                <AppPaper>
                  <CardContent>
                    <Stack direction={"row"}>
                      <VerifiedUserOutlinedIcon fontSize="small" />
                      <Typography
                        flexGrow={1}
                        variant="caption"
                        color="text.secondary"
                      >
                        {isMetricsLoading ? (
                          <Skeleton />
                        ) : (
                          `${commonLocale("verified")} ${commonLocale("users")}`
                        )}
                      </Typography>
                    </Stack>
                    <Typography variant="h5">
                      {isMetricsLoading ? (
                        <Skeleton height={40} />
                      ) : (
                        dashboardInfo?.data?.verifiedUsers
                      )}
                    </Typography>
                  </CardContent>
                </AppPaper>
              </Grid>
              <Grid size={12}>
                <AppPaper>
                  <CardContent>
                    <Stack direction={"row"}>
                      <VerifiedUserOutlinedIcon fontSize="small" />
                      <Typography
                        flexGrow={1}
                        variant="caption"
                        color="text.secondary"
                      >
                        {isMetricsLoading ? (
                          <Skeleton />
                        ) : (
                          `${commonLocale("unverified")} ${commonLocale(
                            "users"
                          )}`
                        )}
                      </Typography>
                    </Stack>
                    <Typography variant="h5">
                      {isMetricsLoading ? (
                        <Skeleton height={40} />
                      ) : (
                        dashboardInfo?.data?.unVerifiedUsers
                      )}
                    </Typography>
                  </CardContent>
                </AppPaper>
              </Grid>
              <Grid size={12}>
                <AppPaper>
                  <CardContent>
                    <Stack direction={"row"}>
                      <VerifiedUserOutlinedIcon fontSize="small" />
                      <Typography
                        flexGrow={1}
                        variant="caption"
                        color="text.secondary"
                      >
                        {isMetricsLoading ? (
                          <Skeleton />
                        ) : (
                          `${commonLocale("locked")} ${commonLocale("users")}`
                        )}
                      </Typography>
                    </Stack>
                    <Typography variant="h5">
                      {isMetricsLoading ? (
                        <Skeleton height={40} />
                      ) : (
                        dashboardInfo?.data?.lockedUsers
                      )}
                    </Typography>
                  </CardContent>
                </AppPaper>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            <Grid container spacing={0.8} alignItems={"center"}>
              <Grid size={12}>
                {isTableInfoLoading ? (
                  <Skeleton height={60} />
                ) : (
                  <TextField
                    size="small"
                    id="outlined-basic"
                    label="Search user by email, firstname or lastname"
                    variant="outlined"
                    fullWidth
                  />
                )}
              </Grid>
              <Grid size={12}>
                {isTableInfoLoading ? (
                  <Skeleton height={60} />
                ) : (
                  <Button
                    disabled={selectedAction.users.length === 0}
                    startIcon={<MoreVertIcon />}
                    variant="outlined"
                    size="medium"
                    fullWidth
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    Actions
                  </Button>
                )}
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() =>
                      handleSelectedAction(UserBulkActionsEnum.Activate)
                    }
                    disableRipple
                  >
                    <ListItemIcon>
                      <ToggleOnIcon sx={{ color: "darkgreen" }} />
                    </ListItemIcon>
                    <ListItemText>Activate</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSelectedAction(UserBulkActionsEnum.Deactivate)
                    }
                    disableRipple
                  >
                    <ListItemIcon>
                      <ToggleOffIcon sx={{ color: "darkgreen" }} />
                    </ListItemIcon>
                    <ListItemText>Deactivate</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSelectedAction(UserBulkActionsEnum.EmailConfirmed)
                    }
                    disableRipple
                  >
                    <ListItemIcon>
                      <MarkEmailReadOutlinedIcon sx={{ color: "darkgreen" }} />
                    </ListItemIcon>
                    <ListItemText>Email Confirmed</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSelectedAction(
                        UserBulkActionsEnum.EmailNotConfirmed
                      )
                    }
                    disableRipple
                  >
                    <ListItemIcon>
                      <UnsubscribeIcon sx={{ color: "darkgreen" }} />
                    </ListItemIcon>
                    <ListItemText>Email Not Confirmed</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSelectedAction(UserBulkActionsEnum.LockUser)
                    }
                    disableRipple
                  >
                    <ListItemIcon>
                      <LockOutlinedIcon sx={{ color: "darkred" }} />
                    </ListItemIcon>
                    <ListItemText>Lock</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSelectedAction(UserBulkActionsEnum.UnlockUser)
                    }
                    disableRipple
                  >
                    <ListItemIcon>
                      <LockOpenOutlinedIcon sx={{ color: "darkgreen" }} />
                    </ListItemIcon>
                    <ListItemText>Unlock</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSelectedAction(UserBulkActionsEnum.Delete)
                    }
                    disableRipple
                  >
                    <ListItemIcon>
                      <DeleteOutlineOutlinedIcon sx={{ color: "darkred" }} />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 12 }}>
            {isTableInfoLoading ? (
              <Skeleton height={150} />
            ) : (
              <AppDataGrid
                columnsToHide={{
                  id: false,
                }}
                records={usersData}
                columns={columns}
                totalRecords={data?.data?.totalItems ?? 0}
                isFetching={isFetching}
                paginationState={paginationModel}
                setPaginationState={(model) => {
                  setPaginationModel((prev) => {
                    return {
                      ...prev,
                      page: model.page,
                      pageSize: model.pageSize,
                    };
                  });
                }}
                setRowId={(row) => row.resourceAlias}
                disableRowSelectionOnClick={true}
                selectedRows={selectedAction.users}
                onRowSelectionModelChange={onUserSelected}
                hasNextPage={data?.data?.isNextPage ?? false}
              />
            )}
          </Grid>
        </Grid>

        <AppModal
          modalTitle={pageActionsState.title}
          show={pageActionsState.visible}
          okButtonText={pageActionsState.okButtonText}
          handleOk={handleOk}
          handleClose={handleModalClose}
        >
          <>{getActionView(pageActionsState.actionId)}</>
        </AppModal>

        <AppModal
          modalTitle={selectedAction.popup.title}
          show={selectedAction.popup.visible}
          okButtonText={selectedAction.popup.okButtonText}
          handleOk={onConfirmBulkAction}
          handleClose={resetBulkActionModalState}
        >
          <>{selectedAction.popup.message}</>
        </AppModal>
      </>
    </>
  );
};

export default ViewTenantUsers;
