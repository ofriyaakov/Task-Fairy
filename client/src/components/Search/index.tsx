import React from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  width?: string;
}

const Search: React.FC<SearchProps> = ({
  searchTerm,
  setSearchTerm,
  width = "100%",
}) => {
  return (
    <div style={{ width: width }}>
      <TextField
        variant='outlined'
        placeholder='Search...'
        value={searchTerm}
        fullWidth
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            mb: 2,
            mt: 2,
          },
        }}
      />
    </div>
  );
};

export default Search;
