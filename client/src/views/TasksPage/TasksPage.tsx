import { Box } from "@mui/material";
import NewTaskForm from "../../components/NewTaskForm";
import { useEffect, useState } from "react";
import { getAllSavedTasks, getTaskById } from "../../queries/task";
import {
  ShortenedTaskDetails,
  TaskDetails,
  TaskSummaryCard as TaskDetailsCardType,
} from "../../types/Task";
import TasksList from "../../components/TasksList";
import { savedTaskTitle } from "../../consts";

const TasksPage: React.FC = () => {
  const [savedTasks, setSavedTasks] = useState<TaskDetailsCardType[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskDetails | null>(null);

  const fetchSavedTasks = async () => {
    try {
      const fetchedSavedTasks: TaskDetailsCardType[] = await getAllSavedTasks();
      setSavedTasks(fetchedSavedTasks);
    } catch (err: any) {
      console.error(err.message);
      setSavedTasks([]);
    }
  };

  const handleCardClick = async (savedTask: ShortenedTaskDetails) => {
    try {
      let task = await getTaskById(savedTask.taskId);
      task.saveToTasks = false;
      setSelectedTask(task);
    } catch (err: any) {
      console.error("Failed to fetch task details:", err.message);
    }
  };

  useEffect(() => {
    fetchSavedTasks();
  }, []);

  return (
    <div className='App'>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "5fr 2fr" },
          gap: 1,
        }}>
        <Box sx={{ width: "100%" }}>
          <NewTaskForm initialData={selectedTask} />
        </Box>

        <Box sx={{ width: "100%" }}>
          <TasksList
            tasks={savedTasks}
            title={savedTaskTitle}
            handleCardClick={handleCardClick}
          />
        </Box>
      </Box>
    </div>
  );
};

export default TasksPage;
