import React, { useEffect, useState } from 'react';
import { MyCalendar } from '../../components/Calendar/Calendar';
import { CalendarTask, ShortenedTaskDetails } from '../../types/Task';
import { getAllTasksByMonth, getEmployeeTasks } from '../../queries/task';
import TasksList from './../../components/TasksList'
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import { useGlobalContext } from '../../contexts/GlobalContext';
import TaskEmployeesDialog from "../../components/SwapEmployeeModal";
import { CalendarPages } from '../../components/Calendar/CalendarSetup';
import { Box, Grid } from '@mui/material';
import SwapRequestCard from '../../components/SwapRequestCard';
import { FullSwapRequest } from './../../types/Swap';
import { getSwapRequestsByEmployee } from '../../queries/swapRequests';
import { SwapRequestStatuses } from './../../consts';

const EmployeeSwapsPage: React.FC = () => {

  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [taskSummary, setTaskSummary] = useState<CalendarTask[]>([]);
  const [myTasks, setMyTasks] = useState<ShortenedTaskDetails[]>([]);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date())
  const [taskListByDate, setTaskListByDate] = useState<CalendarTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = useState<string>('');
  const [selectedTaskToSwap, setSelectedTaskToSwap] = useState<string>("");
  const [swapRequestsByEmployee, setSwapRequestsByEmployee] = useState<FullSwapRequest[]>([])

  const { connectedUser } = useGlobalContext();

  const handleOtherTaskCardClick = (taskId: string) => {
    setCurrentTaskId(taskId)
    setIsModalOpen(true)
  };

  const handleMyTaskCardClick = (taskId: string) => {
    setSelectedTaskToSwap(taskId)
  };

  const handleCellClick = (date: string) => {
    const tasksByDate = taskSummary.filter(task => task.date === date);
    setTaskListByDate(tasksByDate)
  };

  const navigateMonth = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    setCurrentMonthDate(startOfMonth)
  }

  const fetchTasks = async () => {
    try {
      const companyId = connectedUser?.companyId || 0;
      const userId = connectedUser?.id || "";
      const fetchedTasks: CalendarTask[] = await getAllTasksByMonth(currentMonthDate.getMonth() + 1, companyId, userId)
      setTaskSummary(fetchedTasks)
      setLoadingTasks(false);
    } catch (err: any) {
      console.error(err.message);
      toast.error("Oops! Something went wrong");
      setTaskSummary([])
      setLoadingTasks(false);
    }
  }

  const fetchMyTasks = async () => {
    try {
      const employeeId = connectedUser?.id;
      if (!employeeId) throw new Error("User ID not found in context");

      const fetchedemployeeTasks: ShortenedTaskDetails[] = await getEmployeeTasks(employeeId);
      const futureTasks = fetchedemployeeTasks.filter((task: ShortenedTaskDetails) => {
        return task.startTime >= new Date();
      })
      setMyTasks(futureTasks);
    } catch (err: any) {
      console.error(err.message);
      toast.error("Oops! We couldent fetch your tasks");
      setMyTasks([]);
    }
  };

  const fetchSwapRequestsByEmployee = async () => {
    try {
      const fetchedSwapRequests: FullSwapRequest[] = await getSwapRequestsByEmployee(String(connectedUser?.id));
      setSwapRequestsByEmployee(fetchedSwapRequests)
      return fetchedSwapRequests
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    setLoadingTasks(true);
    fetchTasks();
  }, [currentMonthDate]);

  useEffect(() => {
    fetchMyTasks();
    fetchSwapRequestsByEmployee()
  }, []);

  return (
    <div className='App' >
        <div style={{ height: "58vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {loadingTasks ? <BeatLoader color="#36d7b7" loading={loadingTasks} size={20} /> :
            <MyCalendar
              taskSummary={taskSummary}
              date={currentMonthDate}
              navigateMonth={navigateMonth}
              handleCellClick={handleCellClick}
              page={CalendarPages.SWAP} />
          }
          {myTasks.length !== 0 &&
            <div style={{ marginLeft: "1vw", height: "100%", width: "500px" }}>
              <TasksList title={'My Tasks'} tasks={myTasks} height='58vh' handleCardClick={handleMyTaskCardClick} />
            </div>}
          {taskListByDate.length !== 0 &&
            <div style={{ marginLeft: "1vw", height: "100%", width: "500px" }}>
              <TasksList title={'Others Tasks'} tasks={taskListByDate} height='58vh' handleCardClick={handleOtherTaskCardClick} />
            </div>}
        </div>
        <div>
          <Box
            sx={{
              px: 2,
              pb: 2,
              pt: 2,
              mt: 2,
              bgcolor: "rgb(250 250 250)",
              height: "25vh",
              borderRadius: "24px",
              overflowY: 'scroll'
            }}>
            <Grid container spacing={2}>
              {swapRequestsByEmployee.length !== 0 ? swapRequestsByEmployee.map((swapRequest, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <SwapRequestCard
                    leftDetails={swapRequest.leftDetails}
                    rightDetails={swapRequest.rightDetails}
                    backgroundColor={swapRequest.status === SwapRequestStatuses.APPROVED_NAME ? SwapRequestStatuses.APPROVED_COLOR :
                      (swapRequest.status === SwapRequestStatuses.REJECTED_NAME ? SwapRequestStatuses.REJECTED_COLOR : SwapRequestStatuses.PENDING_COLOR)}
                  />
                </Grid>
              )) : <div>You haven't request a swap</div>}
            </Grid>
          </Box>
        </div>
        {isModalOpen &&
          <TaskEmployeesDialog
            open={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            taskId={currentTaskId}
            taskIdToSwap={selectedTaskToSwap}
            isSwapDisabled={!selectedTaskToSwap} />
        }
      </div>
  );
};

export default EmployeeSwapsPage;