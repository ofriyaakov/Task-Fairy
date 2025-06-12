import React, { useState } from "react";
import { Box, Paper, Stack } from "@mui/material";
import { ShortenedTaskDetails } from "../../types/Task";
import TaskDetailsCard from "../TaskDetailsCard";
import Headline from "../Headline";
import Search from "../Search";

interface TaskListProps {
  title: string;
  tasks: ShortenedTaskDetails[];
  handleCardClick?: (
    taskId: string,
    taskDate?: Date,
    balancePoints?: number
  ) => void;
  height?: string;
}

const TasksList: React.FC<TaskListProps> = ({
  title,
  tasks,
  handleCardClick,
  height = "86vh",
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = (
    taskId: string,
    taskDate?: Date,
    balancePoints?: number
  ) => {
    setSelectedTaskId(taskId);
    handleCardClick && handleCardClick(taskId, taskDate, balancePoints);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        width: "100%",
        maxWidth: "388px",
        overflow: "hidden",
        height: height
      }}>
      <Box>
        <Headline color='rgb(206, 244, 255)' title={title} />
      </Box>

      <Box
        sx={{
          px: 2,
          pb: 2,
          bgcolor: "rgb(250 250 250)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {filteredTasks.length === 0 ? (
          <p>No tasks to display.</p>
        ) : (
          <>
            <Stack
              spacing={2}
              sx={{
                overflowY: "auto",
                overflowX: "hidden",
                maxHeight: height,
              }}>
              {filteredTasks.map((task, index) => (
                <TaskDetailsCard
                  key={index}
                  task={task}
                  handleCardClick={handleClick}
                  isSelected={task.taskId === selectedTaskId}
                />
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default TasksList;
