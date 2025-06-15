import React, { useState } from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { AssignmentTurnedIn, DoNotDisturbAlt } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import { PermissionsActions } from "@/enumerations/Security/Permissions/permissions-actions.enum";

export interface PermissionActionProps {
  selected: PermissionsActions;
  setSelected: React.Dispatch<React.SetStateAction<PermissionsActions>>;
}

const PermissionActionCards = (props: PermissionActionProps) => {
  const theme = useTheme();

  const handleSelect = (type: any) => {
    props.setSelected(type);
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card
          variant="outlined"
          sx={{
            borderColor:
              props.selected === PermissionsActions.ASSIGN_PERMISSIONS
                ? theme.palette.primary.main
                : "#ccc",
            backgroundColor:
              props.selected === PermissionsActions.ASSIGN_PERMISSIONS
                ? theme.palette.primary.main + "22"
                : "transparent",
          }}
        >
          <CardActionArea
            onClick={() => handleSelect(PermissionsActions.ASSIGN_PERMISSIONS)}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <AssignmentTurnedIn
                color={
                  props.selected === PermissionsActions.ASSIGN_PERMISSIONS
                    ? "primary"
                    : "inherit"
                }
                fontSize="large"
              />
              <Typography
                variant="h6"
                color={
                  props.selected === PermissionsActions.ASSIGN_PERMISSIONS
                    ? "primary"
                    : "inherit"
                }
              >
                Assign
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Card
          variant="outlined"
          sx={{
            borderColor:
              props.selected === PermissionsActions.REMOVE_PERMISSIONS
                ? theme.palette.primary.main
                : "#ccc",
            backgroundColor:
              props.selected === PermissionsActions.REMOVE_PERMISSIONS
                ? theme.palette.primary.main + "22"
                : "transparent",
          }}
        >
          <CardActionArea
            onClick={() => handleSelect(PermissionsActions.REMOVE_PERMISSIONS)}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <DoNotDisturbAlt
                color={
                  props.selected === PermissionsActions.REMOVE_PERMISSIONS
                    ? "primary"
                    : "inherit"
                }
                fontSize="large"
              />
              <Typography
                variant="h6"
                color={
                  props.selected === PermissionsActions.REMOVE_PERMISSIONS
                    ? "primary"
                    : "inherit"
                }
              >
                Unassign
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PermissionActionCards;
