import AppCopyableText from "@/components/ui-components/AppCopyableText";
import { Box, Stack, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

export default function ThemePreviewBox(props: { color: string }) {
  return (
    <Stack direction={"row"}>
      <CircleIcon sx={{ color: props.color }} />
      <AppCopyableText text={props.color} />
    </Stack>
  );
}
