export interface RawSwapRequest {
    first_user_id: string,
    first_user_first_name: string,
    first_user_last_name: string,
    first_task_name: string,
    first_task_start_time: string,
    first_task_end_time: string,
    second_user_id: string,
    second_user_first_name: string,
    second_user_last_name: string,
    second_task_name: string,
    second_task_start_time: string,
    second_task_end_time: string
}

export interface RawFullSwapRequest extends RawSwapRequest {
    status: string
}