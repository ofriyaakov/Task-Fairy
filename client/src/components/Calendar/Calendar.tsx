import React  from "react";
import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { CalendarPages, localizer, TaskSummary } from './CalendarSetup'
import './Calendar.css'
import { CustomToolbar } from "./CustomToolbar";
import { CellContent } from "./CellContent";
import { CalendarTask } from "../../types/Task";
import { calendarMonthView } from "../../consts";

  type MyCalendarProps = {
    taskSummary: CalendarTask[],
    date: Date,
    navigateMonth: (date: Date) => void,
    handleCellClick: (date: string) => void,
    page: CalendarPages,
  }

export const taskToCalendarEvents = (taskSummary: CalendarTask[]): TaskSummary => {
  const calendarEvents: TaskSummary = {}

  if (taskSummary && taskSummary.length > 0) {
    taskSummary?.forEach(task => {
      const dateStr = task.date
      if (!calendarEvents[dateStr]) {
        calendarEvents[dateStr] = [{assigned: task.assignedEmployeesAmount, total: task.employeesAmount, isAssignedToCurrentUser: task.isAssignedToCurrentUser}]
      } else {
        calendarEvents[dateStr].push({assigned: task.assignedEmployeesAmount, total: task.employeesAmount, isAssignedToCurrentUser: task.isAssignedToCurrentUser})
      }
    })
  }

  return calendarEvents
}


export const MyCalendar = ({taskSummary, date, navigateMonth, handleCellClick, page}: MyCalendarProps) => {
  const calendarTasks = taskToCalendarEvents(taskSummary);

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
          handleCellClick={handleCellClick}
          page={page}></CellContent>
        },
        month: {
          dateHeader: () => null
        },
        toolbar: CustomToolbar,
      }}
    />
  )
}
