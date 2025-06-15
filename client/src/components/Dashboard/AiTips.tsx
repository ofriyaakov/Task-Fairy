import React, { useState } from "react";
import { AutoAwesome, Close } from "@mui/icons-material";
import { Box, Button, Paper, Typography, IconButton } from "@mui/material";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAiTips } from "../../queries/task";

const AiTipsButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tips, setTips] = useState<string[]>([]);

  const { connectedUser } = useGlobalContext();

  const toggleTooltip = async () => {
    const results = (await getAiTips(
      connectedUser?.companyId || 0
    )) as string[];
    if (results && results.length > 0) {
      console.log("AI Tips:", results);
      setTips(results);
    } else {
      setTips(["No AI suggestions available at the moment."]);
    }

    setShowTooltip((prev) => !prev);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          maxWidth: "30%",
          position: "relative", // Needed for absolute tooltip positioning
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={toggleTooltip}
          sx={{
            ml: 1,
            borderRadius: 4,
            minWidth: 55,
            height: 55,
            borderWidth: 2,
            bgcolor: "white",
            mb: "10px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AutoAwesome fontSize="small" />
          AI Suggestions
        </Button>

        {showTooltip && (
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: "70px",
              left: 0,
              zIndex: 10,
              p: 2,
              width: 350,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              boxShadow: 3,
              textAlign: "left",
            }}
          >
            <Box display="flex" justifyContent="flex-end">
              <IconButton size="small" onClick={toggleTooltip}>
                <Close fontSize="small" />
              </IconButton>
            </Box>
            {tips.map((tip, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{ mb: 1, color: "#333" }}
              >
                🔧 {tip}
              </Typography>
            ))}{" "}
          </Paper>
        )}
      </Box>
    </div>
  );
};

export default AiTipsButton;
