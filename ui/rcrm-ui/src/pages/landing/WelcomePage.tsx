import { Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
    <Stack alignItems="center" sx={{ maxWidth: "450px", maxHeight: "450px" }}>
      <Stack
        sx={{ maxHeight: "225px" }}
        alignItems="center"
        flexDirection="row"
      >
        <Link to={"/login"}>
          <Typography variant="h1">Get started</Typography>
        </Link>
      </Stack>
    </Stack>
  );
};

export default WelcomePage;
