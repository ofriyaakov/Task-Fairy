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