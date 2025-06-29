export interface RawSwapRequest {
  first_user_id: string;
  first_user_first_name: string;
  first_user_last_name: string;
  first_task_name: string;
  first_task_start_time: string;
  first_task_end_time: string;
  second_user_id: string;
  second_user_first_name: string;
  second_user_last_name: string;
  second_task_name: string;
  second_task_start_time: string;
  second_task_end_time: string;
  swap_request_id: string;
}

export interface SwapRequestPayload {
  requestingUserId: string;
  requestingTaskId: string;
  requestedUserId: string;
  requestedTaskId: string;
  date: Date;
}

export interface RawFullSwapRequest extends RawSwapRequest {
  status: string;
  first_task_id: string;
  second_task_id: string;
}

export enum SwapRequestStatus {
  Approved = 1,
  Pending = 2,
  Denied = 3,
}
