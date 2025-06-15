import React, { useRef, useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { getAiTips } from "../../queries/task";
import { BeatLoader } from "react-spinners";
import { Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AiTipsButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<string[]>([]);
  const { connectedUser } = useGlobalContext();
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current?.contains(e.target as Node) ||
        btnRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setShowTooltip(false);
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  const toggleTooltip = async () => {
    if (showTooltip) {
      setShowTooltip(false);
      return;
    }

    setShowTooltip(true);

    if (tips.length) return;

    setLoading(true);
    try {
      const results = (await getAiTips(connectedUser?.companyId || 0)) as string[];
      setTips(
          results && results.length
            ? results
            : ["No AI suggestions available at the moment."]
      );
    } catch (err) {
      console.error(err);
      setTips(["🚫 Failed to load AI suggestions."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" alignItems="center" position="relative">
      <Button
        ref={btnRef}
        variant="outlined"
        size="small"
        onClick={toggleTooltip}
        sx={{
          ml: 1,
          borderRadius: 3,
          minWidth: 55,
          height: 40,
          borderWidth: 2,
          bgcolor: "#ffffff",
          mb: "10px",
          fontWeight: "bold",
          gap: 1,
          textTransform: "none",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Wand2 size={20} />
        AI Suggestions
      </Button>

      {showTooltip && (
        <Paper
          ref={tooltipRef}
          elevation={3}
          sx={{
            position: "absolute",
            top: "50px",
            right: 0,
            zIndex: 10,
            p: 2,
            width: 350,
            backgroundColor: "#F9FEFF",
            borderRadius: 2,
            boxShadow: 3,
            textAlign: "left",
          }}
        >
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={3}>
              <BeatLoader color="#477AC7" />
            </Box>
          ) : (
            <AnimatePresence>
              {tips.map((tip, index) => (
                <motion.div
                  key={tip}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                >
                  <Box display="flex" alignItems="flex-start" mb={1}>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: "2px",
                        mr: 1,
                        width: 20,
                        height: 20,
                        flexShrink: 0,
                      }}
                    >
                      <Wand2 size={20} color="#477AC7" />
                    </Box>
                    <Typography variant="body2" sx={{ color: "#333" }}>
                      {tip}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AiTipsButton;
