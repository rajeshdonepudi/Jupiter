import { Box, Skeleton, Stack } from "@mui/material";

const AppChartSkeleton = ({ height = 300 }: { height?: number }) => {
  return (
    <Stack spacing={2} sx={{ width: "100%", padding: 2 }}>
      {/* Title placeholder */}
      <Skeleton variant="text" width={"40%"} height={28} />

      {/* Main chart area */}
      <Box
        sx={{
          width: "100%",
          height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          borderRadius: 2,
          bgcolor: "background.paper",
          overflow: "hidden",
          padding: 2,
        }}
      >
        {/* Fake horizontal grid lines */}
        {[...Array(6)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width={`${90 - i * 10}%`}
            height={10}
          />
        ))}
      </Box>
    </Stack>
  );
};

export default AppChartSkeleton;
