export interface SwapCardDetails {
    employeeId: string;
    employeeFirstName: string;
    employeeLastName: string;
    taskName: string;
    taskStartTime: string;
    taskEndTime: string;
}

export interface SwapRequest {
    leftDetails: SwapCardDetails;
    rightDetails: SwapCardDetails;
}

export interface SwapRequestPayload {
    requestingUserId: string;
    requestingTaskId: string;
    requestedUserId: string;
    requestedTaskId: string;
    date: Date;
}