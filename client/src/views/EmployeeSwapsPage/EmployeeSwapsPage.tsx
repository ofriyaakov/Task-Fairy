import React, { useEffect, useState } from 'react';
import { MyCalendar } from '../../components/Calendar/Calendar';
import { CalendarTask } from '../../types/Task';
import { getAllTasksByMonth } from '../../queries/task';
import TasksList from './../../components/TasksList'
import { toast } from 'react-toastify';
import { BeatLoader } from 'react-spinners';
import { useGlobalContext } from '../../contexts/GlobalContext';
import TaskEmployeesDialog from "../../components/SwapEmployeeModal";

const EmployeeSwapsPage: React.FC = () => {

    const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
    const [taskSummary, setTaskSummary] = useState<CalendarTask[]>([]);
    const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date())
    const [taskListByDate, setTaskListByDate] = useState<CalendarTask[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentTaskId, setCurrentTaskId] = useState<string>('');
    const [currentTaskDate, setCurrentTaskDate] = useState<Date>(new Date());
    const [currentBalancePoints, setCurrentBalancePoints] = useState<number>(0);
      
    const { connectedUser } = useGlobalContext();

    const handleTaskCardClick = (taskId: string, taskDate: Date, balancePoints: number) => {
        setCurrentTaskId(taskId)
        setIsModalOpen(true)
        setCurrentTaskDate(taskDate)
        setCurrentBalancePoints(balancePoints)
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

    return (
        <div className='App' style={{ height: "60vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {loadingTasks ? <BeatLoader color="#36d7b7" loading={loadingTasks} size={20} /> :
          <MyCalendar 
            taskSummary={taskSummary}
            date={currentMonthDate}
            navigateMonth={navigateMonth}
            handleCellClick={handleCellClick}
            isManagerView={false} />
          }
          {taskListByDate.length !== 0 && <div style={{marginLeft:"1vw"}}>
            <TasksList title={'Tasks'} tasks={taskListByDate} height='52vh' handleCardClick={handleTaskCardClick}/></div>}
        {isModalOpen && 
            <TaskEmployeesDialog 
            open={isModalOpen} 
            setIsModalOpen={setIsModalOpen} 
            taskId={currentTaskId} 
            employeesAmount={4} 
            taskDate={currentTaskDate} taskBalancePoints={currentBalancePoints} />
        }
        </div>
      );
};
  
export default EmployeeSwapsPage;