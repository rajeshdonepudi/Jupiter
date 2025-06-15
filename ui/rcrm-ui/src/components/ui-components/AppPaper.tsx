import AppConstants from "@/constants/constants";
import { Paper } from "@mui/material";
import { PropsWithChildren } from "react";
import { AppSurfaceProps } from "./types/AppSurfaceProps";

const AppPaper = (props: PropsWithChildren<AppSurfaceProps>) => {
  return (
    <Paper
      sx={{ padding: AppConstants.layout.StandardPadding, width: "100%" }}
      variant="outlined"
    >
      {props.children}
    </Paper>
  );
};

export default AppPaper;
