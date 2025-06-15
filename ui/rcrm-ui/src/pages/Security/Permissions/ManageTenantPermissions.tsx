import AppLoader from "@/components/ui-components/AppLoader";
import {
  useGetAllPermissionsQuery,
  useManagePermissionsForTenantMutation,
} from "@/services/Security/PermissionService";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useRef, useState } from "react";
import Grid from "@mui/material/Grid2";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AppModal from "@/components/ui-components/AppModal";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { AppModalState } from "@/models/Common/ModalState";
import { PermissionsActions } from "@/enumerations/Security/Permissions/permissions-actions.enum";
import ManageTenantPermissionsForm from "@/components/features/Security/Permissions/ManageTenantPermissionsForm";
import { AssignOrUnassignPermissionForTenantModel } from "@/models/Security/Permissions/AssignOrUnassignPermissionForTenantModel";
import { toast } from "react-toastify";
import AppPage from "@/components/ui-components/AppPage";
import AppAccordion from "@/components/ui-components/AppAccordion";
import AppConstants from "@/constants/constants";
import NavUtilities from "@/utilities/NavUtilities";

const ManageTenantPermissions = () => {
  const [selectedPermissions, setSelectedPermissions] = useState<
    KeyValuePair<string, string>[]
  >([]);
  const formikRef = useRef<any>(null);
  const [pageActionsState, setPageActionsState] = useState<AppModalState>({
    visible: false,
    title: undefined,
    actionId: 0,
    data: undefined,
    okButtonText: undefined,
  });
  const [manageTenantPermissions] = useManagePermissionsForTenantMutation();

  const handleToggle = (permission: KeyValuePair<string, string>) => {
    setSelectedPermissions((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (item) => item.key === permission.key
      );
      if (isAlreadySelected) {
        return prevSelected.filter((item) => item.key !== permission.key);
      } else {
        return [...prevSelected, permission];
      }
    });
  };

  const handleSelectAll = (
    groupPermissions: KeyValuePair<string, string>[],
    isSelected: boolean
  ) => {
    setSelectedPermissions((prevSelected: KeyValuePair<string, string>[]) => {
      if (isSelected) {
        return prevSelected.filter(
          (item) => !groupPermissions.some((perm) => perm.key === item.key)
        );
      } else {
        const newPermissions = groupPermissions.filter(
          (perm) => !prevSelected.some((item) => item.key === perm.key)
        );
        return [...prevSelected, ...newPermissions];
      }
    });
  };

  const { data: permissionsData, isLoading } = useGetAllPermissionsQuery(null);

  const showMessage = () => {
    switch (pageActionsState.actionId) {
      case PermissionsActions.ASSIGN_PERMISSIONS:
        toast("Permissions added successfully.");
        break;
      case PermissionsActions.REMOVE_PERMISSIONS:
        toast("Permissions removed successfully.");
        break;
    }
  };

  const handleSubmit = (values: AssignOrUnassignPermissionForTenantModel) => {
    switch (pageActionsState.actionId) {
      case PermissionsActions.ASSIGN_PERMISSIONS:
      case PermissionsActions.REMOVE_PERMISSIONS:
        manageTenantPermissions({
          tenants: values.tenants.map((x) => x.value),
          permissions: selectedPermissions.map((x) => x.key),
          action: pageActionsState.actionId,
        })
          .unwrap()
          .then(() => {
            showMessage();
          })
          .then(() => {
            handleModalClose();
          })
          .finally(() => {
            setSelectedPermissions([]);
          });
        break;
    }
  };

  const getViewBasedByAction = () => {
    switch (pageActionsState.actionId) {
      case PermissionsActions.ASSIGN_PERMISSIONS:
      case PermissionsActions.REMOVE_PERMISSIONS:
        return (
          <ManageTenantPermissionsForm
            formikRef={formikRef}
            onSubmit={handleSubmit}
            actionId={pageActionsState.actionId}
          />
        );
    }
  };

  const onClickAssignPermissions = () => {
    setPageActionsState({
      actionId: PermissionsActions.ASSIGN_PERMISSIONS,
      title: "Assign permissions",
      data: {},
      visible: true,
      okButtonText: "Assign",
    });
  };

  const onClickRemovePermissions = async (data: any) => {
    setPageActionsState({
      actionId: PermissionsActions.REMOVE_PERMISSIONS,
      title: "Remove Permissions",
      data: data,
      visible: true,
      okButtonText: "Remove",
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

  const handleOk = () => {
    switch (pageActionsState.actionId) {
      case PermissionsActions.ASSIGN_PERMISSIONS:
      case PermissionsActions.REMOVE_PERMISSIONS:
        formikRef?.current?.submitForm();
        break;
    }
  };

  return (
    <AppPage
      title="Permission Pool"
      pageAlerts={
        <Alert severity="info" sx={{ display: "flex", alignItems: "center" }}>
          We’ve introduced a new way to manage tenant permissions.
          <Button
            href={NavUtilities.ToSecureArea("security/permissions-pool/new")}
          >
            Switch to the new experience
          </Button>
        </Alert>
      }
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
            <Stack direction={"row"} gap={2}>
              <Button
                disabled={selectedPermissions.length <= 0}
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                onClick={onClickAssignPermissions}
              >
                Assign Permissions
              </Button>
              <Button
                disabled={selectedPermissions.length <= 0}
                startIcon={<ClearOutlinedIcon />}
                variant="outlined"
                onClick={onClickRemovePermissions}
              >
                Remove Permissions
              </Button>
            </Stack>
          )}
        </Stack>
      }
      content={
        <>
          <Grid container spacing={3}>
            {selectedPermissions.length > 0 && (
              <Grid size={{ xs: 12, md: 12 }}>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"flex-start"}
                  sx={{ marginBottom: "0.5rem" }}
                  gap={2}
                >
                  <Typography variant="caption">
                    Selected Permissions{" "}
                    <Chip label={selectedPermissions.length} size="small" />
                  </Typography>
                  <Chip
                    label="Clear selection"
                    variant="outlined"
                    onClick={() => {
                      setSelectedPermissions([]);
                    }}
                  />
                </Stack>

                <Paper variant="outlined" sx={{ padding: "0.5rem" }}>
                  <Grid container spacing={AppConstants.layout.StandardSpacing}>
                    {selectedPermissions.map((permission) => (
                      <Grid size={{ md: 3, sm: 3 }} key={permission.key}>
                        <Paper variant="outlined" style={{ padding: "10px" }}>
                          <Typography variant="body2">
                            {permission.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                          >{`ID: ${permission.key}`}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 12 }}>
              <Paper variant="outlined" sx={{ padding: "0.5rem" }}>
                <Grid container spacing={0.8}>
                  {permissionsData?.data.map((group) => {
                    const groupSelected = group.permissions.every((perm) =>
                      selectedPermissions.some((item) => item.key === perm.key)
                    );
                    return (
                      <Grid
                        size={12}
                        key={group.id}
                        // style={{ display: "flex" }}
                      >
                        <AppAccordion
                          id={group.id}
                          title={group.name}
                          showCustomTitle={true}
                          renderTitle={
                            <Typography variant="subtitle2" component="div">
                              <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                                flexWrap={"wrap"}
                                alignItems={"center"}
                              >
                                {group.name}
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={groupSelected}
                                      size="small"
                                      onChange={() =>
                                        handleSelectAll(
                                          group.permissions,
                                          groupSelected
                                        )
                                      }
                                      name="selectAll"
                                      color="primary"
                                    />
                                  }
                                  label="Select All"
                                />
                              </Stack>
                            </Typography>
                          }
                          content={
                            <List>
                              {group.permissions.map((permission) => (
                                <Stack
                                  key={permission.key}
                                  direction={"row"}
                                  alignItems={"center"}
                                >
                                  <ListItem
                                    key={permission.key}
                                    onClick={() => handleToggle(permission)}
                                  >
                                    <Checkbox
                                      edge="start"
                                      size="small"
                                      checked={selectedPermissions.some(
                                        (item) => item.key === permission.key
                                      )}
                                      tabIndex={-1}
                                      disableRipple
                                      inputProps={{
                                        "aria-labelledby": `checkbox-list-label-${permission.key}`,
                                      }}
                                    />
                                    {/* <ListItemText
                                  id={`checkbox-list-label-${permission.key}`}
                                  primary={permission.value}
                                /> */}
                                    <Typography
                                      id={`checkbox-list-label-${permission.key}`}
                                      variant="caption"
                                    >
                                      {permission.value}
                                    </Typography>
                                  </ListItem>
                                  <Tooltip
                                    title="Delete"
                                    placement="right-start"
                                  >
                                    <IconButton size="small">
                                      <InfoOutlinedIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              ))}
                            </List>
                          }
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <AppModal
            modalTitle={pageActionsState.title}
            show={pageActionsState.visible}
            okButtonText={pageActionsState.okButtonText}
            handleOk={handleOk}
            handleClose={handleModalClose}
          >
            <>{getViewBasedByAction()}</>
          </AppModal>
        </>
      }
    />
  );
};

export default ManageTenantPermissions;
