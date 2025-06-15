import AppFalconOneRocket from "@/components/ui-components/AppFalconOneRocket";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { SiteTheme } from "@/models/Theme/SiteTheme";
import Grid from "@mui/material/Grid2";

const ThemesList = (props: {
  themes: SiteTheme[];
  onEditTheme: (payload: SiteTheme) => void;
  onDeleteTheme: (payload: string) => void;
}) => {
  return (
    <Grid container spacing={0.8}>
      {props.themes.map((x, index) => (
        <Grid
          key={x.id}
          sx={{ height: "100%" }}
          size={{ xl: 2, md: 3, sm: 12 }}
        >
          <Card variant="outlined">
            <CardHeader
              action={
                x.isPrimary && (
                  <IconButton>
                    <CheckCircleIcon
                      sx={{
                        color: "#367E18",
                      }}
                    />
                  </IconButton>
                )
              }
              title={`Theme #${index + 1}`}
            />
            <CardContent>
              <AppFalconOneRocket
                primaryColor={x.primaryColor}
                secondaryColor={x.secondaryColor}
              />
              <Stack justifyContent={"space-between"}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography variant="caption">Primary</Typography>
                  <Typography variant="body2">
                    {x.primaryColor.toLocaleUpperCase()}
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography variant="caption">Secondary</Typography>
                  <Typography variant="body2">
                    {x.secondaryColor.toLocaleUpperCase()}
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography variant="caption">Font Family</Typography>
                  <Typography variant="body2">{x.fontFamily}</Typography>
                </Stack>
              </Stack>
            </CardContent>
            <CardActions
              sx={{
                justifyContent: "space-between",
              }}
            >
              <IconButton
                onClick={() => props?.onEditTheme(x)}
                aria-label="share"
              >
                <EditOutlinedIcon />
              </IconButton>
              <IconButton
                onClick={() => props?.onDeleteTheme(x.id)}
                aria-label="add to favorites"
              >
                <DeleteOutlineOutlinedIcon sx={{ color: "darkred" }} />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ThemesList;
