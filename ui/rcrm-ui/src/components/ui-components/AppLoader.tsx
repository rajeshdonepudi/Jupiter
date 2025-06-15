import { Box, CircularProgress } from "@mui/material";

const AppLoader = (props: {
  height?: string;
  width?: string;
  showDefaultLoader?: boolean;
}) => {
  
  return (
    <Box
    sx={{
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: '100vh'
    }}
  >
    <CircularProgress />
  </Box>
  );
};

export default AppLoader;
