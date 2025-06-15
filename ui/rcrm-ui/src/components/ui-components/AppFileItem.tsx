import { Card, ListItem, ListItemIcon } from "@mui/material";
import FolderZipOutlinedIcon from "@mui/icons-material/FolderZipOutlined";
import AppPaper from "./AppPaper";
const AppFileItem = (props: any) => {
  return (
    <AppPaper>
      <ListItem>
        <ListItemIcon>{props?.icon}</ListItemIcon>
        {props.children}
      </ListItem>
    </AppPaper>
  );
};

export default AppFileItem;
