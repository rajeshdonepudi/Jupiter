import AppLoader from "@/components/ui-components/AppLoader";
import { Button, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { lazy, useEffect, useRef, useState } from "react";
import { PageParams } from "@/models/Common/PageParams";
import AppDataGrid from "@/components/ui-components/AppDataGrid";
const ArrowForwardIcon = lazy(() => import("@mui/icons-material/ArrowForward"));
const DeleteOutlineOutlinedIcon = lazy(
  () => import("@mui/icons-material/DeleteOutlineOutlined")
);
const EditOutlinedIcon = lazy(() => import("@mui/icons-material/EditOutlined"));
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavUtilities from "@/utilities/NavUtilities";
import {
  useAddNewSecurityGroupMutation,
  useDeleteSecurityGroupMutation,
  useGetAllTenantSecurityGroupsQuery,
  useUpdateSecurityGroupMutation,
} from "@/services/Security/SecurityGroupService";
import AppModal from "@/components/ui-components/AppModal";
import UpsertSecurityGroupForm from "@/components/features/Security/SecurityGroups/UpsertSecurityGroupForm";
import { SecurityGroupsActions } from "@/enumerations/Security/SecurityGroups/security-groups-actions.enum";
import { AppModalState } from "@/models/Common/ModalState";
import { UpsertSecurityGroupModel } from "@/models/Security/SecurityGroups/UpsertSecurityGroupModel";
import { toast } from "react-toastify";
import DateTimeUtilities from "@/utilities/DateTimeUtilities";
import AppPage from "@/components/ui-components/AppPage";
import Grid from "@mui/material/Grid2";

const ViewSecurityGroups = () => {
  const [filterState, setFilterState] = useState<PageParams>({
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

  const { data: securityGroupsData, isLoading } =
    useGetAllTenantSecurityGroupsQuery(filterState);
  const [addSecurityGroup] = useAddNewSecurityGroupMutation();
  const [updateSecurityGroup] = useUpdateSecurityGroupMutation();
  const [deleteSecurityGroup] = useDeleteSecurityGroupMutation();
  const navigate = useNavigate();

  const onDeleteSecurityGroupClicked = async (params: any) => {
    setPageActionsState({
      actionId: SecurityGroupsActions.DELETE_SECURITY_GROUP,
      title: "Delete Security Group",
      data: params.id,
      visible: true,
      okButtonText: "Delete",
    });
  };

  const formikRef = useRef<any>(null);

  const handleOk = () => {
    switch (pageActionsState.actionId) {
      case SecurityGroupsActions.ADD_SECURITY_GROUP:
      case SecurityGroupsActions.UPDATE_SECURITY_GROUP:
        formikRef?.current?.submitForm();
        break;
      case SecurityGroupsActions.DELETE_SECURITY_GROUP:
        deleteSecurityGroup(pageActionsState.data)
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
      case SecurityGroupsActions.ADD_SECURITY_GROUP:
        toast("Security group added successfully.");
        break;
      case SecurityGroupsActions.UPDATE_SECURITY_GROUP:
        toast("Security group updated successfully.");
        break;
      case SecurityGroupsActions.DELETE_SECURITY_GROUP:
        toast("Security group deleted successfully.");
        break;
    }
  };

  const handleSubmit = (values: UpsertSecurityGroupModel) => {
    switch (pageActionsState.actionId) {
      case SecurityGroupsActions.ADD_SECURITY_GROUP:
        addSecurityGroup(values)
          .unwrap()
          .then(() => {
            showMessage();
          })
          .then(() => {
            handleModalClose();
          });
        break;
      case SecurityGroupsActions.UPDATE_SECURITY_GROUP:
        updateSecurityGroup(values)
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

  const onClickAddSecurityGroup = () => {
    setPageActionsState({
      actionId: SecurityGroupsActions.ADD_SECURITY_GROUP,
      title: "Add Security Group",
      data: {},
      visible: true,
      okButtonText: "Add",
    });
  };

  const onClickEditSecurityGroup = (data: any) => {
    setPageActionsState({
      actionId: SecurityGroupsActions.UPDATE_SECURITY_GROUP,
      title: "Update Security Group",
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

  useEffect(() => {
    formikRef?.current?.setValues(pageActionsState.data);
  }, [pageActionsState, formikRef]);

  const columns: GridColDef[] = [
    {
      sortable: false,
      headerName: "ID",
      field: "id",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            sx={{ height: "100%" }}
          >
            <GroupOutlinedIcon />
            <Typography>{params.row.name}</Typography>
          </Stack>
        );
      },
    },
    {
      field: "usersInGroup",
      headerName: "Users In Group",
      flex: 1,
    },
    {
      sortable: false,
      headerName: "Created On",
      field: "createdOn",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        return params.row.createdOn ? (
          <Stack
            direction={"column"}
            sx={{ height: "100%" }}
            justifyContent={"center"}
          >
            <Typography sx={{ fontSize: "0.875rem" }}>
              {DateTimeUtilities.toLocalDate(params.row.createdOn)}
            </Typography>
            <Typography sx={{ fontSize: "0.875rem" }}>
              ({DateTimeUtilities.toRelativeTime(params.row.createdOn)})
            </Typography>
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
            sx={{ height: "100%" }}
            justifyContent="start"
            flexDirection="row"
            gap={1}
          >
            <Tooltip title="View role info">
              <IconButton
                aria-label="View role button"
                onClick={() =>
                  navigate(
                    NavUtilities.ToSecureArea(
                      `security/security-groups/view?groupId=${params.row.id}`
                    )
                  )
                }
              >
                <ArrowForwardIcon sx={{ color: "darkgreen" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit role.">
              <IconButton
                onClick={() => onClickEditSecurityGroup(params.row)}
                aria-label="Edit role button"
              >
                <EditOutlinedIcon sx={{ color: "darkblue" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete role.">
              <IconButton
                onClick={() => onDeleteSecurityGroupClicked(params.row)}
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

  const getActionView = () => {
    switch (pageActionsState.actionId) {
      case SecurityGroupsActions.ADD_SECURITY_GROUP:
      case SecurityGroupsActions.UPDATE_SECURITY_GROUP:
        return (
          <UpsertSecurityGroupForm
            formikRef={formikRef}
            onSubmit={handleSubmit}
            actionId={pageActionsState.actionId}
          />
        );
      case SecurityGroupsActions.DELETE_SECURITY_GROUP:
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
              variant="contained"
              onClick={onClickAddSecurityGroup}
              startIcon={<AddOutlinedIcon />}
            >
              Add Security Group
            </Button>
          )}
        </Stack>
      }
      content={
        <>
          <Grid container spacing={0.8}>
            <Grid size={{ xs: 12, md: 12, sm: 12 }}>
              {isLoading ? (
                <Skeleton height={400} />
              ) : (
                <AppDataGrid
                  records={securityGroupsData?.data.items ?? []}
                  columns={columns}
                  totalRecords={securityGroupsData?.data.totalItems ?? 0}
                  isFetching={false}
                  overlayMessage="No security groups are present."
                  paginationState={filterState}
                  setPaginationState={setFilterState}
                  setRowId={(row) => row.id}
                  selectedRows={undefined}
                  columnsToHide={[]}
                  hasNextPage={securityGroupsData?.data?.isNextPage ?? false}
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
            <>{getActionView()}</>
          </AppModal>
        </>
      }
    />
  );
};

export default ViewSecurityGroups;
