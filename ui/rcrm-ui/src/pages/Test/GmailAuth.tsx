import AppPaper from "@/components/ui-components/AppPaper";
import AppConstants from "@/constants/constants";
import { Card, Grid, Paper, Stack, Typography } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

const GmailAuth = () => {
  const [credential, setCredential] = useState("");

  return (
    <GoogleOAuthProvider clientId="">
      <Paper
        variant="outlined"
        sx={{ height: "95vh", overflowY: "auto", padding: "1rem" }}
      >
        <Grid container spacing={AppConstants.layout.StandardSpacing}>
          <Grid md={12}>
            <Stack alignItems={"center"}>
              <AppPaper>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    setCredential(credentialResponse.credential ?? "");
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </AppPaper>
            </Stack>
          </Grid>
          <Grid md={12}>
            <Paper sx={{ padding: "1rem" }}>
              <Typography variant="subtitle2">{credential}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </GoogleOAuthProvider>
  );
};

export default GmailAuth;
