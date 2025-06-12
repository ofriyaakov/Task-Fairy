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
}

const SwapDetails: React.FC<SwapDetailsProps> = ({ employeeWithTask }) => {
  const dateFormat = "de-CH";
  const taskDate = new Date(employeeWithTask.taskStartTime).toLocaleDateString(
    dateFormat
  );
  const taskStartTime = new Date(employeeWithTask.taskStartTime);
  const taskEndTime = new Date(employeeWithTask.taskEndTime);

  return (
    <Box>
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
  backgroundColor = "rgb(255 255 255)",
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
        backgroundColor: backgroundColor,
      }}>
      {isSameTask && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
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
        </Box>
      )}

      {/* Main swap details */}
      <Box
        sx={{
          display: "flex",
        }}>
        <Grid container alignItems='center'>
          <Grid item xs={5}>
            {!isSameTask && (
              <Typography
                sx={{
                  textAlign: "start",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  mb: 2,
                }}>
                {leftDetails.taskName}
              </Typography>
            )}
            <SwapDetails employeeWithTask={leftDetails} />
          </Grid>

          <Grid item xs={2} sx={{ textAlign: "center" }}>
            <CompareArrowsIcon sx={{ fontSize: 45 }} />
          </Grid>

          <Grid item xs={5}>
            {!isSameTask && (
              <Typography
                sx={{
                  textAlign: "start",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  mb: 2,
                }}>
                {rightDetails.taskName}
              </Typography>
            )}
            <SwapDetails employeeWithTask={rightDetails} />
          </Grid>
        </Grid>

        {onApprove && onReject && swapRequestId && (
          <Stack
            direction='column'
            spacing={2}
            sx={{
              justifyContent: "center",
              pl: 2,
              borderLeft: "1px solid #e5e5e5",
            }}>
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
