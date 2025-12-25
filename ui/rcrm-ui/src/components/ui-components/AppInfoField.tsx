import { Stack, Skeleton, Typography } from "@mui/material";

interface InfoFieldProps {
  label: string;
  value?: string | number | null;
  loading?: boolean;
  widthLabel?: number;
  widthValue?: number;
}

export const InfoField = ({
  label,
  value,
  loading = false,
  widthLabel = 60,
  widthValue = 120,
}: InfoFieldProps) => {
  return (
    <Stack spacing={0.5}>
      {loading ? (
        <>
          <Skeleton variant="text" width={widthLabel} height={20} />
          <Skeleton variant="text" width={widthValue} height={24} />
        </>
      ) : (
        <>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body2">{value ?? "-"}</Typography>
        </>
      )}
    </Stack>
  );
};
