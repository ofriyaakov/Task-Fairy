import "./EmployeesPage.css";
import { Box } from "@mui/material";
import TasksList from "../../components/TasksList";
import { CalendarTask, TaskSummaryCard as TaskDetailsCardType } from "../../types/Task";
import { useEffect, useState } from "react";
import { getEmployeeTasks } from "../../queries/task";
import { employeeTaskTitle } from "../../consts";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { MyCalendar } from "../../components/Calendar/Calendar";
import RectangleData from "../../components/RectangleData";
import { APP_COLOR } from "../../theme";
import { getCompanyAvgBalancePoints, getUserBalancePoints } from "../../queries/user";
import { BeatLoader } from "react-spinners";

const EmployeesPage: React.FC = () => {
  const { connectedUser } = useGlobalContext();

  const [employeeTasks, setemployeeTasks] = useState<TaskDetailsCardType[]>([]);
  const [calendarTasks, setCalendarTasks] = useState<CalendarTask[]>([]);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date())
  const [userBalancePoints, setUserBalancePoints] = useState<number>(0);
  const [avgBalancePoints, setAvgBalancePoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const mapTasksAndfilterByMonth = (tasks: TaskDetailsCardType[], date: Date) => {
    const calendarTask: CalendarTask[] = tasks.map(task => {
      return {
          ...task,
          date: new Date(task.startTime).toISOString().split('T')[0],
          employeesAmount: -1,
          assignedEmployeesAmount: -1
        }
      }).filter(task => Number(task.date.split("-")[1]) === date.getMonth() + 1);

    setCalendarTasks(calendarTask)
  }

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
      setemployeeTasks([]);
    }
  };

  const fetchEmployeeBalancePoints = async () => {
    try {
      const employeeId = connectedUser?.id;
      if (!employeeId) throw new Error("User ID not found in context");

      const balancePoints: number = await getUserBalancePoints(employeeId);
      setUserBalancePoints(balancePoints);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  const fetchCompanyAvgBalancePoints = async () => {
    try {
      const companyId = connectedUser?.companyId;
      if (!companyId) throw new Error("User ID not found in context");

      const avgBalancePoints: number = await getCompanyAvgBalancePoints(companyId);
      setAvgBalancePoints(Number(Number(avgBalancePoints).toFixed(1)));
      setLoading(false);
    } catch (err: any) {
      console.error(err.message);
      setLoading(false);
    }
  }

  const navigateMonth = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    setCurrentMonthDate(startOfMonth)
    mapTasksAndfilterByMonth(employeeTasks, startOfMonth);
  }

  useEffect(() => {
    setLoading(true);
    fetchEmployeeTasks();
    fetchEmployeeBalancePoints();
    fetchCompanyAvgBalancePoints();
  }, []);
  
  return (
    <div className= "page-container">
      {loading ?
        <div className="loader-container">
          <BeatLoader color="#36d7b7" loading={loading} size={20} /> 
        </div> :
        <>
          <div className="calendar-points-container">

            <div className="points-container">
              <RectangleData
                title="My Balance Points"
                subtitle=""
                value={userBalancePoints}
                color={userBalancePoints >= avgBalancePoints ? APP_COLOR.MINT_GREEN : APP_COLOR.LIGHT_RED} />
              <RectangleData
                title="Company Avg"
                subtitle=""
                value={avgBalancePoints}
                color={APP_COLOR.ALICE_BLUE_DARKER} />
            </div>

            <div className="calendar-container">
              <MyCalendar 
                taskSummary={calendarTasks}
                date={currentMonthDate}
                navigateMonth={navigateMonth}
                isManagerView={false}
                handleCellClick={() => {}} />
            </div>
          </div>

          <Box sx={{ width: "30%", padding: "1rem"}}>
            <TasksList tasks={employeeTasks} title={employeeTaskTitle} />
          </Box>
        </> 
      }
    </div>
  );
};

export default EmployeesPage;