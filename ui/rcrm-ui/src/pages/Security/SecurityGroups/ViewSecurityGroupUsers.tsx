import { lazy, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
const ArrowForwardIcon = lazy(() => import("@mui/icons-material/ArrowForward"));
const DeleteOutlineOutlinedIcon = lazy(
  () => import("@mui/icons-material/DeleteOutlineOutlined")
);
import AppLoader from "@ui-components/AppLoader";
import AppModal from "@ui-components/AppModal";
import { AppModalState } from "@models/Common/ModalState";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { IconButton, Skeleton, TextField, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AppDataGrid from "@/components/ui-components/AppDataGrid";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavUtilities from "@/utilities/NavUtilities";
import { FilterSecurityGroupUsersModel } from "@/models/Tenant/FilterSecurityGroupUsersModel";
import TenantUsersSelectionForm from "@/components/features/Users/TenantUsersSelectionForm";
import {
  useAddUsersToSecurityGroupMutation,
  useDeleteUserFromSecurityGroupMutation,
  useGetAllSecurityGroupUsersQuery,
} from "@/services/Security/SecurityGroupService";
import { TenantUsersSelectionModel } from "@/models/Users/TenantUsersSelectionModel";
import { SecurityGroupsActions } from "@/enumerations/Security/SecurityGroups/security-groups-actions.enum";
import AppConstants from "@/constants/constants";
const Button = lazy(() => import("@mui/material/Button"));
const Stack = lazy(() => import("@mui/material/Stack"));
const Typography = lazy(() => import("@mui/material/Typography"));
import Grid from "@mui/material/Grid2";

const ViewSecurityGroupUsers = () => {
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
    useState<FilterSecurityGroupUsersModel>({
      page: 0,
      pageSize: 5,
      securityGroupId: String(searchParams.get("groupId")),
    });

  /****
   * Queries
   */

  const {
    data,
    isFetching,
    isLoading: isTableInfoLoading,
  } = useGetAllSecurityGroupUsersQuery(paginationModel);

  const usersData = useMemo(() => {
    return data?.data.items ?? [];
  }, [data?.data]);

  /***
   * Mutations
   */
  const [addUserToSecurityGroup] = useAddUsersToSecurityGroupMutation();
  const [deleteUser] = useDeleteUserFromSecurityGroupMutation();

  /***
   * Event handlers
   */
  const onClickAddUsers = () => {
    setPageActionsState({
      actionId: SecurityGroupsActions.ADD_USERS_TO_SECURITY_GROUP,
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
      case SecurityGroupsActions.ADD_USERS_TO_SECURITY_GROUP:
        toast("Users added successfully.");
        break;
      case SecurityGroupsActions.DELETE_USER_FROM_SECURITY_GROUP:
        toast("User deleted successfully");
        break;
    }
  };

  const handleSubmit = useCallback((values: TenantUsersSelectionModel) => {
    addUserToSecurityGroup({
      users: values.users.map((x) => x.id),
      securityGroupId: String(searchParams.get("groupId")),
    })
      .unwrap()
      .then(() => {
        showMessage();
      })
      .then(() => {
        handleModalClose();
      });
  }, []);

  const handleOk = () => {
    switch (pageActionsState.actionId) {
      case SecurityGroupsActions.ADD_USERS_TO_SECURITY_GROUP:
        formikRef?.current?.submitForm();
        break;
      case SecurityGroupsActions.DELETE_USER_FROM_SECURITY_GROUP:
        deleteUser({
          resourceAlias: pageActionsState.data,
          securityGroupId: String(searchParams.get("groupId")),
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

  const onDeleteUser = useCallback((resourceAlias: string) => {
    setPageActionsState({
      actionId: SecurityGroupsActions.DELETE_USER_FROM_SECURITY_GROUP,
      title: `${commonLocale("delete")} ${commonLocale("user")}`,
      data: resourceAlias,
      visible: true,
      okButtonText: commonLocale("delete"),
    });
  }, []);

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
  }, [commonLocale, navigate, onDeleteUser]);

  const onUserSelected = () => {};

  const getViewByAction = () => {
    switch (pageActionsState.actionId) {
      case SecurityGroupsActions.ADD_USERS_TO_SECURITY_GROUP:
        return (
          <TenantUsersSelectionForm
            formikRef={formikRef}
            onSubmit={handleSubmit}
          />
        );
      case SecurityGroupsActions.DELETE_USER_FROM_SECURITY_GROUP:
        return (
          <Typography>
            "Are you sure you want to remove this user from the security group?
            This action will revoke their access and cannot be undone." 🔒🚪
          </Typography>
        );
    }
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
                overlayMessage="No users present."
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
                onRowSelectionModelChange={onUserSelected}
                hasNextPage={data?.data?.isNextPage ?? false}
                selectedRows={[]}
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
          <>{getViewByAction()}</>
        </AppModal>
      </>
    </>
  );
};

export default ViewSecurityGroupUsers;
