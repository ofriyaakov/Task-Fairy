import { Box } from "@mui/material";
import NewTaskForm from "../../components/NewTaskForm";
import { useEffect, useState } from "react";
import { getAllSavedTasks } from "../../queries/task";
import { TaskDetailsCard as TaskDetailsCardType } from "../../types/Task";
import TasksList from "../../components/TasksList";
import { savedTaskTitle } from "../../consts";

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskDetailsCardType[]>([]);

  const fetchSavedTasks = async () => {
    try {
      const fetchedSavedTasks: TaskDetailsCardType[] = await getAllSavedTasks();
      setTasks(fetchedSavedTasks);
    } catch (err: any) {
      console.error(err.message);
      setTasks([]);
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
          <NewTaskForm />
        </Box>

        <Box sx={{ width: "100%" }}>
          <TasksList tasks={tasks} title={savedTaskTitle} />
        </Box>
      </Box>
    </div>
  );
};

export default TasksPage;
