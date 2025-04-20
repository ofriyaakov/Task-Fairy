import React, { useState } from "react";
import { Calendar, Event as RBCEvent } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { localizer, TaskSummary } from './CalendarSetup'
import './Calendar.css'
import { CustomToolbar } from "./CustomToolbar";
import { CellContent } from "./CellContent";

  type MyCalendarProps = {
    events: RBCEvent[]
    taskSummary: TaskSummary
  }

export const MyCalendar = ({ events, taskSummary }: MyCalendarProps) => {

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date())

  return (
    <Calendar
      localizer={localizer}
      events={events}
      defaultView="month"
      date={currentMonthDate}
      onNavigate={(date) => {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
        setCurrentMonthDate(startOfMonth)
      }}
      views={['month']}
      components={{
        dateCellWrapper: ({ children, value }) => { 
          return <CellContent
          children={children}
          value={value}
          taskSummary={taskSummary}
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
