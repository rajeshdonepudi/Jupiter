import AppLoader from "@/components/ui-components/AppLoader";
import { Button, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  useAddRoleMutation,
  useDeleteRoleMutation,
  useGetAllSecurityRolesQuery,
  useUpdateRoleMutation,
} from "@/services/Security/RoleService";
import { lazy, useRef, useState } from "react";
import { PageParams } from "@/models/Common/PageParams";
import AppDataGrid from "@/components/ui-components/AppDataGrid";
import moment from "moment";
const ArrowForwardIcon = lazy(() => import("@mui/icons-material/ArrowForward"));
const DeleteOutlineOutlinedIcon = lazy(
  () => import("@mui/icons-material/DeleteOutlineOutlined")
);
const EditOutlinedIcon = lazy(() => import("@mui/icons-material/EditOutlined"));

import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavUtilities from "@/utilities/NavUtilities";
import AppModal from "@/components/ui-components/AppModal";
import { AppModalState } from "@/models/Common/ModalState";
import { RoleActions } from "@/enumerations/Security/Roles/role-actions.enum";
import UpsertRoleForm from "@/components/features/Security/Roles/UpsertRoleForm";
import { toast } from "react-toastify";
import { UpsertRoleModel } from "@/models/Security/Roles/UpsertRoleModel";
import AppPage from "@/components/ui-components/AppPage";
import Grid from "@mui/material/Grid2";
import AppPaper from "@/components/ui-components/AppPaper";

const ViewRoles = () => {
  const [filterState, setFilterState] = useState<PageParams>({
    page: 0,
    pageSize: 5,
  });

  const [addRole, { isLoading: isRoleAddInProgress }] = useAddRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const [pageActionsState, setPageActionsState] = useState<AppModalState>({
    visible: false,
    title: undefined,
    actionId: 0,
    data: undefined,
    okButtonText: undefined,
  });

  const { data: rolesData, isLoading } =
    useGetAllSecurityRolesQuery(filterState);

  const navigate = useNavigate();

  const columns: GridColDef[] = [
    {
      sortable: false,
      headerName: "ID",
      field: "id",
      flex: 1,
    },
    {
      field: "normalizedName",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "usersInRole",
      headerName: "Users In Role",
      flex: 1,
    },
    {
      sortable: false,
      headerName: "Created On",
      field: "createdOn",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        return params.row?.createdOn ? (
          <Stack>
            <span>
              {moment
                .utc(params.row.createdOn)
                .local()
                .format("YYYY/MM/DD HH:mm:ss")}
            </span>
            <span>({moment.utc(params.row.createdOn).local().fromNow()})</span>
          </Stack>
        ) : (
          "N/A"
        );
      },
    },
    {
      field: "",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        return (
          <Stack
            justifyContent="start"
            sx={{ height: "100%" }}
            flexDirection="row"
            gap={1}
          >
            <Tooltip title="View role info">
              <IconButton
                aria-label="View role button"
                onClick={() =>
                  navigate(
                    NavUtilities.ToSecureArea(
                      `security/roles/edit?roleId=${params.row.id}`
                    )
                  )
                }
              >
                <ArrowForwardIcon sx={{ color: "darkgreen" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit role.">
              <IconButton
                onClick={() => onUpdateRoleClicked(params.row)}
                aria-label="Edit role button"
              >
                <EditOutlinedIcon sx={{ color: "darkblue" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete role.">
              <IconButton
                onClick={() => onDeleteRoleClicked(params.row)}
                aria-label="Delete role button"
              >
                <DeleteOutlineOutlinedIcon sx={{ color: "darkred" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  const onDeleteRoleClicked = async (params: any) => {
    setPageActionsState({
      actionId: RoleActions.DELETE_ROLE,
      title: "Delete Role",
      data: params.id,
      visible: true,
      okButtonText: "Delete",
    });
  };

  const formikRef = useRef<any>(null);

  const handleOk = () => {
    switch (pageActionsState.actionId) {
      case RoleActions.ADD_ROLE:
      case RoleActions.UPDATE_ROLE:
        formikRef?.current?.submitForm();
        break;
      case RoleActions.DELETE_ROLE:
        deleteRole(pageActionsState.data)
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
      case RoleActions.ADD_ROLE:
        toast("Role added successfully.");
        break;
      case RoleActions.UPDATE_ROLE:
        toast("Role updated successfully.");
        break;
      case RoleActions.DELETE_ROLE:
        toast("Role deleted successfully.");
        break;
    }
  };

  const handleSubmit = (values: UpsertRoleModel) => {
    switch (pageActionsState.actionId) {
      case RoleActions.ADD_ROLE:
        addRole(values)
          .unwrap()
          .then(() => {
            showMessage();
          })
          .then(() => {
            handleModalClose();
          });
        break;
      case RoleActions.UPDATE_ROLE:
        updateRole(values)
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

  const onAddRoleClicked = () => {
    setPageActionsState({
      actionId: RoleActions.ADD_ROLE,
      title: "Add Role",
      data: {},
      visible: true,
      okButtonText: "Add",
    });
  };

  const onUpdateRoleClicked = async (data: any) => {
    setPageActionsState({
      actionId: RoleActions.UPDATE_ROLE,
      title: "Update Role",
      data: data,
      visible: true,
      okButtonText: "Update",
    });
    setTimeout(() => {
      if (formikRef.current) {
        formikRef.current.setValues(data);
      }
    }, 200);
  };

  const getViewByAction = () => {
    switch (pageActionsState.actionId) {
      case RoleActions.ADD_ROLE:
      case RoleActions.UPDATE_ROLE:
        return (
          <UpsertRoleForm
            formikRef={formikRef}
            onSubmit={handleSubmit}
            actionId={pageActionsState.actionId}
          />
        );
      case RoleActions.DELETE_ROLE:
        return <Typography>Are you sure you want to delete?</Typography>;
    }
  };

  return (
    <AppPage
      rightHeaderActions={
        <Stack
          direction={"row"}
          alignItems={"center"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          {isLoading ? (
            <Skeleton height={60} width={100} />
          ) : (
            <Button
              onClick={onAddRoleClicked}
              variant="contained"
              startIcon={<AddOutlinedIcon />}
            >
              Add Role
            </Button>
          )}
        </Stack>
      }
      content={
        <>
          <Grid container spacing={0.8}>
            <Grid size={{ xs: 12, md: 12 }}>
              <AppPaper>
                {isLoading ? (
                  <Skeleton height={400} />
                ) : (
                  <AppDataGrid
                    records={rolesData?.data.items ?? []}
                    columns={columns}
                    totalRecords={rolesData?.data.totalItems ?? 0}
                    isFetching={false}
                    paginationState={filterState}
                    overlayMessage="No roles present"
                    setPaginationState={setFilterState}
                    setRowId={(row) => row.id}
                    selectedRows={undefined}
                    columnsToHide={[]}
                    hasNextPage={rolesData?.data?.isNextPage ?? false}
                  />
                )}
              </AppPaper>
            </Grid>
            <AppModal
              modalTitle={pageActionsState.title}
              show={pageActionsState.visible}
              okButtonText={pageActionsState.okButtonText}
              handleOk={handleOk}
              disableActions={isRoleAddInProgress}
              handleClose={handleModalClose}
            >
              <>{getViewByAction()}</>
            </AppModal>
          </Grid>
        </>
      }
    />
  );
};

export default ViewRoles;
