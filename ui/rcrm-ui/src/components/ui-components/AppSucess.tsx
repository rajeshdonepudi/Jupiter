import { Box, Stack, Typography } from "@mui/material";
import React from "react";

const AppSucess = (props: any) => {
  return (
    <Stack direction="column" justifyContent="center" alignItems="center">
      <Typography sx={{ fontWeight: "bold", fontSize: "2.5rem" }}>
        {props.message}
      </Typography>
    </Stack>
  );
};

export default AppSucess;
