// components/AppTabContainer.tsx
import { Box } from "@mui/material";

const AppTabContainer = ({ children }: any) => (
  <Box
    sx={{
      mt: 2,
      borderRadius: 2,
      p: 2,
      border: "1px solid",
      borderColor: (t) => t.palette.divider,
      backgroundColor: (t) =>
        t.palette.mode === "light" ? "#fff" : "rgba(255,255,255,0.04)",
    }}
  >
    {children}
  </Box>
);

export default AppTabContainer;
