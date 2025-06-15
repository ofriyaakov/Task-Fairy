import React from "react";
import { Grid, Box, Typography, Paper, Stack, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CloseIcon from "@mui/icons-material/Close";
import { SwapCardDetails } from "./../../types/Swap";
import DoneIcon from "@mui/icons-material/Done";
import dayjs from "dayjs";

interface SwapRequestCardProps {
  leftDetails: SwapCardDetails;
  rightDetails: SwapCardDetails;
  swapRequestId?: string;
  onApprove?: (swapRequestId: string) => void;
  onReject?: (swapRequestId: string) => void;
  backgroundColor?: string;
}

interface SwapDetailsProps {
  employeeWithTask: SwapCardDetails;
  leftOrRight: "left" | "right";
}

const SwapDetails: React.FC<SwapDetailsProps> = ({ employeeWithTask, leftOrRight }) => {
  const dateFormat = "de-CH";
  const taskDate = new Date(employeeWithTask.taskStartTime).toLocaleDateString(
    dateFormat
  );
  const taskStartTime = new Date(employeeWithTask.taskStartTime);
  const taskEndTime = new Date(employeeWithTask.taskEndTime);

  return (
    <Box sx={{ display: "flex", justifyContent: leftOrRight }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <PersonIcon sx={{ color: "#000", mr: 2, mb: 6 }} />
        <Box sx={{ justifyItems: "start" }}>
          <Typography sx={{ lineHeight: 1.2 }}>
            {employeeWithTask.employeeFirstName}{" "}
            {employeeWithTask.employeeLastName}
          </Typography>
          <Typography>{employeeWithTask.employeeId}</Typography>
          <Typography sx={{ fontWeight: 650 }}>{taskDate}</Typography>
          <Typography sx={{ fontWeight: 650 }}>
            {dayjs(taskStartTime).format("HH:mm")} -
            {dayjs(taskEndTime).format("HH:mm")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const SwapRequestCard: React.FC<SwapRequestCardProps> = ({
  leftDetails,
  rightDetails,
  swapRequestId,
  onApprove,
  onReject,
  backgroundColor = "#fff",
}) => {
  const isSameTask = leftDetails.taskName === rightDetails.taskName;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        width: "92%",
        border: "1px solid rgb(229 229 229)",
        backgroundColor,
      }}
    >
      {isSameTask && (
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 2,
            }}>
          {leftDetails.taskName}
        </Typography>
      )}

      {/* Main swap details */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: "0 0 45%" }}>
          {!isSameTask && (
            <Typography
              sx={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mb: 1,
                textAlign: "left",
              }}
            >
              {leftDetails.taskName}
            </Typography>
          )}
          <SwapDetails employeeWithTask={leftDetails} leftOrRight={"left"} />
        </Box>

        <Box sx={{ flex: "0 0 10%", textAlign: "center" }}>
          <CompareArrowsIcon sx={{ fontSize: 42 }} />
        </Box>

        <Box sx={{ flex: "0 0 45%" }}>
          {!isSameTask && (
            <Typography
              sx={{
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mb: 1,
                textAlign: "right",
              }}
            >
              {rightDetails.taskName}
            </Typography>
          )}
          <SwapDetails employeeWithTask={rightDetails} leftOrRight={"right"} />
        </Box>

        {onApprove && onReject && swapRequestId && (
          <Stack
            direction='column'
            spacing={2}
            sx={{
              ml: 2,
              borderLeft: "1px solid #e5e5e5",
              pl: 2,
            }}
          >
            <IconButton onClick={() => onApprove(swapRequestId)}>
              <DoneIcon color='success' />
            </IconButton>

            <IconButton onClick={() => onReject(swapRequestId)}>
              <CloseIcon color='error' />
            </IconButton>
          </Stack>
        )}
      </Box>
    </Paper>
  );
};

export default SwapRequestCard;
