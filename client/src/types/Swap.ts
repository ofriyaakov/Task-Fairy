export interface SwapCardDetails {
  employeeId: string;
  employeeFirstName: string;
  employeeLastName: string;
  taskName: string;
  taskStartTime: string;
  taskEndTime: string;
}
export type SwapRequestStatus = "1" | "2" | "3";

export interface SwapRequest {
  leftDetails: SwapCardDetails;
  rightDetails: SwapCardDetails;
  swapRequestId: string;
}
