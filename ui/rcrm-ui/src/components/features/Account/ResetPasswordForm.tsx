import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import FormHelperText from "@mui/material/FormHelperText";
import Paper from "@mui/material/Paper";
import ResetPasswordValidationSchema from "@/validation-schemes/Account/ResetPasswordValidationSchema";
import AppConstants from "@/constants/constants";

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onClickShowPassword = () => {
    setShowPassword((old) => !old);
  };

  const onClickShowConfirmPassword = () => {
    setShowConfirmPassword((old) => !old);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues: {
      password: "password",
      confirmPassword: "password",
    },
    validationSchema: ResetPasswordValidationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <>
      <Stack direction="row" justifyContent="center">
        <Paper sx={{ padding: "1rem" }}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={AppConstants.layout.StandardSpacing}>
              <Typography variant="button" display="block" gutterBottom>
                RESET PASSWORD
              </Typography>
              <Stack
                direction="column"
                spacing={AppConstants.layout.StandardSpacing}
              >
                <FormControl variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    New Password
                  </InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
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
                    label="Password"
                  />
                  <FormHelperText>
                    {formik.touched.password && formik.errors.password}
                  </FormHelperText>
                </FormControl>
                <FormControl variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.confirmPassword &&
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
                    label="Password"
                  />
                  <FormHelperText>
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword}
                  </FormHelperText>
                </FormControl>
              </Stack>
              <Button type="submit" variant="contained">
                Submit
              </Button>
              <Stack direction="row" justifyContent="center">
                <Link sx={{ fontSize: "12px" }} href="login">
                  Back to Login
                </Link>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </>
  );
};

export default ResetPasswordForm;
