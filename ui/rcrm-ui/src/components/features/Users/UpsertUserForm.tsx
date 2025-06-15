import AppConstants from "@/constants/constants";
import { UpsertUserModel } from "@/models/Users/UpsertUserModel";
import UpsertUserValidationScheme from "@/validation-schemes/Users/UpsertUserValidationScheme";
import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFormik } from "formik";
import { MuiTelInput } from "mui-tel-input";
import { lazy, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
const Visibility = lazy(() => import("@mui/icons-material/Visibility"));
const VisibilityOff = lazy(() => import("@mui/icons-material/VisibilityOff"));
const FormControlLabel = lazy(() => import("@mui/material/FormControlLabel"));
const FormGroup = lazy(() => import("@mui/material/FormGroup"));
const Switch = lazy(() => import("@mui/material/Switch"));
const FormControl = lazy(() => import("@mui/material/FormControl"));
const FormHelperText = lazy(() => import("@mui/material/FormHelperText"));
const IconButton = lazy(() => import("@mui/material/IconButton"));
const InputAdornment = lazy(() => import("@mui/material/InputAdornment"));
const InputLabel = lazy(() => import("@mui/material/InputLabel"));
const OutlinedInput = lazy(() => import("@mui/material/OutlinedInput"));
const Stack = lazy(() => import("@mui/material/Stack"));
const TextField = lazy(() => import("@mui/material/TextField"));

const UpsertUserForm = (props: any) => {
  const { t: commonLocale } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  /***
   * Event handler's
   */
  const onClickShowPassword = () => {
    setShowPassword((old) => !old);
  };

  const onClickShowConfirmPassword = (e: any) => {
    setShowConfirmPassword((old) => !old);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const formik = useFormik<UpsertUserModel>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      emailConfirmed: false,
      id: "",
      phoneNumberConfirmed: false,
      twoFactorEnabled: false,
      lockoutEnabled: false,
      isActive: false,
    },
    validationSchema: UpsertUserValidationScheme(props?.actionId),
    onSubmit: (values: UpsertUserModel) => {
      props?.onSubmit(values);
    },
  });

  useImperativeHandle(props?.formikRef, () => {
    return {
      submitForm: formik.submitForm,
      resetForm: formik.resetForm,
      setValues: formik.setValues,
    };
  });

  return (
    <>
      <Stack
        direction="column"
        alignItems="center"
        spacing={AppConstants.layout.StandardSpacing}
      >
        <form
          autoComplete="off"
          onSubmit={formik.handleSubmit}
          style={{ width: "100%" }}
        >
          <Grid container spacing={1.5}>
            <Grid size={6}>
              <TextField
                id="firstName"
                name="firstName"
                size="small"
                required={true}
                label={commonLocale("firstName")}
                variant="outlined"
                fullWidth
                value={formik.values?.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched?.firstName && Boolean(formik.errors.firstName)
                }
                helperText={
                  formik.touched?.firstName && formik.errors.firstName
                }
              />
            </Grid>

            <Grid size={6}>
              <TextField
                id="lastName"
                name="lastName"
                size="small"
                required={true}
                label={commonLocale("lastName")}
                variant="outlined"
                fullWidth
                value={formik.values?.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched?.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched?.lastName && formik.errors.lastName}
              />
            </Grid>

            <Grid size={6}>
              <TextField
                id="email"
                name="email"
                size="small"
                required={true}
                label={commonLocale("email")}
                variant="outlined"
                fullWidth
                value={formik.values?.email}
                onChange={formik.handleChange}
                error={formik.touched?.email && Boolean(formik.errors.email)}
                helperText={formik.touched?.email && formik.errors.email}
              />
            </Grid>

            <Grid size={6}>
              <MuiTelInput
                name="phone"
                id="phone"
                size="small"
                defaultCountry="IN"
                error={formik.touched?.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched?.phone && formik.errors.phone}
                label={commonLocale("phone")}
                fullWidth
                variant="outlined"
                value={formik.values?.phone}
                onChange={(e) => {
                  formik.setValues((prev: any) => {
                    return { ...prev, phone: e };
                  });
                }}
              />
            </Grid>

            <Grid size={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel required={true} htmlFor="password">
                  {commonLocale("password")}
                </InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  autoComplete="one-time-code"
                  type={showPassword ? "text" : "password"}
                  value={formik.values?.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched?.password && Boolean(formik.errors.password)
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={onClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label={commonLocale("password")}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {formik.touched?.password && formik.errors.password}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel
                  required={true}
                  sx={{ width: "inherit" }}
                  htmlFor={`${commonLocale("confirm")} ${commonLocale(
                    "password"
                  )}`}
                >
                  {`${commonLocale("confirm")} ${commonLocale("password")}`}
                </InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="one-time-code"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formik.values?.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched?.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={onClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label={`${commonLocale("confirm")} ${commonLocale(
                    "password"
                  )}`}
                />
                <FormHelperText sx={{ color: "red" }}>
                  {formik.touched?.confirmPassword &&
                    formik.errors.confirmPassword}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <Paper variant="outlined">
                <Grid container padding={AppConstants.layout.StandardPadding}>
                  <Grid size={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            id="emailConfirmed"
                            name="emailConfirmed"
                            size="small"
                            value={formik.values?.emailConfirmed}
                            checked={formik.values?.emailConfirmed}
                            onChange={formik.handleChange}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            {`${commonLocale("email")} ${commonLocale(
                              "confirmed"
                            )}`}
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            id="phoneNumberConfirmed"
                            name="phoneNumberConfirmed"
                            size="small"
                            value={formik.values?.phoneNumberConfirmed}
                            checked={formik.values?.phoneNumberConfirmed}
                            onChange={formik.handleChange}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            {`${commonLocale("phone")} ${commonLocale(
                              "confirmed"
                            )}`}
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            id="lockoutEnabled"
                            name="lockoutEnabled"
                            size="small"
                            value={formik.values?.lockoutEnabled}
                            checked={formik.values?.lockoutEnabled}
                            onChange={formik.handleChange}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            {`${commonLocale("lockout")} ${commonLocale(
                              "enabled"
                            )}`}
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            id="twoFactorEnabled"
                            name="twoFactorEnabled"
                            size="small"
                            value={formik.values?.twoFactorEnabled}
                            checked={formik.values?.twoFactorEnabled}
                            onChange={formik.handleChange}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            {`${commonLocale("twoFactor")} ${commonLocale(
                              "enabled"
                            )}`}
                          </Typography>
                        }
                      />
                    </FormGroup>
                  </Grid>
                  <Grid size={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            id="isActive"
                            name="isActive"
                            size="small"
                            value={formik.values?.isActive}
                            checked={formik.values?.isActive}
                            onChange={formik.handleChange}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            {`${commonLocale("isActive")}`}
                          </Typography>
                        }
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Stack>
    </>
  );
};

export default UpsertUserForm;
