import React  from "react";
import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { localizer, TaskSummary } from './CalendarSetup'
import './Calendar.css'
import { CustomToolbar } from "./CustomToolbar";
import { CellContent } from "./CellContent";
import { CalendarTask } from "../../types/Task";
import { calendarMonthView } from "../../consts";

  type MyCalendarProps = {
    taskSummary: CalendarTask[],
    date: Date,
    navigateMonth: (date: Date) => void,
    handleCellClick?: (date: string) => void,
    isManagerView: boolean
  }

export const taskToCalendarEvents = (taskSummary: CalendarTask[]): TaskSummary => {
  const calendarEvents: TaskSummary = {}

  taskSummary.forEach(task => {
    const dateStr = task.date
    if (!calendarEvents[dateStr]) {
      calendarEvents[dateStr] = [{assigned: task.assignedEmployeesAmount, total: task.employeesAmount }]
    } else {
      calendarEvents[dateStr].push({assigned: task.assignedEmployeesAmount, total: task.employeesAmount })
    }
  })

  return calendarEvents
}


export const MyCalendar = ({taskSummary, date, navigateMonth, handleCellClick, isManagerView}: MyCalendarProps) => {
  const calendarTasks = taskToCalendarEvents(taskSummary);

  const [selectedDate, setSelectedDate] = React.useState<string>("");

  const handleClick = (date: string) => {
    if (handleCellClick) {
      setSelectedDate(date);
      handleCellClick(date);
    }
  };

  return (
    <Calendar
      localizer={localizer}
      defaultView={calendarMonthView}
      date={date}
      onNavigate={navigateMonth}
      views={[calendarMonthView]}
      style={{width:"100%"}}
      components={{
        dateCellWrapper: ({ children, value }) => { 
          return <CellContent
          children={children}
          date={value}
          taskSummary={calendarTasks!!}
          currentMonthDate={date}
          handleCellClick={handleClick}
          isManagerView={isManagerView}
          selectedDate={selectedDate}></CellContent>
        },
        month: {
          dateHeader: () => null
        },
        toolbar: CustomToolbar,
      }}
    />
  )
}
