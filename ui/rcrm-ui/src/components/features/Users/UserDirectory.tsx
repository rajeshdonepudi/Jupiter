import {
  Avatar,
  Button,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { lazy, useCallback, useMemo, useRef, useState } from "react";
import AppLoader from "@/components/ui-components/AppLoader";
import { FilterUserDirectory } from "@/models/Users/FilterUserDirectory";
import { UpsertUserModel } from "@/models/Users/UpsertUserModel";
import {
  useDeleteUserMutation,
  useGetAllUsersForUserDirectoryQuery,
  useTakeUserBulkActionMutation,
  useUpsertUserMutation,
} from "@/services/User/UserManagementService";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { useGetTenantLookupForUserDirectoryQuery } from "@/services/Tenant/TenantService";
import CommonUtilities from "@/utilities/CommonUtilities";
import AppDataGrid from "@/components/ui-components/AppDataGrid";
import {
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { UserBulkActionsEnum } from "@/enumerations/Users/user-bulk-action.enum";
import { AppModalState } from "@/models/Common/ModalState";
const ArrowForwardIcon = lazy(() => import("@mui/icons-material/ArrowForward"));
const DeleteOutlineOutlinedIcon = lazy(
  () => import("@mui/icons-material/DeleteOutlineOutlined")
);
import AddIcon from "@mui/icons-material/Add";
const EditOutlinedIcon = lazy(() => import("@mui/icons-material/EditOutlined"));

import moment from "moment";
import { useTranslation } from "react-i18next";
import { UserActions } from "@/enumerations/Users/user-actions.enum";
import { toast } from "react-toastify";
import UpsertUserForm from "./UpsertUserForm";
import AppModal from "@/components/ui-components/AppModal";
import { TakeUserBulkAction } from "@/models/Users/TakeUserBulkActionModel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import UnsubscribeIcon from "@mui/icons-material/Unsubscribe";
import { useNavigate } from "react-router-dom";
import NavUtilities from "@/utilities/NavUtilities";
import AppPage from "@/components/ui-components/AppPage";
import AppConstants from "@/constants/constants";
import Grid from "@mui/material/Grid2";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 4;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const UserDirectory = () => {
  const [filterState, setFilterState] = useState<FilterUserDirectory | any>({
    page: 0,
    pageSize: 5,
    tenants: [],
    searchTerm: "",
  });

  const { t: commonLocale } = useTranslation();
  const formikRef = useRef<any>(null);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    data: logData,
    isFetching,
    isLoading,
  } = useGetAllUsersForUserDirectoryQuery(filterState);

  const [pageActionsState, setPageActionsState] = useState<AppModalState>({
    visible: false,
    title: undefined,
    actionId: 0,
    data: undefined,
    okButtonText: undefined,
  });

  const { data: tenantLookup } = useGetTenantLookupForUserDirectoryQuery(null);
  const [upsertUserMutation] = useUpsertUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();
  const [takeUserBulkActionMutation] = useTakeUserBulkActionMutation();

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

  const onSearchInputChanged = (val: string) => {
    const debouncedSetFilterState = CommonUtilities.debounce((fg: string) => {
      setFilterState(() => ({
        page: 1,
        pageSize: 5,
        searchTerm: fg,
        tenants: [],
      }));
    }, 1500);
    debouncedSetFilterState(val);
  };

  const onTenantSelected = (selectedTenants: any) => {
    const debouncedFilterState = CommonUtilities.debounce((val) => {
      setFilterState((prev: any) => {
        return {
          ...prev,
          tenants: (typeof val === "string" ? val.split(",") : val) ?? [],
        };
      });
    }, 1500);
    debouncedFilterState(selectedTenants);
  };

  const getDisplayText = () => {
    if (filterState?.tenants && filterState.tenants.length > 0) {
      if (tenantLookup?.data) {
        const selectedTenants = filterState.tenants.flatMap((t: any) =>
          tenantLookup.data.filter((d) => d.value === t).map((y) => y.key)
        );
        return selectedTenants;
      }
    }
    return [];
  };

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

  const handleSubmit = (values: UpsertUserModel) => {
    upsertUserMutation(values)
      .unwrap()
      .then(() => {
        showMessage();
      })
      .then(() => {
        handleModalClose();
      });
  };

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

  const onEditUser = (data: UpsertUserModel) => {
    new Promise((res) => {
      res(
        setPageActionsState({
          actionId: UserActions.EDIT_USER,
          title: `${commonLocale("update")} ${commonLocale("user")}`,
          data: data,
          visible: true,
          okButtonText: commonLocale("update"),
        })
      );
    }).then(() => {
      formikRef?.current?.setValues(data);
    });
  };

  const onDeleteUser = (resourceAlias: string) => {
    setPageActionsState({
      actionId: UserActions.DELETE_USER,
      title: `${commonLocale("delete")} ${commonLocale("user")}`,
      data: { resourceAlias },
      visible: true,
      okButtonText: commonLocale("delete"),
    });
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

  const columns = useMemo(() => {
    const columns: GridColDef[] = [
      {
        headerName: "Avatar",
        field: "avatar",
        renderCell: (params: GridRenderCellParams<any>) => {
          return (
            <Stack
              height={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Avatar
                alt={params.row.firstName + " " + params.row.lastName}
                src={`data:image/gif;base64,${params.row.avatar}`}
                sx={{ width: 35, height: 35 }}
              />
            </Stack>
          );
        },
      },
      {
        field: "fullName",
        flex: 1,
        headerName: "Full name",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        renderCell: (params: GridRenderCellParams<any>) => {
          return (
            <Stack>
              <Tooltip
                title={`${params.row.firstName || ""} ${
                  params.row.lastName || ""
                }`}
                placement="top"
              >
                <span>{`${params.row.firstName || ""} ${
                  params.row.lastName || ""
                }`}</span>
              </Tooltip>
            </Stack>
          );
        },
      },
      {
        field: "email",
        headerName: commonLocale("email"),
        type: "number",
        editable: false,
        flex: 1,
        renderCell: (params: GridRenderCellParams<any>) => {
          return (
            <Stack>
              <Tooltip title={`${params.row.email}`} placement="top">
                <span>{`${params.row.email}`}</span>
              </Tooltip>
            </Stack>
          );
        },
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
        headerName: "Tenants",
        field: "associatedTenants",
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams<any>) => {
          return params.row.associatedTenants.map(
            (t: KeyValuePair<string, number>) => {
              return (
                <Tooltip title={t.key}>
                  <Chip label={t.key} onClick={() => {}} />
                </Tooltip>
              );
            }
          );
        },
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
        type: "actions",
        sortable: false,
        headerName: "Actions",
        flex: 1,
        field: "actions",
        renderCell: (params: GridRenderCellParams<any>) => {
          return (
            <Stack justifyContent="space-around" flexDirection="row" gap={1}>
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

  return (
    <AppPage
      rightHeaderActions={
        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          alignItems="center"
        >
          {isLoading ? (
            <Skeleton height={60} width={150} />
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
      }
      content={
        <>
          <Grid container spacing={AppConstants.layout.StandardSpacing}>
            <Grid size={{ md: 12 }}>
              <Grid container spacing={0.8}>
                <Grid size={{ md: 8 }}>
                  {isLoading ? (
                    <Skeleton height={60} />
                  ) : (
                    <TextField
                      size="small"
                      onChange={(e) => {
                        onSearchInputChanged(e.target.value);
                      }}
                      placeholder="Enter user firstname, lastname or email.."
                      fullWidth
                      label="Search user"
                      id="Search"
                    />
                  )}
                </Grid>
                <Grid size={{ md: 3 }}>
                  {isLoading ? (
                    <Skeleton height={60} />
                  ) : (
                    <FormControl fullWidth size="small">
                      <InputLabel id="tenant-filter-label">Tenant</InputLabel>
                      <Select
                        labelId="tenant-filter-label"
                        id="tenant-filter-select-box"
                        multiple
                        label="Tenant"
                        value={filterState.tenants ?? []}
                        onChange={(e) => onTenantSelected(e.target.value)}
                        input={<OutlinedInput label="Tenant" />}
                        renderValue={() => getDisplayText() ?? []}
                        MenuProps={MenuProps}
                      >
                        {tenantLookup?.data?.map(
                          (user: KeyValuePair<string, string>) => (
                            <MenuItem key={user.value} value={user.value}>
                              <Checkbox
                                checked={
                                  (filterState?.tenants ?? []).indexOf(
                                    user.value
                                  ) > -1
                                }
                              />
                              <ListItemText primary={user.key} />
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
                <Grid size={{ md: 1 }}>
                  {isLoading ? (
                    <Skeleton height={60} />
                  ) : (
                    <Button
                      disabled={selectedAction.users.length === 0}
                      startIcon={<MoreVertIcon />}
                      variant="outlined"
                      size="medium"
                      fullWidth
                      sx={{ height: "100%" }}
                      id="basic-button"
                      aria-controls={openMenu ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? "true" : undefined}
                      onClick={handleClick}
                    />
                  )}
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
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
                        <MarkEmailReadOutlinedIcon
                          sx={{ color: "darkgreen" }}
                        />
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
            <Grid size={{ md: 12 }}>
              {isLoading ? (
                <Skeleton height={250} />
              ) : (
                <Grid container>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <AppDataGrid
                      columnsToHide={{
                        id: false,
                      }}
                      records={logData?.data.items ?? []}
                      columns={columns}
                      totalRecords={logData?.data.totalItems ?? 0}
                      isFetching={isFetching}
                      paginationState={filterState}
                      setPaginationState={(model) => {
                        setFilterState((prev: any) => {
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
                      hasNextPage={logData?.data.isNextPage ?? false}
                    />
                  </Grid>
                </Grid>
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
      }
    />
  );
};

export default UserDirectory;
