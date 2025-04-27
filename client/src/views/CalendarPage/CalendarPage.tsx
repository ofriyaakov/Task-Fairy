import React, { useState } from 'react';
import SuggestionsDialog from './../../components/SuggestionsModal'
import { MyCalendar } from '../../components/Calendar/Calendar';
import { CalendarTask } from '../../types/Task';

const CalendarPage: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(true)

  const taskSummary: CalendarTask[] = [
    {
      name: 'Task 1',
      location: 'Location 1',
      startTime: '16:00:00',
      endTime: '18:00:00',
      balancePoints: 5,
      gender: "Male",
      taskId: "111111-tttttyyy-333",
      date: '2025-04-01',
      employeesAmount: 3,
      assignedEmployeesAmount: 3
    },
    {
      name: 'Task 2',
      location: 'Location 2',
      startTime: '16:00:00',
      endTime: '18:00:00',
      balancePoints: 5,
      gender: "Male",
      taskId: "111111-tttttyyy-555",
      date: '2025-04-03',
      employeesAmount: 1,
      assignedEmployeesAmount: 1
    }, 
    {
      name: 'Task 3',
      location: 'Location 3',
      startTime: '16:00:00',
      endTime: '18:00:00',
      balancePoints: 5,
      gender: "Male",
      taskId: "111111-tttttyyy-555",
      date: '2025-04-28',
      employeesAmount: 7,
      assignedEmployeesAmount: 5
    }]

    return <div className='App' style={{height: "60vh", width: "80%"}}>
    <MyCalendar taskSummary={taskSummary} ></MyCalendar>
    </div>;

  //     //CHANGE AFTER CONNECTING THE CALEMDER AND THE MODAL
  // return <SuggestionsDialog open={isModalOpen} setIsModalOpen={setIsModalOpen} />;
  };
  
  export default CalendarPage;
  