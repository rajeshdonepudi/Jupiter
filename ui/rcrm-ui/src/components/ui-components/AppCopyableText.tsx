import {
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const AppCopyableText = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Stack direction={"row"} sx={{ height: "100%" }} alignItems={"center"}>
      <Typography variant="body2">{text}</Typography>
      <Tooltip title="Click to copy">
        <IconButton
          disableRipple={true}
          sx={{ height: "8px" }}
          onClick={handleCopy}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Snackbar open={copied} autoHideDuration={1000} message="Copied" />
    </Stack>
  );
};

export default AppCopyableText;
