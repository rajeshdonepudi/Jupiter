import Grid from "@mui/material/Grid2";
import { InfoField } from "./AppInfoField";

interface InfoItem {
  label: string;
  value?: string | number | null;
}

interface InfoGridProps {
  items: InfoItem[];
  loading?: boolean;
  columns?: number; // how many columns per row
  spacing?: number;
}

export const InfoGrid = ({
  items,
  loading = false,
  columns = 3,
  spacing = 2,
}: InfoGridProps) => {
  const mdSize = Math.floor(12 / columns);

  return (
    <Grid container spacing={spacing}>
      {items.map((item, index) => (
        <Grid key={index} size={{ xs: 12, md: mdSize }}>
          <InfoField label={item.label} value={item.value} loading={loading} />
        </Grid>
      ))}
    </Grid>
  );
};
