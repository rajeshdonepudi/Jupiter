import AppDataGrid from "@/components/ui-components/AppDataGrid";
import { lazy, useCallback, useMemo, useRef, useState } from "react";

const ArrowForwardIcon = lazy(() => import("@mui/icons-material/ArrowForward"));
const DeleteOutlineOutlinedIcon = lazy(
  () => import("@mui/icons-material/DeleteOutlineOutlined")
);
import AppLoader from "@/components/ui-components/AppLoader";
import { GetUsersInRoleModel } from "@/models/Security/GetUsersInRoleModel";
import {
  useAddUserToRoleMutation,
  useGetRoleInfoQuery,
  useGetUsersInRoleQuery,
  useRemoveUserFromRoleMutation,
} from "@/services/Security/RoleService";
import {
  Button,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useNavigate, useSearchParams } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import NavUtilities from "@/utilities/NavUtilities";
import { TenantInfo } from "@/models/Tenant/TenantInfo";
import DisplayUtilities from "@/utilities/DisplayUtilities";
import DateTimeUtilities from "@/utilities/DateTimeUtilities";
import AddIcon from "@mui/icons-material/Add";
import { RoleActions } from "@/enumerations/Security/Roles/role-actions.enum";
import { useTranslation } from "react-i18next";
import { AppModalState } from "@/models/Common/ModalState";
import AppModal from "@/components/ui-components/AppModal";
import TenantUsersSelectionForm from "@/components/features/Users/TenantUsersSelectionForm";
import { TenantUsersSelectionModel } from "@/models/Users/TenantUsersSelectionModel";
import { ToastService } from "@/services/Common/ToastService";
import AppConstants from "@/constants/constants";
import Grid from "@mui/material/Grid2";

