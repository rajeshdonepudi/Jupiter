import { Avatar, Box, Stack, Typography } from "@mui/material";

const ViewAppOwner = () => {
  return (
    <Stack
      style={{
        height: "95vh",
        width: "100vw",
      }}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box style={{ position: "relative", display: "inline-block" }}>
        {/* Animation */}

        {/* Centered Avatar */}
        <Avatar
          alt="Rajesh Donepudi"
          src="https://i.ibb.co/vJg43n2/Screenshot-2024-07-25-130909.png"
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </Box>
      <Typography variant="h3">Rajesh Donepudi</Typography>
      <Stack sx={{ width: "50%" }}>
        <Typography sx={{ fontFamily: "Crimson Pro" }}>
          I’m a passionate software developer with a knack for building
          innovative software solutions and exploring the latest technologies. I
          enjoy solving complex problems and creating efficient, user-friendly
          applications. My expertise spans across various programming languages,
          frameworks, and tools, allowing me to craft reliable and scalable
          solutions. Beyond coding, I stay curious about emerging trends in
          tech, continuously learning to sharpen my skills. I’m particularly
          drawn to projects involving cloud computing, AI/ML, and modern web
          development. Whether working in a team or independently, I thrive on
          turning ideas into impactful products. In my free time, you’ll find me
          tinkering with side projects, contributing to open-source, or reading
          up on the newest advancements in software engineering.
        </Typography>
      </Stack>
    </Stack>
  );
};

export default ViewAppOwner;
