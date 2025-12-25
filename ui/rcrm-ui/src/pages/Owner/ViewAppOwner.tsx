import {
  Avatar,
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { LinkedIn, Twitter, GitHub } from "@mui/icons-material";

const ViewAppOwner = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#e9ebf3",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      {/* CARD */}
      <Box
        sx={{
          width: 380,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
          bgcolor: "#111",
          color: "white",
          position: "relative",
        }}
      >
        {/* IMAGE */}
        <Box
          sx={{
            height: 260,
            width: "100%",
            backgroundImage:
              "url('https://i.ibb.co/vJg43n2/Screenshot-2024-07-25-130909.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* Gradient overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "70%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))",
            }}
          ></Box>
        </Box>

        {/* CONTENT */}
        <Box sx={{ p: 3 }}>
          {/* NAME + ICON */}
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <Typography variant="h5" fontWeight={700}>
              Rajesh Donepudi
            </Typography>
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
              width="20"
              height="20"
              style={{ opacity: 0.8 }}
            />
          </Stack>

          {/* SUBTITLE */}
          <Typography sx={{ opacity: 0.7, mb: 2 }}>
            Software Developer • Tech Enthusiast
          </Typography>

          {/* RATINGS OR BADGES */}
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <Typography sx={{ fontSize: "1.1rem", color: "#ffda75" }}>
              ⭐⭐⭐⭐⭐
            </Typography>
            <Typography sx={{ opacity: 0.6 }}>(Profile Rating)</Typography>
          </Stack>

          {/* BIO */}
          <Typography
            sx={{
              fontSize: "0.9rem",
              lineHeight: 1.6,
              opacity: 0.85,
              mb: 3,
            }}
          >
            Passionate software engineer specialised in building scalable,
            user-friendly applications. Enjoy solving complex problems and
            staying updated with modern technologies. Enthusiastic about AI,
            cloud, and cutting-edge web engineering.
          </Typography>

          {/* SOCIAL ICONS */}
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <IconButton size="small" sx={{ color: "white" }}>
              <LinkedIn />
            </IconButton>
            <IconButton size="small" sx={{ color: "white" }}>
              <Twitter />
            </IconButton>
            <IconButton size="small" sx={{ color: "white" }}>
              <GitHub />
            </IconButton>
          </Stack>

          {/* FOLLOW BUTTON */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              background: "#4b83ff",
              "&:hover": { background: "#3a6be0" },
            }}
          >
            Follow +
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewAppOwner;