const ViewRoleDetails = () => {
  let [searchParams] = useSearchParams();
  const { t: commonLocale } = useTranslation();
  const roleId = useMemo(() => {
    return searchParams.get("roleId") ?? "";
  }, [searchParams]);
  const navigate = useNavigate();

  const [filterState, setFilterState] = useState<GetUsersInRoleModel>({
    page: 0,
    pageSize: 5,
    roleId: roleId,
  });

  const {
    data: usersData,
    isLoading: isUserInfoLoading,
    isFetching,
  } = useGetUsersInRoleQuery(filterState);
  const { data: roleInfo, isLoading: isRoleInfoLoading } =
    useGetRoleInfoQuery(roleId);

  const [addUserToRole] = useAddUserToRoleMutation();
  const [removeUserFromRole] = useRemoveUserFromRoleMutation();

  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      headerName: "Tenants",
      field: "associatedTenants",
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<any>) => {
        return params.row.tenantInfo.map((t: TenantInfo) => {
          return (
            <Tooltip title={t.id}>
              <Chip label={t.name} onClick={() => {}} />
            </Tooltip>
          );
        });
      },
    },
    {
      field: "",
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
            <Tooltip title="Delete user">
              <IconButton
                onClick={() => onDeleteUser(params.row.userId)}
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

  const [pageActionsState, setPageActionsState] = useState<AppModalState>({
    visible: false,
    title: undefined,
    actionId: 0,
    data: undefined,
    okButtonText: undefined,
  });

  const formikRef = useRef<any>(null);

  const onClickAddUsers = () => {
    setPageActionsState({
      actionId: RoleActions.ADD_USER_TO_ROLE,
      title: `${commonLocale("add")} ${commonLocale("user")}`,
      data: {},
      visible: true,
      okButtonText: commonLocale("add"),
    });
  };

  const onDeleteUser = useCallback((resourceAlias: string) => {
    setPageActionsState({
      actionId: RoleActions.REMOVE_USER_FROM_ROLE,
      title: `${commonLocale("delete")} ${commonLocale("user")}`,
      data: resourceAlias,
      visible: true,
      okButtonText: commonLocale("delete"),
    });
  }, []);

  const getViewByAction = () => {
    switch (pageActionsState.actionId) {
      case RoleActions.ADD_USER_TO_ROLE:
        return (
          <TenantUsersSelectionForm
            formikRef={formikRef}
            onSubmit={handleSubmit}
          />
        );
      case RoleActions.REMOVE_USER_FROM_ROLE:
        return (
          <Typography>
            "Are you sure you want to remove this user from the role? This
            action will revoke their access and cannot be undone." 🔒🚪
          </Typography>
        );
    }
  };

  const handleOk = () => {
    switch (pageActionsState.actionId) {
      case RoleActions.ADD_USER_TO_ROLE:
        formikRef?.current?.submitForm();
        break;
      case RoleActions.REMOVE_USER_FROM_ROLE:
        removeUserFromRole({
          userId: pageActionsState.data,
          roleId: roleId,
        })
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

  const showMessage = () => {
    switch (pageActionsState.actionId) {
      case RoleActions.ADD_USER_TO_ROLE:
        ToastService.showMessage("Users added successfully.");
        break;
      case RoleActions.REMOVE_USER_FROM_ROLE:
        ToastService.showMessage("User removed successfully.");
        break;
    }
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

  const handleSubmit = useCallback((values: TenantUsersSelectionModel) => {
    addUserToRole({
      users: values.users.map((x) => x.id),
      roleId: roleId,
    })
      .unwrap()
      .then(() => {
        showMessage();
      })
      .then(() => {
        handleModalClose();
      });
  }, []);

  return (
    <>
      <Grid container spacing={0.8}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography variant="h6">Role Information</Typography>
            <Button
              onClick={() =>
                navigate(NavUtilities.ToSecureArea("security/roles"))
              }
              startIcon={<ArrowBackOutlinedIcon />}
            >
              Back to roles
            </Button>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <Paper variant="outlined">
            <Grid container spacing={0.8} sx={{ padding: "0.5rem" }}>
              <Grid size={4}>
                <Stack>
                  <Typography variant="caption">
                    {isRoleInfoLoading ? <Skeleton height={40} /> : "ID"}
                  </Typography>
                  <Typography>
                    {isRoleInfoLoading ? (
                      <Skeleton height={40} />
                    ) : (
                      roleInfo?.data.id
                    )}
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ md: 2 }}>
                <Stack>
                  <Typography variant="caption">
                    {isRoleInfoLoading ? <Skeleton height={40} /> : "Name"}
                  </Typography>
                  <Typography>
                    {isRoleInfoLoading ? (
                      <Skeleton height={40} />
                    ) : (
                      roleInfo?.data.name
                    )}
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ md: 2 }}>
                <Stack>
                  <Typography variant="caption">
                    {isRoleInfoLoading ? (
                      <Skeleton height={40} />
                    ) : (
                      "Created On"
                    )}
                  </Typography>
                  <Typography>
                    {isRoleInfoLoading ? (
                      <Skeleton height={40} />
                    ) : (
                      <Stack>
                        <span>
                          {DateTimeUtilities.toLocalDate(
                            roleInfo?.data.createdOn
                          )}
                        </span>
                        <span>
                          (
                          {DateTimeUtilities.toRelativeTime(
                            roleInfo?.data.createdOn
                          )}
                          )
                        </span>
                      </Stack>
                    )}
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ md: 2 }}>
                <Stack>
                  <Typography variant="caption">
                    {isRoleInfoLoading ? (
                      <Skeleton height={40} />
                    ) : (
                      "Users In Role"
                    )}
                  </Typography>
                  <Typography>
                    {isRoleInfoLoading ? (
                      <Skeleton height={40} />
                    ) : (
                      DisplayUtilities.formatPlainNumber(
                        roleInfo?.data.usersInRole ?? 0
                      )
                    )}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <Grid container spacing={AppConstants.layout.StandardSpacing}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Stack
                direction={"row"}
                flexWrap={"wrap"}
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Typography variant="h6">Users</Typography>
                {isUserInfoLoading ? (
                  <Skeleton height={60} width={100} />
                ) : (
                  <Button
                    onClick={onClickAddUsers}
                    variant="contained"
                    startIcon={<AddIcon />}
                  >
                    {`${commonLocale("add")} ${commonLocale("user")}`}
                  </Button>
                )}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              {isUserInfoLoading ? (
                <Skeleton height={300} />
              ) : (
                <Stack>
                  <AppDataGrid
                    records={usersData?.data.items ?? []}
                    columns={columns}
                    totalRecords={usersData?.data.totalItems ?? 0}
                    isFetching={isFetching}
                    paginationState={filterState}
                    columnsToHide={[]}
                    setPaginationState={(model) => {
                      setFilterState((prev) => {
                        return {
                          ...prev,
                          ...model,
                        };
                      });
                    }}
                    overlayMessage="No users present."
                    setRowId={(row) => row.userId}
                    selectedRows={undefined}
                    hasNextPage={usersData?.data?.isNextPage ?? false}
                  />
                </Stack>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AppModal
        modalTitle={pageActionsState.title}
        show={pageActionsState.visible}
        okButtonText={pageActionsState.okButtonText}
        handleOk={handleOk}
        handleClose={handleModalClose}
      >
        <>{getViewByAction()}</>
      </AppModal>
    </>
  );
};

export default ViewRoleDetails;
