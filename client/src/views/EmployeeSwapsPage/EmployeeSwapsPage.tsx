import React, { useEffect, useState } from 'react';
import { MyCalendar } from '../../components/Calendar/Calendar';
import { CalendarTask } from '../../types/Task';
import { getAllTasksByMonth } from '../../queries/task';
import TasksList from './../../components/TasksList'
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { Box, Grid } from '@mui/material';
import SwapRequestCard from '../../components/SwapRequestCard';
import { FullSwapRequest } from './../../types/Swap';
import { getSwapRequestsByEmployee } from '../../queries/swapRequests';
import { SwapRequestStatuses } from './../../consts';

const EmployeeSwapsPage: React.FC = () => {

      const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
      const [taskSummary, setTaskSummary] = useState<CalendarTask[]>([]);
      const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date())
      const [taskListByDate, setTaskListByDate] = useState<CalendarTask[]>([]);
      const [swapRequestsByEmployee, setSwapRequestsByEmployee] = useState<FullSwapRequest[]>([])
      
      const { connectedUser } = useGlobalContext();
    
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
          const fetchedTasks: CalendarTask[] = await getAllTasksByMonth(currentMonthDate.getMonth() + 1, companyId)
          setTaskSummary(fetchedTasks)
          setLoadingTasks(false);
        } catch (err: any) {
          console.error(err.message);
          toast.error("Oops! Something went wrong");
          setTaskSummary([])
          setLoadingTasks(false);
        }
      }

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
        fetchSwapRequestsByEmployee()
      }, [currentMonthDate]);

    return (
      <div className='App' >
        <div style={{ height: "58vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {loadingTasks ? <BeatLoader color="#36d7b7" loading={loadingTasks} size={20} /> :
          <MyCalendar 
          taskSummary={taskSummary}
          date={currentMonthDate}
          navigateMonth={navigateMonth}
          handleCellClick={handleCellClick}
          isManagerView={false} />
        }
          {taskListByDate.length !== 0 && <div style={{marginLeft:"1vw"}}><TasksList title={'Tasks'} tasks={taskListByDate} height='50vh'/></div>}
        </div>
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
                )): <div>You haven't request a swap</div>}
              </Grid>
          </Box>
      </div>
      );
};
  
export default EmployeeSwapsPage;
  