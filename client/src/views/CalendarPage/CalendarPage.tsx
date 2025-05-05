import React, { useEffect, useState } from 'react';
import SuggestionsDialog from './../../components/SuggestionsModal'
import { MyCalendar } from '../../components/Calendar/Calendar';
import { CalendarTask } from '../../types/Task';
import { getAllTasksByMonth } from '../../queries/task';
import TasksList from './../../components/TasksList'
import { toast } from 'react-toastify';

const CalendarPage: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [taskSummary, setTaskSummary] = useState<CalendarTask[]>([]);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date())
  const [taskListByDate, setTaskListByDate] = useState<CalendarTask[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string>('')

  {/*TODO - show list of tasks on click. "tasksByDate" contains the relevant data*/ }
  const handleCellClick = (date: string) => {
    const tasksByDate = taskSummary.filter(task => task.date === date);
    setTaskListByDate(tasksByDate)
  };

  const handleTaskCardClick = (taskId: string) => {
    setCurrentTaskId(taskId)
    setIsModalOpen(true)
  };

  const navigateMonth = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    setCurrentMonthDate(startOfMonth)
  }

  const fetchTasks = async () => {
    try {
      const fetchedTasks: CalendarTask[] = await getAllTasksByMonth(currentMonthDate.getMonth() + 1)
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
    <div className='App' style={{ height: "86vh", width: "100%", display: "flex" }}>
      {loadingTasks ? <div>Loading...</div> :
        <MyCalendar taskSummary={taskSummary} date={currentMonthDate} navigateMonth={navigateMonth} handleCellClick={handleCellClick} ></MyCalendar>
      }
      {taskListByDate.length !== 0 && <div style={{marginLeft:"1vw"}}><TasksList title={'Tasks'} tasks={taskListByDate} handleCardClick={handleTaskCardClick}/></div>}
      {isModalOpen && <SuggestionsDialog open={isModalOpen} setIsModalOpen={setIsModalOpen} taskId={currentTaskId} employeesAmount={taskSummary.find((task)=> task.taskId === currentTaskId)?.employeesAmount || 0} />}
    </div>
  );
};

export default CalendarPage;
