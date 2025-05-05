import React from "react";
import { Grid, Box, Typography, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { SwapCardDetails } from "./../../types/Swap";

interface SwapDetailsProps {
  employeeWithTask: SwapCardDetails;
}

interface SwapRequestCardProps {
  leftDetails: SwapCardDetails;
  rightDetails: SwapCardDetails;
}

const SwapDetails: React.FC<SwapDetailsProps> = ({ employeeWithTask }) => {
  const dateFormat = "de-CH";
  const taskDate = new Date(employeeWithTask.taskStartTime).toLocaleDateString(
    dateFormat
  );
  const taskStartTime = new Date(
    employeeWithTask.taskStartTime
  ).toLocaleTimeString();
  const taskEndTime = new Date(
    employeeWithTask.taskEndTime
  ).toLocaleTimeString();

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
            {taskStartTime} - {taskEndTime}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const SwapRequestCard: React.FC<SwapRequestCardProps> = ({
  leftDetails,
  rightDetails,
}) => {
  const isSameTask = leftDetails.taskName === rightDetails.taskName;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        width: "41%",
        border: "1px solid rgb(229 229 229)",
        height: "135px",
      }}
    >
      {isSameTask ? (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          {leftDetails.taskName}
        </Typography>
      ) : (
        <></>
      )}
      <Grid container alignItems="center">
        <Grid item xs={5}>
          {!isSameTask ? (
            <Typography
              sx={{
                textAlign: "start",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mb: 2,
              }}
            >
              {leftDetails.taskName}
            </Typography>
          ) : (
            <></>
          )}
          <SwapDetails employeeWithTask={leftDetails} />
        </Grid>

        <Grid item xs={2} sx={{ textAlign: "center" }}>
          <CompareArrowsIcon sx={{ fontSize: 32 }} />
        </Grid>

        <Grid item xs={5}>
          {!isSameTask ? (
            <Typography
              sx={{
                textAlign: "start",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mb: 2,
              }}
            >
              {rightDetails.taskName}
            </Typography>
          ) : (
            <></>
          )}
          <SwapDetails employeeWithTask={rightDetails} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SwapRequestCard;
