export interface SwapCardDetails {
  employeeId: string;
  employeeFirstName: string;
  employeeLastName: string;
  taskName: string;
  taskStartTime: string;
  taskEndTime: string;
}
export enum SwapRequestStatus {
    Approved = "1",
    Pending = "2",
    Denied = "3",
  }

export interface SwapRequest {
  leftDetails: SwapCardDetails;
  rightDetails: SwapCardDetails;
  swapRequestId: string;
}

export interface SwapRequestPayload {
    requestingUserId: string;
    requestingTaskId: string;
    requestedUserId: string;
    requestedTaskId: string;
    date: Date;
}