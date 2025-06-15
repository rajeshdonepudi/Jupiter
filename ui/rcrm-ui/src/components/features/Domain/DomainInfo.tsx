import AppIcon from "@/components/ui-components/AppIcon";
import AppPaper from "@/components/ui-components/AppPaper";
import AppSimpleValue from "@/components/ui-components/AppSimpleValue";
import AppConstants from "@/constants/constants";
import { DomainWhois } from "@/models/Domain/ViewDomainInfoModel";
import DnsIcon from "@mui/icons-material/Dns";
import Grid from "@mui/material/Grid2";
import {
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

const DomainInfo = ({
  data,
  isLoading,
}: {
  data: DomainWhois | undefined;
  isLoading: boolean;
}) => {
  const theme = useTheme();
  return (
    <Grid container spacing={0.8}>
      <Grid size={{ md: 8 }}>
        <AppPaper>
          <CardContent>
            <Typography gutterBottom variant="subtitle2">
              Domain Details
            </Typography>
            <Divider sx={{ margin: "0.2rem" }} />
            <Grid container spacing={AppConstants.layout.StandardSpacing}>
              <Grid size={12}>
                <AppSimpleValue
                  isDataLoading={isLoading}
                  title={"Domain"}
                  value={data?.domain}
                />
              </Grid>
              <Grid size={12}>
                <AppSimpleValue
                  isDataLoading={isLoading}
                  title={"Registrar"}
                  value={data?.status}
                />
              </Grid>
            </Grid>
          </CardContent>
        </AppPaper>
        <AppPaper>
          <CardContent>
            <Typography gutterBottom variant="subtitle2">
              Registrar
            </Typography>
            <Divider sx={{ margin: "0.2rem" }} />
            <Grid container spacing={AppConstants.layout.StandardSpacing}>
              <Grid size={{ md: 3 }}>
                <AppSimpleValue
                  isDataLoading={isLoading}
                  title={"Name"}
                  value={data?.registrar.name}
                />
              </Grid>
            </Grid>
          </CardContent>
        </AppPaper>
        <AppPaper>
          <CardContent>
            <Typography gutterBottom variant="subtitle2">
              Registrant
            </Typography>
            <Divider sx={{ margin: "0.2rem" }} />
            <Grid container spacing={AppConstants.layout.StandardSpacing}>
              <Grid size={{ md: 3 }}>
                <AppSimpleValue
                  isDataLoading={isLoading}
                  title={"Organization"}
                  value={data?.registrant.organization}
                />
              </Grid>
              <Grid size={{ md: 3 }}>
                <AppSimpleValue
                  isDataLoading={isLoading}
                  title={"Region"}
                  value={data?.registrant.region}
                />
              </Grid>
              <Grid size={{ md: 3 }}>
                <AppSimpleValue
                  isDataLoading={isLoading}
                  title={"Country"}
                  value={data?.registrant.country}
                />
              </Grid>
            </Grid>
          </CardContent>
        </AppPaper>
      </Grid>
      <Grid size={{ md: 4 }}>
        <AppPaper>
          <CardContent>
            <Typography gutterBottom variant="subtitle2">
              Nameservers
            </Typography>
            <Divider sx={{ margin: "0.2rem" }} />
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={AppConstants.layout.StandardSpacing}
                    key={index}
                  >
                    <DnsIcon />
                    <Skeleton variant="text" width={150} />
                  </Stack>
                ))
              : data?.nameservers.map((s, index) => (
                  <Stack
                    margin={"0.5rem"}
                    direction="row"
                    alignItems="center"
                    spacing={AppConstants.layout.StandardSpacing}
                    key={index}
                  >
                    <AppIcon
                      Icon={DnsIcon}
                      color={theme.palette.primary.main}
                    />
                    <Typography variant="subtitle1" gutterBottom>
                      {s}
                    </Typography>
                  </Stack>
                ))}
          </CardContent>
        </AppPaper>
      </Grid>
    </Grid>
  );
};

export default DomainInfo;
