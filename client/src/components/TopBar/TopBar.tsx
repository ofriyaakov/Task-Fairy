import React from "react";
import { AppBar, Toolbar, Avatar, Typography, Box } from "@mui/material";
import { useGlobalContext } from "../../contexts/GlobalContext";

export const TopBar: React.FC = () => {
  const { connectedUser } = useGlobalContext();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src="/path/to/avatar.jpg"
            alt={connectedUser?.name}
            sx={{ width: 35, height: 35 }}
          />
          <div>
            <Typography
              component="div"
              sx={{
                marginLeft: 1,
                color: "#404040",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {connectedUser?.name}
            </Typography>
            {/* Insert role level here if needed */}
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
