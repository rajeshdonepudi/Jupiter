import {
  useAddTenantMutation,
  useGetAllTenantsQuery,
  useGetTenantDashboardInfoQuery,
} from "@/services/Tenant/TenantService";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DisplayUtilities from "@/utilities/DisplayUtilities";
import AddIcon from "@mui/icons-material/Add";
import { lazy, useMemo, useRef, useState } from "react";
import {
  GridCallbackDetails,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import moment from "moment";
import { useTranslation } from "react-i18next";
import AppDataGrid from "@/components/ui-components/AppDataGrid";
import { TenantBulkAction } from "@/enumerations/Tenant/tenant-bulk-action.enum";
import AppLoader from "@/components/ui-components/AppLoader";
import AppModal from "@/components/ui-components/AppModal";
import { AppModalState } from "@/models/Common/ModalState";
import { TenantActions } from "@/enumerations/Tenant/tenant-actions.enum";
import UpsertTenantForm from "@/components/features/Tenant/UpsertTenantForm";
import { UpsertTenantModel } from "@/models/Tenant/UpsertTenantModel";
const ArrowForwardIcon = lazy(() => import("@mui/icons-material/ArrowForward"));
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { toast } from "react-toastify";
import NavUtilities from "@/utilities/NavUtilities";
import { useNavigate } from "react-router-dom";
import AppPage from "@/components/ui-components/AppPage";
import Grid from "@mui/material/Grid2";
import AppPaper from "@/components/ui-components/AppPaper";

const DeleteOutlineOutlinedIcon = lazy(
  () => import("@mui/icons-material/DeleteOutlineOutlined")
);
const EditOutlinedIcon = lazy(() => import("@mui/icons-material/EditOutlined"));

const ManageTenants = () => {
  const { data: dashboardInfo, isFetching: isMetricsLoading } =
    useGetTenantDashboardInfoQuery(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [pageActionsState, setPageActionsState] = useState<AppModalState>({
    visible: false,
    title: undefined,
    actionId: 0,
    data: undefined,
    okButtonText: undefined,
  });
  const { t: commonLocale } = useTranslation();
  const navigate = useNavigate();
  const {
    data,
    isFetching,
    isLoading: isTenantsListLoading,
  } = useGetAllTenantsQuery(paginationModel);

  const [addTenant] = useAddTenantMutation();

  const tenantsData = useMemo(() => {
    return data?.data.items ?? [];
  }, [data?.data]);

  const onEditTenant = (data: any) => {};

  const onDeleteTenant = (data: any) => {};

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

  const [selectedAction, setSelectedAction] = useState<{
    tenants: string[];
    action: TenantBulkAction;
    popup: {
      visible: boolean;
      title: string;
      okButtonText: string;
      message: string;
    };
  }>({
    tenants: [],
    action: TenantBulkAction.NotSpecified,
    popup: {
      visible: false,
      title: "",
      okButtonText: "",
      message: "",
    },
  });

  const onTenantSelected = (
    model: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => {
    setSelectedAction((prev) => {
      return {
        ...prev,
        tenants: model as string[],
      };
    });
  };

  const showMessage = () => {
    switch (pageActionsState.actionId) {
      case TenantActions.AddTenant:
        toast("Tenant added successfully.");
        break;
      case TenantActions.UpdateTenant:
        toast("Tenant updated successfully.");
        break;
    }
  };

  const formikRef = useRef<any>(null);

  const handleSubmit = (values: UpsertTenantModel) => {
    switch (pageActionsState.actionId) {
      case TenantActions.AddTenant:
        addTenant(values)
          .unwrap()
          .then(() => {
            showMessage();
          })
          .then(() => {
            handleModalClose();
          });
        break;
      case TenantActions.UpdateTenant:
        break;
    }
  };

  const handleOk = () => {
    switch (pageActionsState.actionId) {
      case TenantActions.AddTenant:
      case TenantActions.UpdateTenant:
        formikRef?.current?.submitForm();
        break;
    }
  };

  const columns = useMemo(() => {
    const columns: GridColDef[] = [
      {
        headerName: "Logo",
        field: "profilePicture",
        renderCell: (params: GridRenderCellParams<any>) => {
          return (
            <Stack
              height={"100%"}
              alignItems={"start"}
              justifyContent={"center"}
            >
              <Avatar
                alt={params.row.host}
                src={`data:image/gif;base64,${params.row.profilePicture}`}
                sx={{ width: 35, height: 35 }}
              />
            </Stack>
          );
        },
      },
      {
        field: "name",
        flex: 1,
        headerName: "Name",
        description: "This    column has a value getter and is not sortable.",
        sortable: true,
      },
      {
        field: "accountAlias",
        headerName: "Account ID",
        type: "string",
        sortable: true,
        editable: false,
        flex: 1,
      },
      {
        field: "userCount",
        type: "number",
        headerName: "Users",
      },
      {
        field: "themesCount",
        type: "number",
        headerName: "Themes",
      },
      {
        field: "host",
        headerName: "Host",
        type: "string",
        editable: false,
        sortable: true,
        flex: 1,
      },
      {
        field: "isDeleted",
        headerName: "Deleted",
        type: "boolean",
        editable: false,
      },
      {
        field: "createdOn",
        headerName: "Created",
        type: "string",
        editable: false,
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
              <span>
                ({moment.utc(params.row.createdOn).local().fromNow()})
              </span>
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
            <Stack justifyContent="start" flexDirection="row" gap={1}>
              <Tooltip title="View more">
                <IconButton
                  onClick={() =>
                    navigate(
                      NavUtilities.ToSecureArea(
                        `manage-tenants/view?accountAlias=${params.row.accountAlias}`
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
                    onEditTenant(params.row);
                  }}
                  aria-label="Example"
                >
                  <EditOutlinedIcon sx={{ color: "darkblue" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete user">
                <IconButton
                  onClick={() => onDeleteTenant(params.row.resourceAlias)}
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
  }, [commonLocale, onEditTenant, onDeleteTenant]);

  const getActionView = () => {
    switch (pageActionsState.actionId) {
      case TenantActions.AddTenant:
      case TenantActions.UpdateTenant:
        return (
          <UpsertTenantForm
            formikRef={formikRef}
            onSubmit={handleSubmit}
            actionId={pageActionsState.actionId}
          />
        );
    }
  };

  const onClickAddTenant = () => {
    setPageActionsState({
      actionId: TenantActions.AddTenant,
      title: "Add Tenant",
      data: {},
      visible: true,
      okButtonText: "Add",
    });
  };

  const onClickUpdateTenant = async (data: any) => {
    setPageActionsState({
      actionId: TenantActions.UpdateTenant,
      title: "Update Tenant",
      data: data,
      visible: true,
      okButtonText: "Update",
    });
  };

  return (
    <AppPage
      rightHeaderActions={
        <Button
          variant="contained"
          onClick={onClickAddTenant}
          startIcon={<AddOutlinedIcon />}
        >
          Add Tenant
        </Button>
      }
      content={
        <>
          <Grid container spacing={0.8}>
            <Grid size={12}>
              <Grid container spacing={0.8}>
                <Grid size={3}>
                  <AppPaper>
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">
                        {isMetricsLoading ? <Skeleton /> : "Total Tenants"}
                      </Typography>
                      <Typography variant="h5">
                        {isMetricsLoading ? (
                          <Skeleton />
                        ) : (
                          (dashboardInfo?.data?.totalTenantsInSystem ?? 0)
                        )}
                      </Typography>
                    </CardContent>
                  </AppPaper>
                </Grid>
                <Grid size={{ md: 3 }}>
                  <AppPaper>
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">
                        {isMetricsLoading ? <Skeleton /> : "Total Users"}
                      </Typography>
                      <Typography variant="h5">
                        {isMetricsLoading ? (
                          <Skeleton />
                        ) : (
                          DisplayUtilities.formatNumber(
                            Number(dashboardInfo?.data?.totalUsersInSystem ?? 0)
                          )
                        )}
                      </Typography>
                    </CardContent>
                  </AppPaper>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Grid size={{ xs: 12, md: 12 }}>
                {isTenantsListLoading ? (
                  <Skeleton height={500} />
                ) : (
                  <AppDataGrid
                    columnsToHide={{
                      id: false,
                    }}
                    hasNextPage={data?.data?.isNextPage ?? false}
                    records={tenantsData}
                    columns={columns}
                    totalRecords={data?.data?.totalItems ?? 0}
                    isFetching={isFetching}
                    paginationState={paginationModel}
                    setPaginationState={setPaginationModel}
                    setRowId={(row) => row.accountAlias}
                    disableRowSelectionOnClick={true}
                    selectedRows={selectedAction.tenants}
                    onRowSelectionModelChange={onTenantSelected}
                  />
                )}
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
            <>{getActionView()}</>
          </AppModal>
        </>
      }
    ></AppPage>
  );
};

export default ManageTenants;
