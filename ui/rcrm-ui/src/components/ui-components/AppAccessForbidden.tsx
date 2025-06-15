import AppConstants from "@/constants/constants";
import { Paper, Stack, Typography } from "@mui/material";

const AppAccessForbidden = () => {
  return (
    <Paper
      variant="outlined"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Stack
        spacing={AppConstants.layout.StandardSpacing}
        alignItems="center"
        textAlign="center"
      >
        <Typography
          variant="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#616161",
          }}
        >
          403
        </Typography>
        <Typography variant="h6" color="textSecondary">
          You do not have access to the requested resource.
        </Typography>
      </Stack>
    </Paper>
  );
};

export default AppAccessForbidden;
