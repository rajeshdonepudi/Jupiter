import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { Stack } from "@mui/material";
interface TenantBasicInfoCardProps {
  imageUrl?: string;
  name: string;
  accountAlias: string;
}

export default function TenantBasicInfoCard(props: TenantBasicInfoCardProps) {
  return (
    <Card>
      <CardMedia
        sx={{ height: 200, objectFit: "contain" }}
        image={`data:image/png;base64,${props.imageUrl}`} // Ensure correct format
        title="Tenant Image"
      />

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.name}
        </Typography>
        <Grid container>
          <Grid size={12}>
            <Stack>
              <Typography variant="caption">Account Alias</Typography>
              <Typography variant="body2">{props.accountAlias}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
