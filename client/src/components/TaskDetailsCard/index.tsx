import React from "react";
import { Grid, Box, Typography, Paper } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WcIcon from "@mui/icons-material/Wc";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import { ShortenedTaskDetails } from "../../types/Task";

interface TaskDetailsCardProps {
  task: ShortenedTaskDetails;
  isSelected?: boolean;
  showDate?: boolean;
  handleCardClick?: (task: ShortenedTaskDetails) => void 
}

const TaskDetailsCard: React.FC<TaskDetailsCardProps> = ({ task, showDate = true, isSelected = false, handleCardClick }) => {
  return (
    <Paper
      elevation={0}
      onClick={() =>
        handleCardClick &&
        handleCardClick(task)
      }
      sx={{
        p: 2,
        borderRadius: 2,
        mb: 2,
        maxWidth: "340px",
        border: isSelected ? "2px solid black" : "1px solid rgb(229 229 229)",
        height: "130px",
        cursor: "pointer",
      }}>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <WorkIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant='body1' sx={{ fontWeight: 700, fontSize: "14px" }}>
              {task.name}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant='body2'>{task.location}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant='body2'>
              {showDate && `${dayjs(task.startTime).format("DD/MM/YYYY")} `}
              {dayjs(task.startTime).format("HH:mm")} -
              {dayjs(task.endTime).format("HH:mm")}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <WcIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant='body2'>{task.gender}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <StarIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant='body2'>
              {task.balancePoints} Balance points
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TaskDetailsCard;
