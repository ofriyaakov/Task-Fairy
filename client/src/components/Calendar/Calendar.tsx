import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, Event as RBCEvent } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { localizer } from './CalendarSetup'
import { format } from 'date-fns'
import './Calendar.css' // your own styling
import { CellDateHeader } from "./CellDateHeader";
import { CustomToolbar } from "./CustomToolbar";

type TaskSummary = {
    [date: string]: {
      assigned: number
      total: number
    }
  }
  
  type MyCalendarProps = {
    events: RBCEvent[] // or a more specific type if your event has custom fields
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
      style={{ height: '80vh' }}
      components={{
        dateCellWrapper: ({ children, value }) => {
          const dateStr = format(value, 'yyyy-MM-dd')
          const dayData = taskSummary[dateStr]
          const isFullyAssigned = dayData?.assigned === dayData?.total
          const isOutOfMonth = value.getMonth() !== currentMonthDate.getMonth()

          const bgColor = isOutOfMonth
          ? 'white'
          : !dayData
          ? '#FAFAFA'
          : isFullyAssigned
          ? '#d4f8e8'
          : '#f8d4d4'

          const border = isOutOfMonth ? "" : '0.8px solid #E6E6E6'

          const dayNumber: number = value.getDate()

          return (
            <div style={{ backgroundColor: bgColor, height: '100%', flex: '1 0', border: border, position: 'relative'  }}>
              <div style={{ padding: '4px' }}>
                {!isOutOfMonth && (
                  <CellDateHeader label={dayNumber} />
                )}
             
                {children} 
                 {!isOutOfMonth && dayData && (
                  <div style={{ fontSize: '0.8em', marginTop: '4px' }}>
                    task - {dayData.assigned}/{dayData.total} assigned
                  </div>
                )}
              </div>
            </div>
          )
        },
        month: {
          dateHeader: () => null
        },
        toolbar: CustomToolbar,
      }}
    />
  )
}
