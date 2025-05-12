import { Box } from "@mui/material";
import TasksList from "../../components/TasksList";
import {
  CalendarTask,
  TaskSummaryCard as TaskDetailsCardType,
} from "../../types/Task";
import { useEffect, useState } from "react";
import { getEmployeeTasks } from "../../queries/task";
import { employeeTaskTitle } from "../../consts";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { toast } from "react-toastify";
import { MyCalendar } from "../../components/Calendar/Calendar";

const EmployeesPage: React.FC = () => {
  const { connectedUser } = useGlobalContext();

  const [employeeTasks, setemployeeTasks] = useState<TaskDetailsCardType[]>([]);
  const [calendarTasks, setCalendarTasks] = useState<CalendarTask[]>([]);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

  const mapTasksAndfilterByMonth = (
    tasks: TaskDetailsCardType[],
    date: Date
  ) => {
    const calendarTask: CalendarTask[] = tasks
      .map((task) => {
        return {
          ...task,
          date: new Date(task.startTime).toISOString().split("T")[0],
          employeesAmount: -1,
          assignedEmployeesAmount: -1,
        };
      })
      .filter(
        (task) => Number(task.date.split("-")[1]) === date.getMonth() + 1
      );

    setCalendarTasks(calendarTask);
  };

  const fetchEmployeeTasks = async () => {
    try {
      const employeeId = connectedUser?.id;
      if (!employeeId) throw new Error("User ID not found in context");

      const fetchedemployeeTasks: TaskDetailsCardType[] =
        await getEmployeeTasks(employeeId);
      setemployeeTasks(fetchedemployeeTasks);
      mapTasksAndfilterByMonth(fetchedemployeeTasks, currentMonthDate);
    } catch (err: any) {
      console.error(err.message);
      toast.error("Oops! We couldent fetch your tasks");
      setemployeeTasks([]);
    }
  };

  const navigateMonth = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    setCurrentMonthDate(startOfMonth);
    mapTasksAndfilterByMonth(employeeTasks, startOfMonth);
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
      <Box sx={{ width: "100%" }}>
        <MyCalendar
          taskSummary={calendarTasks}
          date={currentMonthDate}
          navigateMonth={navigateMonth}
          isManagerView={false}
          handleCellClick={() => {}}
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        <TasksList tasks={employeeTasks} title={employeeTaskTitle} />
      </Box>
    </Box>
  );
};

export default EmployeesPage;
