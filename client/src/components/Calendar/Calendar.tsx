import React, { useEffect, useState } from "react";
import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { localizer, TaskSummary } from './CalendarSetup'
import './Calendar.css'
import { CustomToolbar } from "./CustomToolbar";
import { CellContent } from "./CellContent";
import { CalendarTask } from "../../types/Task";
import { calendarMonthView } from "../../consts";

  type MyCalendarProps = {
    taskSummary: CalendarTask[]
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


export const MyCalendar = ({taskSummary }: MyCalendarProps) => {

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date())
  const [calendarTasks, setCalendarTasks] = useState<TaskSummary>()

  const navigateMonth = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    setCurrentMonthDate(startOfMonth)
  }

  useEffect(() => {
    setCalendarTasks(taskToCalendarEvents(taskSummary))
  }, [])

  return (
    <Calendar
      localizer={localizer}
      defaultView={calendarMonthView}
      date={currentMonthDate}
      onNavigate={navigateMonth}
      views={[calendarMonthView]}
      components={{
        dateCellWrapper: ({ children, value }) => { 
          return <CellContent
          children={children}
          date={value}
          taskSummary={calendarTasks!!}
          currentMonthDate={currentMonthDate}></CellContent>
        },
        month: {
          dateHeader: () => null
        },
        toolbar: CustomToolbar,
      }}
    />
  )
}
