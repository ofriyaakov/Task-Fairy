import "./ProfilePage.css";
import { Box } from "@mui/material";
import TasksList from "../../components/TasksList";
import {
  CalendarTask,
  ShortenedTaskDetails,
} from "../../types/Task";
import { useEffect, useState } from "react";
import { getEmployeeTasks } from "../../queries/task";
import { employeeTaskTitle } from "../../consts";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { toast } from "react-toastify";
import { MyCalendar } from "../../components/Calendar/Calendar";
import RectangleData from "../../components/RectangleData";
import { APP_COLOR } from "../../theme";
import { getCompanyAvgBalancePoints, getUserBalancePoints } from "../../queries/user";
import { BeatLoader } from "react-spinners";
import FirstLoginPopup from "../../components/FirstLoginPopup";
import { updateUserFirstLogin } from "../../queries/user";
import { CalendarPages } from "../../components/Calendar/CalendarSetup";

const ProfilePage: React.FC = () => {
  const { connectedUser, setConnectedUser } = useGlobalContext();

  const [employeeTasks, setemployeeTasks] = useState<ShortenedTaskDetails[]>([]);
  const [calendarTasks, setCalendarTasks] = useState<CalendarTask[]>([]);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date())
  const [userBalancePoints, setUserBalancePoints] = useState<number>(0);
  const [avgBalancePoints, setAvgBalancePoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [firstLoginPopupOpen, setFirstLoginPopupOpen] = useState<boolean>(connectedUser?.firstLogin || false);
  
  const mapTasksAndfilterByMonth = (
    tasks: ShortenedTaskDetails[],
    date: Date
  ) => {
    const calendarTask: CalendarTask[] = tasks
      .map((task) => {
        return {
          ...task,
          date: new Date(task.startTime).toISOString().split("T")[0],
          isAssignedToCurrentUser: true,
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

      const fetchedemployeeTasks: ShortenedTaskDetails[] = await getEmployeeTasks(employeeId);
      setemployeeTasks(fetchedemployeeTasks.sort((a, b) => {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      }));
      mapTasksAndfilterByMonth(fetchedemployeeTasks, currentMonthDate);
    } catch (err: any) {
      console.error(err.message);
      toast.error("Oops! We couldent fetch your tasks");
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
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    setCurrentMonthDate(startOfMonth);
    mapTasksAndfilterByMonth(employeeTasks, startOfMonth);
  };

  useEffect(() => {
    setLoading(true);
    fetchEmployeeTasks();
    fetchEmployeeBalancePoints();
    fetchCompanyAvgBalancePoints();
  }, []);

  const onSubmitFirstLoginPopup = async (user_id: string, password: string, city: string) => {
    try {
      if (!connectedUser?.id) throw new Error("User ID not found in context");
      await updateUserFirstLogin(
        user_id,
        password,
        city,
      );
      setConnectedUser((prev) => prev ? { ...prev, firstLogin: false } : prev);
      setFirstLoginPopupOpen(false);
      toast.success("First login setup completed successfully!");
    } catch (err: any) {
      console.error("Error in first login setup:", err.message);
      toast.error(err.message || "First login setup failed");
    }
  };

  return (
    <div className= "page-container">
      {connectedUser?.firstLogin && (
        <FirstLoginPopup
          open={firstLoginPopupOpen}
          onSubmit={onSubmitFirstLoginPopup}
        />
      )}
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
                title="Company Average"
                subtitle=""
                value={avgBalancePoints}
                color={APP_COLOR.ALICE_BLUE_DARKER} />
            </div>

            <div className="calendar-container">
              <MyCalendar 
                taskSummary={calendarTasks}
                date={currentMonthDate}
                navigateMonth={navigateMonth}
                page={CalendarPages.PROFILE} />
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

export default ProfilePage;