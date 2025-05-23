import React from 'react'
import { format } from 'date-fns'
import { CellDateHeader } from './CellDateHeader'
import { TaskOccupancy, TaskSummary } from './CalendarSetup'
import {calendarFnsDateFormat } from '../../consts'
import { APP_COLOR } from '../../theme'
import { CellEvent } from './CellEvent'

type CellContentProps = {
    children: any,
    date: Date,
    currentMonthDate: Date,
    taskSummary: TaskSummary,
    handleCellClick: (date: string) => void,
    selectedDate: string,
    isManagerView: boolean
}

export const CellContent: React.FC<CellContentProps> = ({ children, date, taskSummary, currentMonthDate, handleCellClick, isManagerView, selectedDate}) => {
    const dateStr = format(date, calendarFnsDateFormat);
    const dayData = taskSummary && taskSummary[dateStr];
    const isDateOutOfMonth = date.getMonth() !== currentMonthDate.getMonth();
    const dayNumber: number = date.getDate();
  
    const border =  isDateOutOfMonth ? "" : dateStr === selectedDate ? `1px solid ${APP_COLOR.DARK_GREY}` : `0.8px solid ${APP_COLOR.PLATINUM_GREY}`;
    const bgColor = isDateOutOfMonth ? APP_COLOR.WHITE : APP_COLOR.OFF_WHITE;
  
    return (
      <div style={{ height: '100%', flex: '1 0', border: border, position: 'relative', backgroundColor: bgColor }} 
        onClick={()=> handleCellClick(dateStr)}> 
        
        {!isDateOutOfMonth && (
          <div style={{ padding: '0.25rem' }}>
            <CellDateHeader label={dayNumber} />
            {children}
            {dayData && dayData.map((data: TaskOccupancy, index: number) => {
              return (
                <CellEvent key={index} data={data} date={date} isManagerView={isManagerView} />
              );
            })}
          </div>
        )}
      </div>
    );
  };
