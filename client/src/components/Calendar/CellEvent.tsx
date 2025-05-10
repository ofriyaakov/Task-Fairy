import React from 'react'
import { APP_COLOR } from '../../theme'
import { TaskOccupancy } from './CalendarSetup';

type CellEventProps = {
    data: TaskOccupancy;
    date: Date,
    isManagerView: boolean;
};

export const CellEvent: React.FC<CellEventProps> = ({ data, date, isManagerView }) => {
    const isFullyAssigned = isManagerView && data?.assigned === data?.total;
    const taskOccupancy = isManagerView && (data ? `${data.assigned}/${data.total}` : "0/0");

    let eventBgColor;
    if (isManagerView === true) {
        eventBgColor = isFullyAssigned ? APP_COLOR.MINT_GREEN : APP_COLOR.LIGHT_RED;
    } else {
        eventBgColor = date < new Date() ? APP_COLOR.MINT_GREEN : APP_COLOR.ALICE_BLUE_DARKER;
    }

    return (
        <div style={{ fontSize: '0.9rem', marginTop: '0.25rem', backgroundColor: eventBgColor }}>
            {isManagerView 
                ? (`task - ${taskOccupancy} assigned`)
                : (`Task`)
            }
        </div>
    );
};