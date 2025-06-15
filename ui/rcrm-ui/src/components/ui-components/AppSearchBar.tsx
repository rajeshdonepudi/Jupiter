import React from "react";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { Paper } from "@mui/material";

interface AppSearchBarProps {
  value: string;
  placeholder?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const AppSearchBar: React.FC<AppSearchBarProps> = ({
  value,
  handleChange,
  placeholder,
  handleSubmit,
}) => {
  return (
    <Paper
      component={"form"}
      variant="outlined"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder ?? "Search..."}
        inputProps={{ "aria-label": placeholder ?? "search here..." }}
        value={value}
        onChange={handleChange}
        name="search"
        size="small"
      />
      <IconButton type="submit" sx={{ p: "5px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default AppSearchBar;
