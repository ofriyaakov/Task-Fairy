import { Box } from "@mui/material";
import TasksList from "../../components/TasksList";
import { TaskSummaryCard as TaskDetailsCardType } from "../../types/Task";
import { useEffect, useState } from "react";
import { getEmployeeTasks } from "../../queries/task";
import { employeeTaskTitle } from "../../consts";
import { useGlobalContext } from "../../contexts/GlobalContext";


const EmployeesPage: React.FC = () => {
  const { connectedUser } = useGlobalContext();

  const [employeeTasks, setemployeeTasksTasks] = useState<
    TaskDetailsCardType[]
  >([]);

  const fetchEmployeeTasks = async () => {
    try {
      const employeeId = connectedUser?.id;
      if (!employeeId) throw new Error("User ID not found in context");

      const fetchedemployeeTasks: TaskDetailsCardType[] =
        await getEmployeeTasks(employeeId);
      setemployeeTasksTasks(fetchedemployeeTasks);
    } catch (err: any) {
      console.error(err.message);
      setemployeeTasksTasks([]);
    }
  };

  useEffect(() => {
    fetchEmployeeTasks();
  }, []);
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "5fr 2fr" },
        gap: 1,
      }}>
      <Box sx={{ width: "100%" }}>calender</Box>

      <Box sx={{ width: "100%" }}>
        <TasksList tasks={employeeTasks} title={employeeTaskTitle} />
      </Box>
    </Box>
  );
};

export default EmployeesPage;
