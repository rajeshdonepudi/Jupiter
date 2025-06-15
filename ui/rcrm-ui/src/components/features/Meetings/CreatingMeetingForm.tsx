import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import { Button, CircularProgress, Paper } from "@mui/material";
import AppConstants from "@/constants/constants";

const CreateMeetingForm = (props: any) => {
  const [showPassword, setShowPassword] = useState({
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setShowPassword({
      ...showPassword,
      showPassword: !showPassword.showPassword,
    });
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <>
      <Stack direction="row" justifyContent="center">
        <Paper sx={{ padding: "1rem" }}>
          <form onSubmit={props.formik.handleSubmit}>
            <Stack spacing={AppConstants.layout.StandardSpacing}>
              <Typography variant="button" display="block" gutterBottom>
                Login
              </Typography>
              <TextField
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                value={props.formik.values.email}
                onChange={props.formik.handleChange}
                error={
                  props.formik.touched.email &&
                  Boolean(props.formik.errors.email)
                }
                helperText={
                  props.formik.touched.email && props.formik.errors.email
                }
              />

              {true ? (
                <Button
                  loading={props?.loading}
                  type="submit"
                  variant="contained"
                >
                  Login
                </Button>
              ) : (
                <Stack alignItems="center" justifyContent="center">
                  <CircularProgress />
                </Stack>
              )}
              <Stack direction="row" justifyContent="center">
                <Link sx={{ fontSize: "12px" }} href="signup">
                  Doesn't have an Account ? Signup here
                </Link>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </>
  );
};

export default CreateMeetingForm;
