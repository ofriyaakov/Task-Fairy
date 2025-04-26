import React from 'react'
import { format } from 'date-fns'
import { CellDateHeader } from './CellDateHeader'
import { TaskSummary } from './CalendarSetup'
import { APP_COLOR } from '../../consts'

type CellContentProps = {
    children: any,
    value: any,
    currentMonthDate: Date,
    taskSummary: TaskSummary
}

export const CellContent: React.FC<CellContentProps> = ({ children, value, taskSummary, currentMonthDate}) => {
    const dateStr = format(value, 'yyyy-MM-dd')
    const dayData = taskSummary[dateStr]
    const isFullyAssigned = dayData?.assigned === dayData?.total
    const isDateOutOfMonth = value.getMonth() !== currentMonthDate.getMonth()
    const dayNumber: number = value.getDate()
    const taskOccupancy = dayData ? `${dayData.assigned}/${dayData.total}` : "0/0"

    let bgColor: string;

    if (isDateOutOfMonth) {
        bgColor = APP_COLOR.WHITE
    } else {
        if (!dayData) {
            bgColor = APP_COLOR.OFF_WHITE
        } else {
            bgColor = isFullyAssigned ? APP_COLOR.MINT_GREEN : APP_COLOR.LIGHT_RED
        }
    }

    const border = isDateOutOfMonth ? "" : `0.8px solid ${APP_COLOR.PLATINUM_GREY}`

    return (
        <div style={{ backgroundColor: bgColor, height: '100%', flex: '1 0', border: border, position: 'relative'  }}>
            {!isDateOutOfMonth && (
                <div style={{ padding: '0.25rem' }}>
                    <CellDateHeader label={dayNumber} />
                    {children}
                    
                    {dayData && (
                        <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                            task - {taskOccupancy} assigned
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
  