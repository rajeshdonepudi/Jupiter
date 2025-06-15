import { Skeleton, Stack, Typography } from "@mui/material";
import { FC } from "react";

export interface SimpleValueProps {
  isDataLoading: boolean;
  title: string;
  value: string | number | undefined;
  width?: number | null;
  height?: number | null;
}

const AppSimpleValue: FC<SimpleValueProps> = ({
  title,
  isDataLoading,
  value,
  width,
  height,
}) => {
  return isDataLoading ? (
    <Stack rowGap={2}>
      <Skeleton
        variant="rectangular"
        width={width ?? "100%"}
        height={height ?? 20}
      />
      <Skeleton
        variant="rectangular"
        width={width ?? "100%"}
        height={height ?? 20}
      />
    </Stack>
  ) : (
    <Stack>
      <Typography color={"grey"} variant="caption">
        {title}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
};

export default AppSimpleValue;
