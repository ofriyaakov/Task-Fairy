import React from 'react'
import { APP_COLOR } from '../../theme'
import { TaskOccupancy } from './CalendarSetup';

type CellEventProps = {
    data: TaskOccupancy;
};

export const CellEvent: React.FC<CellEventProps> = ({ data }) => {
    const isFullyAssigned = data?.assigned === data?.total;
    const taskOccupancy = data ? `${data.assigned}/${data.total}` : "0/0";
    const eventBgColor = isFullyAssigned ? APP_COLOR.MINT_GREEN : APP_COLOR.LIGHT_RED;

    return (
        <div style={{ fontSize: '0.9rem', marginTop: '0.25rem', backgroundColor: eventBgColor }}>
            task - {taskOccupancy} assigned
        </div>
    );
};