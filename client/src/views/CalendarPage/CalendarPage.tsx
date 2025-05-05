import React, { useEffect, useState } from 'react';
import SuggestionsDialog from './../../components/SuggestionsModal'
import { MyCalendar } from '../../components/Calendar/Calendar';
import { CalendarTask } from '../../types/Task';
import { getAllTasksByMonth } from '../../queries/task';

const CalendarPage: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [taskSummary, setTaskSummary] = useState<CalendarTask[]>([]);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date())

  {/*TODO - show list of tasks on click. "tasksByDate" contains the relevant data*/}
  const handleCellClick = (date: string) => { 
    const tasksByDate = taskSummary.filter(task => task.date === date);
    console.log("tasksByDate: ", tasksByDate);
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
      setTaskSummary([])
      setLoadingTasks(false);
    }
  }

  useEffect(() => {
    setLoadingTasks(true);
    fetchTasks();
  }, [currentMonthDate]);

  return (
    <div className='App' style={{height: "60vh", width: "80%"}}>
      {loadingTasks ? <div>Loading...</div> :
      <MyCalendar 
        taskSummary={taskSummary}
        date={currentMonthDate}
        navigateMonth={navigateMonth}
        handleCellClick={handleCellClick}
        isManagerView={true} />
      }
    </div>
  );

  //     //CHANGE AFTER CONNECTING THE CALEMDER AND THE MODAL
  // return <SuggestionsDialog open={isModalOpen} setIsModalOpen={setIsModalOpen} />;
  };
  
  export default CalendarPage;
  