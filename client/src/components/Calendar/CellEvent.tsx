import React from 'react'
import { APP_COLOR } from '../../theme'
import { CalendarPages, TaskOccupancy } from './CalendarSetup';

type CellEventProps = {
    data: TaskOccupancy;
    date: Date,
    page: CalendarPages;
};

export const CellEvent: React.FC<CellEventProps> = ({ data, date, page }) => {
    let eventBgColor: string, eventText: string = "";

    switch (page) {
        case CalendarPages.MANAGER:
            const isFullyAssigned = data?.assigned === data?.total;
            const taskOccupancy = (data ? `${data.assigned}/${data.total}` : "0/0");
            eventBgColor = isFullyAssigned ? APP_COLOR.MINT_GREEN : APP_COLOR.LIGHT_RED;
            eventText = `task - ${taskOccupancy} assigned`;
            break;
        case CalendarPages.SWAP:
            eventBgColor = data?.isAssignedToCurrentUser ? APP_COLOR.LIGHT_RED : APP_COLOR.ALICE_BLUE_DARKER;
            eventText = data?.isAssignedToCurrentUser ? `My Task` : `Others Task`;
            break;
        case CalendarPages.PROFILE:
            eventBgColor = date < new Date() ? APP_COLOR.MINT_GREEN : APP_COLOR.ALICE_BLUE_DARKER;
            eventText = `Task`;
            break;
        default:
            eventBgColor = APP_COLOR.ALICE_BLUE_DARKER;
            break;
    }

    return (
        <div style={{ fontSize: '0.9rem', marginTop: '0.25rem', backgroundColor: eventBgColor }}>
            {eventText}
        </div>
    );
};