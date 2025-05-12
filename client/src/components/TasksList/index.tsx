import React, { useState } from "react";
import { Box, TextField, Paper, Stack } from "@mui/material";
import { TaskSummaryCard as TaskDetailsCardType } from "../../types/Task";
import TaskDetailsCard from "../TaskDetailsCard";
import Headline from "../Headline";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

interface TaskListProps {
  title: string;
  tasks: TaskDetailsCardType[];
  handleCardClick?: (taskId: string, taskDate: Date, balancePoints: number) => void 
}

const TasksList: React.FC<TaskListProps> = ({ title, tasks, handleCardClick }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        width: "100%",
        maxWidth: "388px",
        overflow: "hidden",
      }}>
      <Box>
        <Headline color='rgb(206, 244, 255)' title={title} />
      </Box>

      <Box
        sx={{
          px: 2,
          pb: 2,
          bgcolor: "rgb(250 250 250)",
          height: "77vh",
        }}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              mb: 2,
              width: '356px',
              mt: 2,
            },
          }}
        />

        <Stack
          spacing={2}
          sx={{ overflowY: "auto", overflowX: "hidden", maxHeight: "65vh" }}>
          {filteredTasks.map((task, index) => (
            <TaskDetailsCard key={index} task={task} handleCardClick={handleCardClick}/>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

export default TasksList;
