import AppLoader from "@/components/ui-components/AppLoader";
import {
  useGetAllTenantPermissionsQuery,
  useManagePermissionsMutation,
} from "@/services/Security/PermissionService";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useRef, useState } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AppModal from "@/components/ui-components/AppModal";
import { AppModalState } from "@/models/Common/ModalState";
import { PermissionsActions } from "@/enumerations/Security/Permissions/permissions-actions.enum";
import UpsertPermissionsForm from "@/components/features/Security/Permissions/ManagePermissionsForm";
import { AssignOrUnassignPermissionModel } from "@/models/Security/Permissions/AssignOrUnassignPermissionModel";
import AppConstants from "@/constants/constants";
import Grid from "@mui/material/Grid2";
import AppPaper from "@/components/ui-components/AppPaper";

const ViewPermissions = () => {
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
  const [managePermissions] = useManagePermissionsMutation();

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

  const { data: permissionsData, isLoading } =
    useGetAllTenantPermissionsQuery(null);

  const handleSubmit = (values: AssignOrUnassignPermissionModel) => {
    debugger;

    switch (pageActionsState.actionId) {
      case PermissionsActions.ASSIGN_PERMISSIONS:
      case PermissionsActions.REMOVE_PERMISSIONS:
        managePermissions({
          users: values.users.map((x) => x.id),
          securityGroups: values.securityGroups.map((x) => x.value),
          action: pageActionsState.actionId,
          permissions: selectedPermissions.map((x) => x.key),
        });
        break;
    }
  };

  const getViewBasedByAction = () => {
    switch (pageActionsState.actionId) {
      case PermissionsActions.ASSIGN_PERMISSIONS:
      case PermissionsActions.REMOVE_PERMISSIONS:
        return (
          <UpsertPermissionsForm
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
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            flexWrap={"wrap"}
            justifyContent={"space-between"}
          >
            <Typography variant="h6">Permissions</Typography>
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
        </Grid>
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
                Selected Permissions
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
                  <Grid size={{ sm: 6, md: 3 }} key={permission.key}>
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
        <Grid size={{ xs: 12, md: 12, sm: 12 }}>
          <Paper variant="outlined" sx={{ padding: "0.5rem" }}>
            <Grid container spacing={0.8}>
              {permissionsData?.data.map((group) => {
                const groupSelected =
                  group.permissions.length > 0 &&
                  group.permissions.every((perm) =>
                    selectedPermissions.some((item) => item.key === perm.key)
                  );
                return (
                  <Grid
                    size={{ md: 4 }}
                    key={group.id}
                    style={{ display: "flex" }}
                  >
                    <Card
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                      variant="outlined"
                    >
                      <CardContent style={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div">
                          <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            flexWrap={"wrap"}
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
                        <List>
                          {group.permissions.map((permission) => (
                            <Stack
                              key={`TENANT_PERMISSION_${permission.key}`}
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
                                <Typography
                                  id={`checkbox-list-label-${permission.key}`}
                                  variant="caption"
                                >
                                  {permission.value}
                                </Typography>
                              </ListItem>
                              <Tooltip title="Delete" placement="right-start">
                                <IconButton size="small">
                                  <InfoOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
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
  );
};

export default ViewPermissions;
