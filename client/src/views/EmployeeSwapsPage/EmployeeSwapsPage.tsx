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

const EmployeeSwapsPage: React.FC = () => {

      const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
      const [taskSummary, setTaskSummary] = useState<CalendarTask[]>([]);
      const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date())
      const [taskListByDate, setTaskListByDate] = useState<CalendarTask[]>([]);
      
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
    
      useEffect(() => {
        setLoadingTasks(true);
        fetchTasks();
      }, [currentMonthDate]);

      const swapRequests: FullSwapRequest[] = [
        {
          leftDetails: {
            employeeId: "E001",
            employeeFirstName: "Alice",
            employeeLastName: "Johnson",
            taskName: "Code Review",
            taskStartTime: "2025-05-26T09:00:00Z",
            taskEndTime: "2025-05-26T11:00:00Z"
          },
          rightDetails: {
            employeeId: "E002",
            employeeFirstName: "Bob",
            employeeLastName: "Smith",
            taskName: "Client Meeting",
            taskStartTime: "2025-05-26T09:30:00Z",
            taskEndTime: "2025-05-26T10:30:00Z"
          },
          status: 'pending'
        },
        {
          leftDetails: {
            employeeId: "E003",
            employeeFirstName: "Charlie",
            employeeLastName: "Brown",
            taskName: "Backend Deployment",
            taskStartTime: "2025-05-26T13:00:00Z",
            taskEndTime: "2025-05-26T14:00:00Z"
          },
          rightDetails: {
            employeeId: "E004",
            employeeFirstName: "Diana",
            employeeLastName: "Green",
            taskName: "Database Backup",
            taskStartTime: "2025-05-26T13:15:00Z",
            taskEndTime: "2025-05-26T13:45:00Z"
          },
          status: 'pending'
        },
        {
          leftDetails: {
            employeeId: "E005",
            employeeFirstName: "Ethan",
            employeeLastName: "Wong",
            taskName: "UI Design",
            taskStartTime: "2025-05-26T10:00:00Z",
            taskEndTime: "2025-05-26T12:00:00Z"
          },
          rightDetails: {
            employeeId: "E006",
            employeeFirstName: "Fiona",
            employeeLastName: "Martinez",
            taskName: "UX Research",
            taskStartTime: "2025-05-26T10:30:00Z",
            taskEndTime: "2025-05-26T11:30:00Z"
          },
          status: 'approved'
        },
        {
          leftDetails: {
            employeeId: "E007",
            employeeFirstName: "George",
            employeeLastName: "Clark",
            taskName: "Security Audit",
            taskStartTime: "2025-05-26T15:00:00Z",
            taskEndTime: "2025-05-26T16:30:00Z"
          },
          rightDetails: {
            employeeId: "E008",
            employeeFirstName: "Hannah",
            employeeLastName: "Lee",
            taskName: "Compliance Check",
            taskStartTime: "2025-05-26T15:15:00Z",
            taskEndTime: "2025-05-26T16:00:00Z"
          },
          status: 'rejected',
        }
      ];
      

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
                {swapRequests.map((swapRequest, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <SwapRequestCard 
                      leftDetails={swapRequest.leftDetails} 
                      rightDetails={swapRequest.rightDetails}
                      backgroundColor={swapRequest.status === 'approved' ? 'rgb(233 255 239)' : 
                        (swapRequest.status === 'rejected' ? 'rgb(255 223 223)' : 'rgb(255 255 255)')}
                    />
                  </Grid>
                ))}
              </Grid>
          </Box>
      </div>
      );
};
  
export default EmployeeSwapsPage;
  