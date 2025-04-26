import React from 'react';
import { MyCalendar } from '../../components/Calendar/Calendar';

const CalendarPage: React.FC = () => {
  const taskSummary = {
    '2025-04-03': { assigned: 1, total: 1 },
    '2025-04-01': { assigned: 3, total: 3 },
    '2025-04-30': { assigned: 5, total: 8 },
    // etc...
  }
  const events = [
    {
      start: new Date(2025, 0, 1),
      end: new Date(2025, 0, 1),
      title: 'New Year\'s Day',
    },
    {
      start: new Date(2025, 0, 2),
      end: new Date(2025, 0, 2),
      title: 'Day after New Year\'s Day',
    },
  ]

    return <div className='App' style={{height: "60vh", width: "80%"}}>
    <MyCalendar events={events} taskSummary={taskSummary} ></MyCalendar>
    </div>;
  };
  
  export default CalendarPage;
  