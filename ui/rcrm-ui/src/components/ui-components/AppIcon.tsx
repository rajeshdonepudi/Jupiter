import React, { LazyExoticComponent, Suspense } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

interface AppIconProps {
  Icon?: SvgIconComponent | LazyExoticComponent<SvgIconComponent>; // Material-UI icon component
  color: string; // Color for the icon
  title?: string;
  onClick?: any;
}

const AppIcon: React.FC<AppIconProps> = ({ Icon, color, onClick }) => {
  const iconContainerStyle = {
    backgroundColor: `${color}25`, // Background color
    color: color, // Icon color
    fontSize: "4rem", // Adjust size as needed
    borderRadius: "12px", // Rounded corners
    padding: "10px",
    display: "inline-flex", // Center the icon
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Box onClick={onClick} style={iconContainerStyle}>
      <Stack alignItems={"center"}>
        <Suspense>{Icon ? React.createElement(Icon) : null}</Suspense>
      </Stack>
    </Box>
  );
};

export default AppIcon;
