import React from "react";
import { Grid, Box, Typography, Paper } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WcIcon from "@mui/icons-material/Wc";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { TaskSummaryCard as TaskDetailsCardType } from "../../types/Task";
import dayjs from "dayjs";

interface TaskDetailsCardProps {
  task: TaskDetailsCardType;
  handleCardClick?: (
    taskId: string,
    taskDate: Date,
    balancePoints: number
  ) => void;
}

const TaskDetailsCard: React.FC<TaskDetailsCardProps> = ({
  task,
  handleCardClick,
}) => {
  return (
    <Paper
      elevation={0}
      onClick={() =>
        handleCardClick &&
        handleCardClick(task.taskId || "", task.startTime, task.balancePoints)
      }
      sx={{
        p: 2,
        borderRadius: 2,
        mb: 2,
        maxWidth: "340px",
        border: "1px solid rgb(229 229 229)",
        height: "130px",
        cursor: "pointer",
      }}>
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <WorkIcon sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant='body1' sx={{ fontWeight: 500 }}>
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
