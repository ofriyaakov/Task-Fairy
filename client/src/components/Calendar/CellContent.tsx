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
    const isOutOfMonth = value.getMonth() !== currentMonthDate.getMonth()

    const bgColor = isOutOfMonth
    ? APP_COLOR.WHITE
    : !dayData
    ? APP_COLOR.OFF_WHITE
    : isFullyAssigned
    ? APP_COLOR.MINT_GREEN
    : APP_COLOR.LIGHT_RED

    const border = isOutOfMonth ? "" : `0.8px solid ${APP_COLOR.PLATINUM_GREY}`

    const dayNumber: number = value.getDate()

    return (
        <div style={{ backgroundColor: bgColor, height: '100%', flex: '1 0', border: border, position: 'relative'  }}>
            <div style={{ padding: '0.25rem' }}>
            {!isOutOfMonth && (
                <CellDateHeader label={dayNumber} />
            )}
            
            {children} 
                {!isOutOfMonth && dayData && (
                <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                task - {dayData.assigned}/{dayData.total} assigned
                </div>
            )}
            </div>
        </div>
    )
}
  