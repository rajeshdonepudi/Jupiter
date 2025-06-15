import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { Divider, IconButton, Paper, Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";
import Grid from "@mui/material/Grid2";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import AppConstants from "@/constants/constants";
interface ViewSelectedPermissions {
  selectedPermissions: Record<string, KeyValuePair<string, string>[]>;
  onToggle: (groupId: string, permission: KeyValuePair<string, string>) => void;
}

const ViewSelectedPermissions = (props: ViewSelectedPermissions) => {
  const permissionsSelected = useMemo(() => {
    return Object.entries(props.selectedPermissions).some(
      ([_, permissions]) => permissions.length > 0
    );
  }, [props.selectedPermissions]);

  return !permissionsSelected ? (
    <Stack alignItems={"center"}>
      <Typography variant="h5" gutterBottom>
        No permissions selected.
      </Typography>
    </Stack>
  ) : (
    Object.entries(props.selectedPermissions).map(
      ([groupId, permissions]) =>
        permissions.length > 0 && (
          <Paper
            key={groupId}
            variant="outlined"
            sx={{
              padding: AppConstants.layout.StandardPadding,
              marginBottom: "1rem",
            }}
          >
            <Typography gutterBottom variant="button">
              <Divider>{groupId}</Divider>
            </Typography>
            <Grid container spacing={AppConstants.layout.StandardSpacing}>
              {permissions.map((permission) => (
                <Grid key={permission.key} size={{ md: 4, xl: 3, sm: 12 }}>
                  <Paper
                    variant="outlined"
                    sx={{ padding: AppConstants.layout.StandardPadding }}
                  >
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <Typography variant="body2">
                        {permission.value}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => props.onToggle(groupId, permission)}
                      >
                        <RemoveCircleOutlineOutlinedIcon />
                      </IconButton>
                    </Stack>

                    <Typography
                      variant="body2"
                      color="textSecondary"
                    >{`ID: ${permission.key}`}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )
    )
  );
};

export default ViewSelectedPermissions;
