import { Box, Stack, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Stack alignItems={"center"}>
        <Typography sx={{ fontWeight: "bold" }} variant="h1">
          Oops!
        </Typography>
        <Typography variant="h6">404 - Page not found</Typography>
        <Typography variant="subtitle2">
          The page you're looking for doesn't exist or has been moved.
        </Typography>
      </Stack>
    </Box>
  );
};

export default NotFound;
