import { Card, CardContent } from "@mui/material";
import { PropsWithChildren } from "react";
import { AppSurfaceProps } from "./types/AppSurfaceProps";

const AppCard = (props: PropsWithChildren<AppSurfaceProps>) => {
  return (
    <Card sx={{ height: props.height ?? "100%" }} variant="outlined">
      <CardContent sx={{ height: "100%" }}>{props.children}</CardContent>
    </Card>
  );
};

export default AppCard;
