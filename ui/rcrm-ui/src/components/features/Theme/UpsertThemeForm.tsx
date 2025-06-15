import fontStyles from "@/constants/font-styles";
import MenuProps from "@/constants/menu-props";
import Grid from "@mui/material/Grid2";
import { ThemePreferenceEnum } from "@/enumerations/Theme/ThemePreferenceEnum";
import StringUtilities from "@/utilities/StringUtilities";
import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AppPaper from "@/components/ui-components/AppPaper";

const UpsertThemeForm = (props: any) => {
  return (
    <form onSubmit={props.formik.handleSubmit}>
      <Grid container spacing={1.5}>
        <Grid size={6}>
          <Stack gap={1}>
            <FormLabel>Primary Color</FormLabel>
            <TextField
              size="small"
              type="color"
              id="primaryColor"
              name="primaryColor"
              variant="outlined"
              value={props.formik.values.primaryColor}
              error={props.formik.touched.primaryColor}
              helperText={
                props.formik.touched.primaryColor &&
                props.formik.errors.primaryColor
              }
              onChange={props.formik.handleChange}
            />
          </Stack>
        </Grid>

        <Grid size={6}>
          <Stack gap={1}>
            <FormLabel>Secondary Color</FormLabel>
            <TextField
              size="small"
              type="color"
              id="secondaryColor"
              name="secondaryColor"
              variant="outlined"
              value={props.formik.values.secondaryColor}
              helperText={
                props.formik.touched.secondaryColor &&
                props.formik.errors.secondaryColor
              }
              onChange={props.formik.handleChange}
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <Grid container spacing={0.8}>
            <Grid size={6}>
              <Stack>
                <FormLabel>Primary Color</FormLabel>
                <Typography variant="body2">
                  {StringUtilities.isNullOrEmptyOrWhitespace(
                    props?.formik?.values?.primaryColor
                  ) ? (
                    <Typography variant="body2">Unselected</Typography>
                  ) : (
                    props?.formik?.values?.primaryColor
                  )}
                </Typography>
              </Stack>
            </Grid>
            <Grid size={6}>
              <Stack>
                <Stack>
                  <FormLabel>Secondary Color</FormLabel>
                  <Typography variant="body2">
                    {StringUtilities.isNullOrEmptyOrWhitespace(
                      props?.formik?.values?.secondaryColor
                    ) ? (
                      <Typography variant="body2">Unselected</Typography>
                    ) : (
                      props?.formik?.values?.secondaryColor
                    )}
                  </Typography>
                </Stack>
                <Stack></Stack>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid size={12}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="font-family-label">Font Family</InputLabel>
            <Select
              labelId="font-family-label"
              id="font-family-select-box"
              value={props.formik.values.fontFamily}
              input={<OutlinedInput label="Font Family" />}
              MenuProps={MenuProps}
              name="fontFamily"
              onChange={props.formik.handleChange}
            >
              {Object.keys(fontStyles).map((key: any) => (
                <MenuItem key={key} value={Object(fontStyles)[key]}>
                  <Card>
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {Object(fontStyles)[key]}
                      </Typography>
                      <Typography
                        style={{
                          fontFamily: Object(fontStyles)[key],
                          fontWeight: "bold",
                        }}
                        variant="h6"
                        component="div"
                      >
                        The quick brown fox jumps over the lazy dog
                      </Typography>
                    </CardContent>
                  </Card>
                  {/* <ListItemText
                    primary={Object(fontStyles)[key]}
                    secondary={
                      <span
                        style={{
                          fontFamily: Object(fontStyles)[key],
                          fontWeight: "bold",
                        }}
                      >
                        The quick brown fox jumps over the lazy dog
                      </span>
                    }
                  /> */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Theme</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={ThemePreferenceEnum.NotSpecified}
              name="themePreference"
              value={
                props.formik.values.themePreference ??
                ThemePreferenceEnum.NotSpecified
              }
              onChange={props.formik.handleChange}
            >
              <Stack>
                <FormControlLabel
                  value={ThemePreferenceEnum.SystemDefault}
                  control={<Radio />}
                  label={
                    <Typography variant="body2">System Default</Typography>
                  }
                />
                {/* <FormHelperText>
                  {
                    "Turn on dark themePreference when your device's dark themePreference is on"
                  }
                </FormHelperText> */}
              </Stack>
              <FormControlLabel
                value={ThemePreferenceEnum.Light}
                control={<Radio />}
                label={<Typography variant="body2">Light</Typography>}
              />
              <FormControlLabel
                value={ThemePreferenceEnum.Dark}
                control={<Radio />}
                label={<Typography variant="body2">Dark</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="isPrimary"
                checked={props.formik.values.isPrimary}
                value={props.formik.values.isPrimary}
                onChange={props.formik.handleChange}
              />
            }
            label={<Typography variant="body2">Make Primary</Typography>}
          />
        </Grid>
        {/* <Grid md={12}>
            <AppButton
              style={{ width: "100%" }}
              size="large"
              type="submit"
              variant="contained"
            >
              Save
            </AppButton>
          </Grid> */}
      </Grid>
    </form>
  );
};

export default UpsertThemeForm;
