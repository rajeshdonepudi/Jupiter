import { Card, CardContent, Stack, Typography } from "@mui/material";
import AppIcon from "./AppIcon";
import { SvgIconComponent } from "@mui/icons-material";
import { LazyExoticComponent } from "react";

const AppMetricCard = (props: {
  count: number;
  title: string;
  icon?: SvgIconComponent | LazyExoticComponent<SvgIconComponent>; // Material-UI icon component
  color?: string;
}) => {
  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Stack
          alignItems={"center"}
          direction={"row"}
          justifyContent={"space-between"}
          alignContent={"space-between"}
        >
          {props.icon && props.color && (
            <AppIcon Icon={props?.icon as any} color={props?.color} />
          )}
          <Typography variant="h4">{props.count}</Typography>
        </Stack>
        <Typography sx={{ fontSize: 14 }}>{props.title}</Typography>
      </CardContent>
    </Card>
  );
};

export default AppMetricCard;
