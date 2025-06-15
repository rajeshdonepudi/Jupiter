import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import ThemePreviewBox from "./ThemePreviewBox";
import { lazy } from "react";
const DeleteOutlineOutlinedIcon = lazy(
  () => import("@mui/icons-material/DeleteOutlineOutlined")
);
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

export default function ThemeListTable(props: any) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Theme</TableCell>
            <TableCell>Primary Color</TableCell>
            <TableCell>Secondary Color</TableCell>
            <TableCell>Font Family</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row: any, index: number) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {`Theme ${index + 1}`}
              </TableCell>
              <TableCell align="left">
                <ThemePreviewBox
                  color={String(row.primaryColor).toUpperCase()}
                />
              </TableCell>
              <TableCell>
                <ThemePreviewBox
                  color={String(row.secondaryColor).toLocaleUpperCase()}
                />
              </TableCell>
              <TableCell>{row.fontFamily}</TableCell>
              <TableCell>
                <Stack
                  alignItems="center"
                  justifyContent="start"
                  flexDirection="row"
                  gap={1}
                  height={"100%"}
                >
                  <Tooltip title="Edit user">
                    <IconButton
                      onClick={() => props.onEditTheme(row)}
                      aria-label="Example"
                    >
                      <EditOutlinedIcon sx={{ color: "darkblue" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete user">
                    <IconButton
                      onClick={() => props.onDeleteTheme(row.id)}
                      aria-label="Example"
                    >
                      <DeleteOutlineOutlinedIcon sx={{ color: "darkred" }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
