import { Box, Card, Typography } from "@mui/material";

const AppNoInternet = () => {
  return (
    <Box
      sx={{ width: "97vw", height: "94vh" }}
      alignItems={"center"}
      justifyContent={"center"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Typography variant="h6">
        You are offline! Please check your internet connection.
      </Typography>
    </Box>
  );
};

export default AppNoInternet;
