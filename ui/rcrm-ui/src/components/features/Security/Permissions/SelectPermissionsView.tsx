import AppLoader from "@/components/ui-components/AppLoader";
import {
  useGetAllPermissionsQuery,
  useGetAllTenantPermissionsQuery,
} from "@/services/Security/PermissionService";
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import AppAccordion from "@/components/ui-components/AppAccordion";
import AppConstants from "@/constants/constants";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import Grid from "@mui/material/Grid2";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AppModal from "@/components/ui-components/AppModal";
import ViewSelectedPermissions from "./ViewSelectedPermissions";
import { GroupedPermissions } from "@/models/Security/Permissions/GroupedPermissionsModel";

interface SelectPermissionsViewProps {
  permissions: GroupedPermissions[];
  isLoading: boolean;
  onClearSelection: () => void;
  onSelectAll: (
    groupId: string,
    groupPermissions: KeyValuePair<string, string>[],
    isGroupSelected: boolean
  ) => void;
  onToggle: (groupId: string, permission: KeyValuePair<string, string>) => void;
  selectedPermissions: Record<string, KeyValuePair<string, string>[]>;
}

const SelectPermissionsView = (props: SelectPermissionsViewProps) => {
  const [expandAll, setExpandAll] = useState<boolean>(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [viewPermissionListModal, setViewPermissionListModel] =
    useState<boolean>(false);

  const permissionsSelected = useMemo(() => {
    return Object.entries(props.selectedPermissions).some(
      ([_, permissions]) => permissions.length > 0
    );
  }, [props.selectedPermissions]);

  const temp = useMemo(() => {
    return (
      <ViewSelectedPermissions
        onToggle={props.onToggle}
        selectedPermissions={props.selectedPermissions}
      />
    );
  }, [props.selectedPermissions]);

  if (props.isLoading) {
    return <AppLoader />;
  }

  const handleAccordionToggle = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);

      if (expandAll) {
        setExpandAll(false);
      }

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }

      return newSet;
    });
  };

  const handleExpandAll = (groupIds: Set<string>) => {
    setExpandAll((prev) => {
      if (!prev) {
        setExpandedIds(new Set(groupIds));
      } else {
        setExpandedIds(new Set());
      }
      return !prev;
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={"space-between"}
          spacing={2}
          sx={{ marginBottom: "0.2rem" }}
        >
          <Tooltip title="Click to view selected permissions">
            <Button
              onClick={() => setViewPermissionListModel(true)}
              size="small"
              sx={{ display: "flex", gap: AppConstants.layout.StandardSpacing }}
            >
              <Typography variant="overline">
                View Selected Permissions
              </Typography>
              <Chip
                color="primary"
                label={Object.values(props.selectedPermissions).reduce(
                  (acc, perms) => acc + perms.length,
                  0
                )}
                size="small"
              />
            </Button>
          </Tooltip>

          <Stack direction={"row"} gap={2}>
            {permissionsSelected && (
              <Button
                startIcon={<ClearOutlinedIcon />}
                variant="outlined"
                onClick={props.onClearSelection}
                size="small"
              >
                CLEAR SELECTION
              </Button>
            )}
            <Button
              startIcon={
                expandAll === true ? <ExpandLessIcon /> : <ExpandMoreIcon />
              }
              variant="outlined"
              onClick={() =>
                handleExpandAll(new Set(Object.keys(props.selectedPermissions)))
              }
              size="small"
            >
              {expandAll === true ? "Collapse All" : "Expand All"}
            </Button>
          </Stack>
        </Stack>
      </Grid>

      {/* Permissions List */}
      <Grid size={12}>
        <Paper variant="outlined" sx={{ padding: "0.5rem" }}>
          <Grid container spacing={1}>
            {props.permissions.map((group) => {
              const groupSelected =
                props.selectedPermissions[group.name]?.length ===
                  group.permissions.length && group.permissions.length > 0;

              return (
                <Grid size={12} key={group.name}>
                  <AppAccordion
                    id={group.name}
                    title={group.name}
                    expanded={expandedIds.has(group.name) || expandAll}
                    onToggle={handleAccordionToggle}
                    showCustomTitle={true}
                    renderTitle={
                      <Typography variant="subtitle2">
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography sx={{ fontWeight: "bold" }} variant="h6">
                            {group.name}
                          </Typography>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={groupSelected}
                                size="small"
                                onChange={() =>
                                  props.onSelectAll(
                                    group.name,
                                    group.permissions,
                                    groupSelected
                                  )
                                }
                                color="primary"
                              />
                            }
                            label={
                              !groupSelected ? "Select All" : "Unselect All"
                            }
                          />
                        </Stack>
                      </Typography>
                    }
                    content={
                      <List>
                        {group.permissions.map((permission, index) => (
                          <>
                            <Stack
                              key={permission.key}
                              direction="row"
                              alignItems="center"
                            >
                              <ListItem
                                sx={{ cursor: "pointer" }}
                                key={permission.key}
                                onClick={() =>
                                  props.onToggle(group.name, permission)
                                }
                              >
                                <Checkbox
                                  edge="start"
                                  size="small"
                                  checked={
                                    props.selectedPermissions[group.name]?.some(
                                      (item) => item.key === permission.key
                                    ) || false
                                  }
                                  onChange={() =>
                                    props.onToggle(group.name, permission)
                                  }
                                  disableRipple
                                />

                                <Typography variant="caption">
                                  {permission.value}
                                </Typography>
                              </ListItem>
                              <Tooltip title="Info" placement="right-start">
                                <IconButton size="small">
                                  <InfoOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                            {index !== group.permissions.length - 1 && (
                              <Divider />
                            )}
                          </>
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
      <AppModal
        fullScreen
        children={temp}
        modalTitle={"View"}
        okButtonText="Close"
        handleOk={() => setViewPermissionListModel(false)}
        show={viewPermissionListModal}
        hideCancelButton={true}
      ></AppModal>
    </Grid>
  );
};

export default SelectPermissionsView;
