import React, {useEffect, useState } from 'react';
import SuggestionsDialog from './../../components/SuggestionsModal'
import { MyCalendar } from '../../components/Calendar/Calendar';
import { CalendarTask } from '../../types/Task';
import { getAllTasksByMonth } from '../../queries/task';
import TasksList from './../../components/TasksList'
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { CalendarPages } from '../../components/Calendar/CalendarSetup';

const CalendarPage: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [taskSummary, setTaskSummary] = useState<CalendarTask[]>([]);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date())
  const [taskListByDate, setTaskListByDate] = useState<CalendarTask[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string>('')
  const [currentTaskDate, setCurrentTaskDate] = useState<Date>(new Date())
  const [currentBalancePoints, setCurrentBalancePoints] = useState<number>(0)
  const [refreshTasks, setRefreshTasks] = useState<boolean>(false);
  
  const { connectedUser } = useGlobalContext();

  const handleCellClick = (date: string) => {
    const tasksByDate = taskSummary.filter(task => task.date === date);
    setTaskListByDate(tasksByDate)
  };

  const handleTaskCardClick = (taskId: string, taskDate?: Date, balancePoints?: number) => {
    setCurrentTaskId(taskId)
    setIsModalOpen(true)
    setCurrentTaskDate(taskDate!!)
    setCurrentBalancePoints(balancePoints!!)
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

  useEffect(() => {
    setLoadingTasks(true);
    fetchTasks();
  }, [currentMonthDate]);

  useEffect(() => {
    if (refreshTasks === true) {
      fetchTasks();
      setRefreshTasks(false);
    }
  }, [refreshTasks]);

  return (
    <div className='App' style={{ height: "86vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {loadingTasks ? <BeatLoader color="#36d7b7" loading={loadingTasks} size={20} /> :
      <MyCalendar 
        taskSummary={taskSummary}
        date={currentMonthDate}
        navigateMonth={navigateMonth}
        handleCellClick={handleCellClick}
        page={CalendarPages.MANAGER} />
      }
      {taskListByDate.length !== 0 && <div style={{marginLeft:"1vw", width: "35%"}}><TasksList title={'Tasks'} tasks={taskListByDate} handleCardClick={handleTaskCardClick}/></div>}
      {isModalOpen && 
        <SuggestionsDialog 
          open={isModalOpen} 
          setIsModalOpen={setIsModalOpen} 
          taskId={currentTaskId} 
          employeesAmount={taskSummary.find((task)=> task.taskId === currentTaskId)?.employeesAmount || 0} 
          taskDate={currentTaskDate} 
          taskBalancePoints={currentBalancePoints}
          setRefreshTasks={setRefreshTasks} />}
    </div>
  );
};

export default CalendarPage;
